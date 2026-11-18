// Validates each Pack release in packs/ with the Intent Library's readPackRelease.
// The Library module is given by --intent-module PATH or the INTENT_MODULE environment variable.
import { readdir } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const root = fileURLToPath(new URL('..', import.meta.url));

export function modulePath(argv = process.argv.slice(2), env = process.env) {
  const at = argv.indexOf('--intent-module');
  if (at !== -1) {
    if (!argv[at + 1]) throw new Error('--intent-module needs the path of the Intent Library module');
    return argv[at + 1];
  }
  const joined = argv.find((arg) => arg.startsWith('--intent-module='));
  if (joined) return joined.slice('--intent-module='.length);
  if (env.INTENT_MODULE) return env.INTENT_MODULE;
  throw new Error('no Intent Library given: pass --intent-module PATH or set INTENT_MODULE to the Library module');
}

export async function loadIntent(path) {
  const intent = await import(pathToFileURL(resolve(path)).href);
  if (typeof intent.readPackRelease !== 'function') throw new Error(`${path} exports no readPackRelease`);
  return intent;
}

export async function packDirs(base = root) {
  const entries = await readdir(join(base, 'packs'), { withFileTypes: true });
  return entries.filter((e) => e.isDirectory() && !e.name.startsWith('.'))
    .map((e) => join(base, 'packs', e.name))
    .sort();
}

// Each Pack's result is the Library's { name, version, title, records, fingerprint, diagnostics }, with its folder.
export async function validate(intent, base = root) {
  const packs = [];
  for (const dir of await packDirs(base)) packs.push({ dir, ...(await intent.readPackRelease(dir)) });
  return packs;
}

// FORMAT's one-line form, with the file given from the repository root.
export function diagnosticLine(dir, d) {
  const file = `packs/${basename(dir)}/${d.file ?? ''}`;
  const where = d.line == null ? file : `${file}:${d.line}`;
  return `${where}: ${d.severity} ${d.code}${d.message ? ` ${d.message}` : ''}`;
}

export const hasError = (packs) => packs.some((p) => p.diagnostics.some((d) => d.severity === 'error'));

async function main() {
  const packs = await validate(await loadIntent(modulePath()));
  for (const p of packs) {
    process.stdout.write(`${basename(p.dir)}: ${p.name} ${p.version}, ${p.records.length} records, ${p.fingerprint}\n`);
    for (const d of p.diagnostics) process.stdout.write(`${diagnosticLine(p.dir, d)}\n`);
  }
  const count = packs.reduce((n, p) => n + p.diagnostics.length, 0);
  process.stdout.write(`${packs.length} Packs, ${count} diagnostics\n`);
  if (hasError(packs)) process.exitCode = 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    process.stderr.write(`validate: ${err.message}\n`);
    process.exitCode = 1;
  });
}
