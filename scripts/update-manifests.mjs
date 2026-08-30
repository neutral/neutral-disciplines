import { writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadManifest, packRoots, recordInventory, selfDigest, validateManifestShape } from "./lib.mjs";

const repositoryRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));

for (const packRoot of await packRoots(repositoryRoot)) {
  const manifestPath = resolve(packRoot, "pack.json");
  const manifest = await loadManifest(manifestPath);
  const next = {
    ...manifest,
    records: await recordInventory(packRoot),
    digest: "sha256:0000000000000000000000000000000000000000000000000000000000000000",
  };
  next.digest = selfDigest(next);
  validateManifestShape(next, `packs/${basename(packRoot)}/pack.json`);
  await writeFile(manifestPath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  process.stdout.write(`updated ${manifestPath}\n`);
}
