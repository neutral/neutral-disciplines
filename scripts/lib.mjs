import { createHash } from 'node:crypto';
import { lstat, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const hash = bytes => `sha256:${createHash('sha256').update(bytes).digest('hex')}`;

export function options(args = process.argv.slice(2), allowed = ['intent-module']) {
  const result = {};
  for (let i = 0; i < args.length; i++) {
    const key = args[i].slice(2);
    if (!args[i].startsWith('--') || !allowed.includes(key) || Object.hasOwn(result, key)) {
      throw new Error(`Unknown or repeated option: ${args[i]}`);
    }
    if (key === 'write') { result.write = true; continue; }
    if (!args[i + 1] || args[i + 1].startsWith('--')) throw new Error(`Missing value: ${args[i]}`);
    result[key] = args[++i];
  }
  return result;
}

export async function loadIntent(selected = {}) {
  const module = selected['intent-module'] ?? process.env.INTENT_MODULE;
  return module ? import(pathToFileURL(resolve(module)).href) : import('@neutral/intent');
}

export async function packRoots(repositoryRoot) {
  const entries = await readdir(join(repositoryRoot, 'packs'), { withFileTypes: true });
  if (!entries.length || entries.length > 32) throw new Error('Catalog must contain 1–32 Pack directories');
  return entries.sort((a, b) => a.name < b.name ? -1 : 1).map(entry => {
    if (!entry.isDirectory() || entry.isSymbolicLink()) throw new Error(`Unsupported Pack entry: ${entry.name}`);
    return { name: entry.name, path: join(repositoryRoot, 'packs', entry.name) };
  });
}

export async function openPack(root, intent) {
  const reader = await intent.FileSystemSource.open(root.path);
  for (const entry of await reader.list('records')) {
    if (entry.kind === 'directory') continue;
    const info = await lstat(join(root.path, entry.path));
    if (entry.kind !== 'file' || !entry.path.endsWith('.md') || (info.mode & 0o111)) {
      throw new Error(`Pack records must be non-executable regular Markdown files: ${root.name}/${entry.path}`);
    }
  }
  return reader;
}

export async function validateCatalog(repositoryRoot, intent) {
  const packs = [], ids = new Set();
  for (const root of await packRoots(repositoryRoot)) {
    const result = await intent.validateDisciplinePack(await openPack(root, intent));
    if (!result.complete || !result.valid) {
      throw new Error(JSON.stringify({ pack: root.name, diagnostics: result.diagnostics }, null, 2));
    }
    for (const record of result.records) {
      if (ids.has(record.header.id)) throw new Error(`Duplicate catalog practice ID: ${record.header.id}`);
      ids.add(record.header.id);
    }
    packs.push({ id: result.definition.id, version: result.definition.version, records: result.records.length,
      sets: result.definition.sets.map(set => ({ id: set.id, recordIds: set.recordIds })), manifestDigest: result.suppliedManifest.digest });
  }
  return { packs, records: ids.size, sets: packs.reduce((sum, pack) => sum + pack.sets.length, 0) };
}
