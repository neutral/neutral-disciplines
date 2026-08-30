import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { canonicalJson, loadManifest, parseDisciplineRecord, selfDigest, validateManifestShape } from "./lib.mjs";

const repositoryRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));

test("Pack manifests reproduce their self-digests", async () => {
  for (const path of ["packs/go-engineering/pack.json", "packs/test-strategy/pack.json"]) {
    const manifest = await loadManifest(resolve(repositoryRoot, path));
    validateManifestShape(manifest, path);
    assert.equal(manifest.digest, selfDigest(manifest));
  }
});

test("a Pack Discipline record is a complete Knowledge record v2", async () => {
  const path = "packs/go-engineering/records/context-cancellation.md";
  const parsed = parseDisciplineRecord(await readFile(resolve(repositoryRoot, path)), path);
  assert.equal(parsed.header.kind, "discipline");
  assert.equal(parsed.header.spec.practice.length > 0, true);
  assert.match(parsed.sourceDigest, /^sha256:[0-9a-f]{64}$/u);
  assert.match(parsed.semanticDigest, /^sha256:[0-9a-f]{64}$/u);
});

test("Discipline records reject binding relationship forms", async () => {
  const path = "packs/go-engineering/records/context-cancellation.md";
  const source = await readFile(resolve(repositoryRoot, path), "utf8");
  const altered = source.replace(
    '"relationships": []',
    '"relationships": [{"type":"requires","target":"discipline.neutral.go-engineering.error-contracts","required":true}]',
  );
  assert.throws(
    () => parseDisciplineRecord(Buffer.from(altered, "utf8"), path),
    /must be an optional related-to edge/u,
  );
});

test("strict front matter rejects duplicate object keys", async () => {
  const path = "packs/go-engineering/records/context-cancellation.md";
  const source = await readFile(resolve(repositoryRoot, path), "utf8");
  const altered = source.replace(
    '"kind": "discipline",',
    '"kind": "discipline",\n  "kind": "discipline",',
  );
  assert.throws(
    () => parseDisciplineRecord(Buffer.from(altered, "utf8"), path),
    /duplicate object key "kind"/u,
  );
});

test("Knowledge source members require their complete typed shape", async () => {
  const path = "packs/go-engineering/records/context-cancellation.md";
  const source = await readFile(resolve(repositoryRoot, path), "utf8");
  const altered = source.replace('"sources": []', '"sources": [1]');
  assert.throws(
    () => parseDisciplineRecord(Buffer.from(altered, "utf8"), path),
    /source 0 must be an object/u,
  );
});

test("semantic digest canonicalizes unordered Knowledge members", async () => {
  const path = "packs/go-engineering/records/context-cancellation.md";
  const source = await readFile(resolve(repositoryRoot, path), "utf8");
  const sources = [
    '{"id":"source.a","required":false,"reference":"docs/a.md","revision":null,"digest":null,"role":"research"}',
    '{"id":"source.z","required":false,"reference":"docs/z.md","revision":null,"digest":null,"role":"policy"}',
  ];
  const relationships = [
    '{"type":"related-to","target":"discipline.neutral.go-engineering.error-contracts","required":false,"scope":"errors"}',
    '{"type":"related-to","target":"discipline.neutral.go-engineering.package-boundaries","required":false,"scope":"packages"}',
  ];
  function orderedRecord(sourceOrder, relationshipOrder, tags) {
    return source
      .replace('"sources": []', `"sources": [${sourceOrder.join(",")}]`)
      .replace('"relationships": []', `"relationships": [${relationshipOrder.join(",")}]`)
      .replace('"tags": ["cancellation", "context", "go", "io"]', `"tags": ${JSON.stringify(tags)}`);
  }
  const canonical = parseDisciplineRecord(Buffer.from(orderedRecord(sources, relationships, ["cancellation", "context", "go", "io"]), "utf8"), path);
  const unsorted = parseDisciplineRecord(Buffer.from(orderedRecord([...sources].reverse(), [...relationships].reverse(), ["io", "go", "context", "cancellation"]), "utf8"), path);
  assert.notEqual(canonical.sourceDigest, unsorted.sourceDigest);
  assert.equal(canonical.semanticDigest, unsorted.semanticDigest);
  assert.deepEqual(unsorted.header.tags, ["cancellation", "context", "go", "io"]);
  assert.deepEqual(unsorted.header.sources.map(({ id }) => id), ["source.a", "source.z"]);
  assert.deepEqual(unsorted.header.relationships.map(({ target }) => target), [
    "discipline.neutral.go-engineering.error-contracts",
    "discipline.neutral.go-engineering.package-boundaries",
  ]);
});

test("manifest digest omits only its digest field", () => {
  const base = { schema: "test", records: [], digest: "sha256:old" };
  assert.equal(selfDigest(base), selfDigest({ ...base, digest: "sha256:new" }));
  assert.notEqual(selfDigest(base), selfDigest({ ...base, records: ["changed"] }));
  assert.equal(canonicalJson({ z: 1, a: 2 }), '{"a":2,"z":1}');
});

test("canonical JSON matches the runtime number domain", () => {
  assert.equal(canonicalJson({ fraction: 1.25, negativeZero: -0 }), '{"fraction":1.25,"negativeZero":0}');
  assert.throws(() => canonicalJson(Number.POSITIVE_INFINITY), /non-finite/u);
  assert.throws(() => canonicalJson(Number.MAX_SAFE_INTEGER + 1), /unsafe integer/u);
});
