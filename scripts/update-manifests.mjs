import { readFile, writeFile, rename, rm } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadIntent, options, packRoots, openPack, hash } from './lib.mjs';

async function optionalBytes(path) {
  try { return await readFile(path); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}

function requireCandidate(result) {
  const unexpected = result.diagnostics.filter(issue => issue.code !== 'intent.discipline.manifest-mismatch');
  if (!result.complete || unexpected.some(issue => issue.severity === 'error') || !result.candidateManifest) {
    throw new Error(JSON.stringify(result.diagnostics, null, 2));
  }
}

export async function updateManifests(repositoryRoot, intent, selected = {}) {
  const roots = (await packRoots(repositoryRoot)).filter(pack => !selected.pack || selected.pack === pack.name);
  if (!roots.length) throw new Error('Selected Pack is unavailable');
  const reports = [];
  for (const pack of roots) {
    const path = join(pack.path, 'pack.manifest.json');
    const original = await optionalBytes(path);
    const result = await intent.buildDisciplinePack(await openPack(pack, intent));
    requireCandidate(result);
    const changed = result.suppliedManifest?.digest !== result.candidateManifest.digest;
    const report = { pack: result.definition.id, changed, expectedManifest: result.suppliedManifest?.digest ?? null,
      diagnostics: result.diagnostics, proposedManifest: result.candidateManifest, written: false };
    if (selected.write && changed) {
      const rechecked = await intent.buildDisciplinePack(await openPack(pack, intent));
      requireCandidate(rechecked);
      const current = await optionalBytes(path);
      if (rechecked.candidateManifest.digest !== result.candidateManifest.digest
          || (original === null) !== (current === null) || (original && hash(original) !== hash(current))) {
        throw new Error(`${pack.name}: Pack changed during manifest preparation`);
      }
      const temporary = `${path}.${randomUUID()}.next`;
      try {
        await writeFile(temporary, JSON.stringify(result.candidateManifest, null, 2) + '\n', { flag: 'wx', mode: 0o644 });
        await rename(temporary, path);
      } finally { await rm(temporary, { force: true }); }
      const checked = await intent.validateDisciplinePack(await openPack(pack, intent));
      if (!checked.complete || !checked.valid) throw new Error(JSON.stringify(checked.diagnostics, null, 2));
      report.written = true;
    }
    reports.push(report);
  }
  return reports;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const selected = options(process.argv.slice(2), ['intent-module', 'pack', 'write']);
  const reports = await updateManifests(fileURLToPath(new URL('..', import.meta.url)), await loadIntent(selected), selected);
  for (const report of reports) process.stdout.write(JSON.stringify(report) + '\n');
}
