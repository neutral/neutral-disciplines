import { createHash } from "node:crypto";
import { lstat, readFile, readdir } from "node:fs/promises";
import { posix, resolve, sep } from "node:path";
import { TextDecoder } from "node:util";

export const SHA256_PATTERN = /^sha256:[0-9a-f]{64}$/u;
export const RECORD_ID_PATTERN = /^discipline(?:\.[a-z0-9]+(?:-[a-z0-9]+)*)+$/u;
export const PACK_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]*$/u;

const KNOWLEDGE_ID_PATTERN = /^(?:behavior|assurance|blueprint|description|check|discipline)(?:\.[a-z0-9]+(?:-[a-z0-9]+)*)+$/u;
const OWNER_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@/-]*$/u;
const TAG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const EXTENSION_KEY_PATTERN = /^x-[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const SOURCE_ROLES = new Set(["decision", "research", "policy", "incident", "atlas-context", "external-standard", "repository-reality", "other"]);

export function compareCodePoints(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

export function canonicalJson(value) {
  if (value === null || typeof value === "boolean" || typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error("Canonical JSON rejects non-finite numbers in Pack data");
    if (Number.isInteger(value) && !Number.isSafeInteger(value)) throw new Error("Canonical JSON rejects unsafe integers in Pack data");
    return JSON.stringify(Object.is(value, -0) ? 0 : value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (typeof value === "object") {
    return `{${Object.keys(value).sort(compareCodePoints).map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(",")}}`;
  }
  throw new Error(`Unsupported canonical JSON value: ${typeof value}`);
}

export function sha256(bytes) {
  return `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
}

export function selfDigest(value) {
  const { digest: _digest, ...subject } = value;
  return sha256(Buffer.from(canonicalJson(subject), "utf8"));
}

export function parseStrictJson(source, label) {
  if (typeof source !== "string") throw new Error(`${label} must be JSON text`);
  let index = 0;

  function fail(message) {
    throw new Error(`${label} is not strict JSON: ${message} at offset ${index}`);
  }

  function whitespace() {
    while (index < source.length && /[\u0009\u000a\u000d\u0020]/u.test(source[index])) index += 1;
  }

  function string() {
    if (source[index] !== '"') fail("expected string");
    const start = index;
    index += 1;
    let escaped = false;
    while (index < source.length) {
      const character = source[index];
      index += 1;
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === '"') {
        const token = source.slice(start, index);
        try {
          return JSON.parse(token);
        } catch (error) {
          fail(error instanceof Error ? error.message : String(error));
        }
      } else if (character.codePointAt(0) < 0x20) {
        fail("unescaped control character in string");
      }
    }
    fail("unterminated string");
  }

  function number() {
    const match = /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?/u.exec(source.slice(index));
    if (match === null) fail("invalid number");
    index += match[0].length;
  }

  function value() {
    whitespace();
    const character = source[index];
    if (character === "{") return object();
    if (character === "[") return arrayValue();
    if (character === '"') return string();
    for (const literal of ["true", "false", "null"]) {
      if (source.startsWith(literal, index)) {
        index += literal.length;
        return;
      }
    }
    if (character === "-" || /[0-9]/u.test(character ?? "")) return number();
    fail("expected value");
  }

  function object() {
    index += 1;
    whitespace();
    const keys = new Set();
    if (source[index] === "}") {
      index += 1;
      return;
    }
    while (index < source.length) {
      whitespace();
      const key = string();
      if (keys.has(key)) fail(`duplicate object key ${JSON.stringify(key)}`);
      keys.add(key);
      whitespace();
      if (source[index] !== ":") fail("expected colon after object key");
      index += 1;
      value();
      whitespace();
      if (source[index] === "}") {
        index += 1;
        return;
      }
      if (source[index] !== ",") fail("expected comma or closing brace");
      index += 1;
    }
    fail("unterminated object");
  }

  function arrayValue() {
    index += 1;
    whitespace();
    if (source[index] === "]") {
      index += 1;
      return;
    }
    while (index < source.length) {
      value();
      whitespace();
      if (source[index] === "]") {
        index += 1;
        return;
      }
      if (source[index] !== ",") fail("expected comma or closing bracket");
      index += 1;
    }
    fail("unterminated array");
  }

  value();
  whitespace();
  if (index !== source.length) fail("unexpected trailing content");
  try {
    return JSON.parse(source);
  } catch (error) {
    throw new Error(`${label} is not strict JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function objectValue(value, label) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} must be an object`);
  return value;
}

function keys(value, required, optional, label, { extensions = false } = {}) {
  const source = objectValue(value, label);
  const requiredSet = new Set(required);
  const allowed = new Set([...required, ...optional]);
  for (const key of required) if (!Object.hasOwn(source, key)) throw new Error(`${label} is missing required member ${key}`);
  for (const key of Object.keys(source)) {
    if (!allowed.has(key) && !(extensions && EXTENSION_KEY_PATTERN.test(key))) throw new Error(`${label} has unsupported member ${key}`);
  }
  if (requiredSet.size !== required.length || allowed.size !== required.length + optional.length) throw new Error(`${label} validator has duplicate key declarations`);
  return source;
}

function boundedString(value, label, maximum, pattern) {
  if (typeof value !== "string" || value.length === 0 || value.length > maximum || (pattern !== undefined && !pattern.test(value))) {
    throw new Error(`${label} is invalid`);
  }
  return value;
}

function plainText(value, label) {
  const result = boundedString(value, label, 16_384);
  if (result.includes("\u0000")) throw new Error(`${label} contains a null character`);
  return result;
}

function singleLine(value, label) {
  const result = boundedString(value, label, 1_024);
  if (/[\u0000-\u001f\u007f-\u009f\u2028\u2029]/u.test(result)) throw new Error(`${label} must be one line without control characters`);
  return result;
}

function opaqueId(value, label) {
  return boundedString(value, label, 160, PACK_ID_PATTERN);
}

function ownerId(value, label) {
  return boundedString(value, label, 160, OWNER_ID_PATTERN);
}

function knowledgeId(value, label) {
  return boundedString(value, label, 160, KNOWLEDGE_ID_PATTERN);
}

function disciplineId(value, label) {
  const result = knowledgeId(value, label);
  if (!RECORD_ID_PATTERN.test(result)) throw new Error(`${label} must be a Discipline identity`);
  return result;
}

function digest(value, label) {
  if (typeof value !== "string" || !SHA256_PATTERN.test(value)) throw new Error(`${label} must be a lowercase SHA-256 digest`);
  return value;
}

function integer(value, label, maximum = Number.MAX_SAFE_INTEGER) {
  if (!Number.isSafeInteger(value) || value < 1 || value > maximum) throw new Error(`${label} must be a positive integer no greater than ${maximum}`);
  return value;
}

function array(value, label, minimum, maximum) {
  if (!Array.isArray(value) || value.length < minimum || value.length > maximum) {
    throw new Error(`${label} must contain between ${minimum} and ${maximum} members`);
  }
  return value;
}

function uniqueStringArray(value, label, minimum, maximum, validator = plainText) {
  const result = array(value, label, minimum, maximum).map((entry, index) => validator(entry, `${label} member ${index}`));
  if (new Set(result).size !== result.length) throw new Error(`${label} must not contain duplicates`);
  return result;
}

function uriReference(value, label) {
  const result = boundedString(value, label, 8_192);
  if (/\s|[\u0000-\u001f\u007f]/u.test(result)) throw new Error(`${label} must be a URI reference without whitespace or controls`);
  try {
    new URL(result, "https://lifecycle.invalid/");
  } catch {
    throw new Error(`${label} must be a URI reference`);
  }
  return result;
}

function extensions(value, standard) {
  const standardKeys = new Set(standard);
  return Object.fromEntries(Object.entries(value).filter(([key]) => !standardKeys.has(key)).sort(([left], [right]) => compareCodePoints(left, right)));
}

function parseSupersedes(value, id, revision, label) {
  if (revision === 1) {
    if (value !== null) throw new Error(`${label} revision 1 must have null supersedes`);
    return null;
  }
  const source = keys(value, ["id", "revision", "sourceDigest", "semanticDigest"], [], `${label} supersedes`);
  const result = {
    id: knowledgeId(source.id, `${label} supersedes id`),
    revision: integer(source.revision, `${label} supersedes revision`),
    sourceDigest: digest(source.sourceDigest, `${label} supersedes sourceDigest`),
    semanticDigest: digest(source.semanticDigest, `${label} supersedes semanticDigest`),
  };
  if (result.id !== id || result.revision !== revision - 1) throw new Error(`${label} supersedes must bind revision ${revision - 1} of ${id}`);
  return result;
}

function parseSource(value, index, label) {
  const memberLabel = `${label} source ${index}`;
  const source = keys(value, ["id", "required", "reference", "revision", "digest", "role"], [], memberLabel);
  if (typeof source.required !== "boolean") throw new Error(`${memberLabel} required must be boolean`);
  if (source.required !== false) throw new Error(`${memberLabel} required must be false for Discipline guidance`);
  if (source.revision !== null) opaqueId(source.revision, `${memberLabel} revision`);
  if (source.digest !== null) digest(source.digest, `${memberLabel} digest`);
  if (typeof source.role !== "string" || !SOURCE_ROLES.has(source.role)) throw new Error(`${memberLabel} role is invalid`);
  return {
    id: opaqueId(source.id, `${memberLabel} id`),
    required: source.required,
    reference: uriReference(source.reference, `${memberLabel} reference`),
    revision: source.revision,
    digest: source.digest,
    role: source.role,
  };
}

function parseRelationship(value, index, label) {
  const memberLabel = `${label} relationship ${index}`;
  const standard = ["type", "target", "required", "scope", "rationale"];
  const source = keys(value, ["type", "target", "required"], ["scope", "rationale"], memberLabel, { extensions: true });
  if (source.type !== "related-to" || source.required !== false) throw new Error(`${memberLabel} must be an optional related-to edge`);
  const result = {
    type: "related-to",
    target: knowledgeId(source.target, `${memberLabel} target`),
    required: false,
    ...(Object.hasOwn(source, "scope") ? { scope: source.scope === null ? null : plainText(source.scope, `${memberLabel} scope`) } : {}),
    ...(Object.hasOwn(source, "rationale") ? { rationale: source.rationale === null ? null : plainText(source.rationale, `${memberLabel} rationale`) } : {}),
    ...extensions(source, standard),
  };
  return result;
}

function decodeUtf8(bytes, path) {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    throw new Error(`${path} is not valid UTF-8`);
  }
}

export function parseDisciplineRecord(bytes, path) {
  const text = decodeUtf8(bytes, path);
  const normalized = text.replaceAll("\r\n", "\n");
  if (!normalized.startsWith("---\n")) throw new Error(`${path} must begin with JSON front matter`);
  const closing = normalized.indexOf("\n---\n", 4);
  if (closing < 0) throw new Error(`${path} has no closing front-matter delimiter`);
  const headerText = normalized.slice(4, closing);
  const body = normalized.slice(closing + 5);
  const label = `${path} front matter`;
  const header = keys(
    parseStrictJson(headerText, label),
    ["schema", "kind", "id", "title", "status", "revision", "supersedes", "summary", "owners", "sources", "relationships", "conflicts", "tags", "spec"],
    [],
    label,
    { extensions: true },
  );
  if (header.schema !== "lifecycle.knowledge-record.v2") throw new Error(`${path} must select lifecycle.knowledge-record.v2`);
  if (header.kind !== "discipline") throw new Error(`${path} must have kind discipline`);
  const id = disciplineId(header.id, `${path} id`);
  const title = singleLine(header.title, `${path} title`);
  if (!["draft", "current", "superseded", "retired"].includes(header.status)) throw new Error(`${path} has invalid status`);
  const revision = integer(header.revision, `${path} revision`, 2_147_483_647);
  const supersedes = parseSupersedes(header.supersedes, id, revision, path);
  const owners = uniqueStringArray(header.owners, `${path} owners`, 1, 1, ownerId).sort(compareCodePoints);

  const sources = array(header.sources, `${path} sources`, 0, 128).map((entry, index) => parseSource(entry, index, path));
  if (new Set(sources.map(({ id: sourceId }) => sourceId)).size !== sources.length) throw new Error(`${path} repeats a source identity`);
  sources.sort((left, right) => compareCodePoints(`${left.id}\0${left.reference}\0${left.revision ?? ""}`, `${right.id}\0${right.reference}\0${right.revision ?? ""}`));

  const relationships = array(header.relationships, `${path} relationships`, 0, 512).map((entry, index) => parseRelationship(entry, index, path));
  if (new Set(relationships.map(({ type, target }) => `${type}\0${target}`)).size !== relationships.length) throw new Error(`${path} repeats a relationship type and target`);
  relationships.sort((left, right) => compareCodePoints(`${left.type}\0${left.target}\0${left.scope ?? ""}`, `${right.type}\0${right.target}\0${right.scope ?? ""}`));

  if (!Array.isArray(header.conflicts) || header.conflicts.length !== 0) throw new Error(`${path} conflicts must be empty`);
  const tags = uniqueStringArray(header.tags, `${path} tags`, 0, 64, (value, tagLabel) => boundedString(value, tagLabel, 80, TAG_PATTERN)).sort(compareCodePoints);

  const specSource = keys(header.spec, ["practice", "appliesWhen", "doesNotApplyWhen", "guidance", "verification"], [], `${path} Discipline spec`);
  const spec = {
    practice: plainText(specSource.practice, `${path} practice`),
    appliesWhen: uniqueStringArray(specSource.appliesWhen, `${path} appliesWhen`, 1, 256),
    doesNotApplyWhen: uniqueStringArray(specSource.doesNotApplyWhen, `${path} doesNotApplyWhen`, 0, 256),
    guidance: uniqueStringArray(specSource.guidance, `${path} guidance`, 1, 256),
    verification: uniqueStringArray(specSource.verification, `${path} verification`, 0, 256),
  };

  const standard = ["schema", "kind", "id", "title", "status", "revision", "supersedes", "summary", "owners", "sources", "relationships", "conflicts", "tags", "spec"];
  const canonicalHeader = {
    schema: "lifecycle.knowledge-record.v2",
    kind: "discipline",
    id,
    title,
    status: header.status,
    revision,
    supersedes,
    summary: plainText(header.summary, `${path} summary`),
    owners,
    sources,
    relationships,
    conflicts: [],
    tags,
    spec,
    ...extensions(header, standard),
  };

  const lines = body.split("\n");
  const firstNonblank = lines.find((line) => line.trim().length > 0);
  const levelOne = lines.filter((line) => /^# (?!#)/u.test(line));
  if (firstNonblank !== `# ${title}` || levelOne.length !== 1) throw new Error(`${path} body must begin with exactly one level-one title matching its header`);
  for (const heading of ["Practice", "Applicability", "Guidance", "Verification"]) {
    if (lines.filter((line) => line === `## ${heading}`).length !== 1) throw new Error(`${path} must contain ## ${heading} exactly once`);
  }

  return Object.freeze({
    header: Object.freeze(canonicalHeader),
    body,
    sourceDigest: sha256(bytes),
    semanticDigest: sha256(Buffer.from(canonicalJson({ body, frontMatter: canonicalHeader }), "utf8")),
  });
}

export async function regularFiles(root) {
  const output = [];
  async function visit(directory, relative) {
    for (const name of (await readdir(directory)).sort(compareCodePoints)) {
      const absolute = resolve(directory, name);
      const child = relative === "" ? name : `${relative}/${name}`;
      const stat = await lstat(absolute);
      if (stat.isSymbolicLink()) throw new Error(`Symbolic links are not allowed: ${child}`);
      if (stat.isDirectory()) await visit(absolute, child);
      else if (stat.isFile()) {
        if ((stat.mode & 0o111) !== 0) throw new Error(`Executable files are not allowed: ${child}`);
        output.push(child);
      } else throw new Error(`Unsupported file kind: ${child}`);
    }
  }
  await visit(root, "");
  return output;
}

export async function recordInventory(packRoot) {
  const recordsRoot = resolve(packRoot, "records");
  const files = await regularFiles(recordsRoot);
  const unsupported = files.filter((path) => !path.endsWith(".md"));
  if (unsupported.length !== 0) throw new Error(`Pack records directory contains non-Markdown files: ${unsupported.join(", ")}`);
  const records = [];
  for (const relative of files) {
    const path = `records/${relative}`;
    const bytes = await readFile(resolve(packRoot, ...path.split("/")));
    const parsed = parseDisciplineRecord(bytes, path);
    records.push({
      id: parsed.header.id,
      path,
      revision: parsed.header.revision,
      sourceDigest: parsed.sourceDigest,
      semanticDigest: parsed.semanticDigest,
    });
  }
  return records.sort((left, right) => compareCodePoints(left.id, right.id));
}

function normalizedPath(value, label) {
  const result = boundedString(value, label, 4_096);
  const segments = result.split("/");
  if (
    result.includes("\\") ||
    posix.normalize(result) !== result ||
    posix.isAbsolute(result) ||
    segments.some((segment) => segment === "" || segment === "." || segment === "..")
  ) {
    throw new Error(`${label} must be a normalized relative path`);
  }
  return result;
}

export function assertSafePackPath(packRoot, path) {
  normalizedPath(path, "Pack-relative path");
  const absolute = resolve(packRoot, ...path.split("/"));
  const prefix = `${resolve(packRoot)}${sep}`;
  if (!absolute.startsWith(prefix)) throw new Error(`Pack path escapes its root: ${path}`);
  return absolute;
}

export async function loadManifest(path) {
  return parseStrictJson(await readFile(path, "utf8"), path);
}

export function validateManifestShape(manifest, path) {
  const source = keys(manifest, ["schema", "id", "title", "version", "publisher", "contract", "records", "sets", "digest"], [], `${path} manifest`);
  if (source.schema !== "lifecycle.discipline-pack.v1") throw new Error(`${path} has unsupported schema`);
  opaqueId(source.id, `${path} id`);
  singleLine(source.title, `${path} title`);
  opaqueId(source.version, `${path} version`);
  ownerId(source.publisher, `${path} publisher`);
  const contract = keys(source.contract, ["specificationRevision", "knowledgeRecordSchema"], [], `${path} contract`);
  if (contract.specificationRevision !== "lifecycle.foundation.1.0.0-rc.9" || contract.knowledgeRecordSchema !== "urn:lifecycle:schema:knowledge-record:v2") {
    throw new Error(`${path} must select the rc.9 Discipline contract`);
  }

  const recordIds = new Set();
  const recordPaths = new Set();
  const records = array(source.records, `${path} records`, 1, 65_536);
  for (const [index, value] of records.entries()) {
    const record = keys(value, ["id", "path", "revision", "sourceDigest", "semanticDigest"], [], `${path} record ${index}`);
    disciplineId(record.id, `${path} record ${index} id`);
    if (recordIds.has(record.id)) throw new Error(`${path} repeats record id ${record.id}`);
    recordIds.add(record.id);
    normalizedPath(record.path, `${path} record ${index} path`);
    if (!record.path.startsWith("records/") || !record.path.endsWith(".md")) throw new Error(`${path} has invalid Pack Discipline record path ${record.path}`);
    if (recordPaths.has(record.path)) throw new Error(`${path} repeats record path ${record.path}`);
    recordPaths.add(record.path);
    integer(record.revision, `${path} record ${index} revision`);
    digest(record.sourceDigest, `${path} record ${index} sourceDigest`);
    digest(record.semanticDigest, `${path} record ${index} semanticDigest`);
  }
  const sortedRecords = [...records].sort((left, right) => compareCodePoints(left.id, right.id));
  if (JSON.stringify(sortedRecords) !== JSON.stringify(records)) throw new Error(`${path} record inventory must be ordered by id`);

  const setIds = new Set();
  const sets = array(source.sets, `${path} sets`, 0, 4_096);
  for (const [index, value] of sets.entries()) {
    const set = keys(value, ["id", "title", "description", "recordIds"], [], `${path} Set ${index}`);
    opaqueId(set.id, `${path} Set ${index} id`);
    if (setIds.has(set.id)) throw new Error(`${path} repeats Set id ${set.id}`);
    setIds.add(set.id);
    singleLine(set.title, `${path} Set ${set.id} title`);
    plainText(set.description, `${path} Set ${set.id} description`);
    const members = uniqueStringArray(set.recordIds, `${path} Set ${set.id} recordIds`, 1, 4_096, disciplineId);
    if ([...members].sort(compareCodePoints).join("\n") !== members.join("\n")) throw new Error(`${path} Set ${set.id} recordIds must be ordered`);
    for (const id of members) if (!recordIds.has(id)) throw new Error(`${path} Set ${set.id} references unknown record ${id}`);
  }
  digest(source.digest, `${path} digest`);
}

export async function packRoots(repositoryRoot) {
  const packsRoot = resolve(repositoryRoot, "packs");
  const roots = [];
  for (const entry of (await readdir(packsRoot, { withFileTypes: true })).sort((left, right) => compareCodePoints(left.name, right.name))) {
    if (entry.isSymbolicLink() || !entry.isDirectory()) throw new Error(`packs/${entry.name} must be a regular directory`);
    roots.push(resolve(packsRoot, entry.name));
  }
  if (roots.length === 0) throw new Error("At least one Pack is required");
  return roots;
}
