import { lstat, readFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { assertSafePackPath, loadManifest, packRoots, parseDisciplineRecord, recordInventory, selfDigest, validateManifestShape } from "./lib.mjs";

const repositoryRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const legacyPaths = ["package-manifest.md", "packages", "install-profiles"];

for (const path of legacyPaths) {
  try {
    await lstat(resolve(repositoryRoot, path));
    throw new Error(`Retired package-model path remains: ${path}`);
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}

let recordCount = 0;
const repositoryRecordIds = new Map();
for (const packRoot of await packRoots(repositoryRoot)) {
  const relativeManifestPath = `packs/${basename(packRoot)}/pack.json`;
  const manifest = await loadManifest(resolve(packRoot, "pack.json"));
  validateManifestShape(manifest, relativeManifestPath);
  if (manifest.digest !== selfDigest(manifest)) throw new Error(`${relativeManifestPath} digest does not reproduce its exact manifest`);

  const observed = await recordInventory(packRoot);
  if (JSON.stringify(observed) !== JSON.stringify(manifest.records)) throw new Error(`${relativeManifestPath} record inventory or digest is stale`);
  for (const record of manifest.records) {
    const recordPath = assertSafePackPath(packRoot, record.path);
    const stat = await lstat(recordPath);
    if (!stat.isFile() || stat.isSymbolicLink() || (stat.mode & 0o111) !== 0) throw new Error(`${relativeManifestPath} record is not a non-executable regular file: ${record.path}`);
    const parsed = parseDisciplineRecord(await readFile(recordPath), record.path);
    if (parsed.header.owners.length !== 1 || parsed.header.owners[0] !== manifest.publisher) {
      throw new Error(`${relativeManifestPath} record ${record.id} must be owned exactly by Pack publisher ${manifest.publisher}`);
    }
    const previousPack = repositoryRecordIds.get(record.id);
    if (previousPack !== undefined) throw new Error(`Pack Discipline record ${record.id} is duplicated by ${previousPack} and ${manifest.id}`);
    repositoryRecordIds.set(record.id, manifest.id);
  }
  recordCount += manifest.records.length;
  process.stdout.write(`validated ${manifest.id} (${manifest.records.length} records, ${manifest.sets.length} Sets)\n`);
}

if (recordCount === 0) throw new Error("No Pack Discipline records were validated");
process.stdout.write(`validated ${recordCount} Pack Discipline records\n`);
