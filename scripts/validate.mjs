import { fileURLToPath } from 'node:url';
import { loadIntent, options, validateCatalog } from './lib.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const result = await validateCatalog(root, await loadIntent(options()));
for (const pack of result.packs) {
  process.stdout.write(`validated ${pack.id}@${pack.version}: ${pack.records} records, ${pack.sets.length} Sets\n`);
}
process.stdout.write(`validated ${result.records} Intent Discipline records and ${result.sets} Sets\n`);
