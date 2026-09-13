import assert from 'node:assert/strict';
import { chmod, cp, mkdtemp, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { loadIntent, validateCatalog, packRoots, openPack, hash } from './lib.mjs';
import { updateManifests } from './update-manifests.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const intent = await loadIntent();
const roots = await packRoots(root);

async function packFiles(pack = roots[0]) {
  const source = await openPack(pack, intent), files = {};
  for (const path of ['pack.json', 'catalog.json', 'connections.json', 'pack.manifest.json',
    ...(await source.list('records')).filter(entry => entry.kind === 'file').map(entry => entry.path)]) {
    files[path] = await source.read(path, 4194304);
  }
  return files;
}

function changeJson(files, path, change) {
  const value = intent.parseStrictJson(Buffer.from(files[path]).toString('utf8'));
  change(value);
  files[path] = JSON.stringify(value, null, 2) + '\n';
}

async function fixture(t) {
  const directory = await mkdtemp(join(tmpdir(), 'neutral-disciplines-test-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await cp(join(root, 'packs'), join(directory, 'packs'), { recursive: true });
  return directory;
}

function hasIssue(result, code) {
  assert.equal(result.valid, false);
  assert.ok(result.diagnostics.some(issue => issue.code.includes(code)), JSON.stringify(result.diagnostics));
}

test('the installed package validates all 29 records and 9 curated Sets', async () => {
  const result = await validateCatalog(root, intent);
  assert.deepEqual(result.packs.map(pack => [pack.id, pack.records, pack.sets.length]), [
    ['neutral.go-engineering', 14, 4], ['neutral.test-strategy', 15, 5],
  ]);
  assert.equal(result.records, 29);
  assert.equal(result.sets, 9);
  for (const pack of roots) {
    const built = await intent.buildDisciplinePack(new intent.MemorySource(await packFiles(pack)));
    assert.equal(built.valid, true, JSON.stringify(built.diagnostics));
    assert.deepEqual(built.candidateManifest, JSON.parse(JSON.stringify(built.suppliedManifest)));
  }
});

test('each curated Set produces exact selected adoption bytes and metadata', async () => {
  for (const pack of roots) {
    const files = await packFiles(pack), source = new intent.MemorySource(files);
    const inspected = await intent.validateDisciplinePack(source), definition = inspected.definition;
    for (const set of definition.sets) {
      const choices = set.recordIds.map(id => ({ id, packId: definition.id, packVersion: definition.version,
        path: `intent/disciplines/${pack.name}/${id.split('.').at(-1)}.md` }));
      const proposal = await intent.proposeDisciplineAdoption(source, {
        source: `https://github.com/neutral/neutral-disciplines/tree/main/packs/${pack.name}`,
        revision: inspected.suppliedManifest.digest, choices,
      });
      assert.equal(proposal.valid, true, JSON.stringify(proposal.diagnostics));
      assert.equal(proposal.applied, false);
      assert.deepEqual(proposal.choices.map(choice => choice.id), set.recordIds);
      assert.deepEqual(proposal.context.catalog.records.map(record => record.record).sort(), set.recordIds);
      for (const choice of choices) {
        const record = inspected.records.find(record => record.header.id === choice.id);
        assert.equal(hash(proposal.files.find(file => file.path === choice.path).bytes), hash(files[record.path]));
      }
    }
  }
});

test('source and global metadata drift leave supplied manifests unchanged and invalid', async () => {
  for (const mutation of ['record', 'catalog']) {
    const files = await packFiles(), manifest = hash(files['pack.manifest.json']);
    if (mutation === 'record') {
      const path = Object.keys(files).find(path => path.startsWith('records/'));
      files[path] = Buffer.from(files[path]).toString('utf8') + '\nA changed verification expectation.\n';
    } else changeJson(files, 'catalog.json', value => value.records[0].tags.push('additional-review'));
    const result = await intent.validateDisciplinePack(new intent.MemorySource(files));
    hasIssue(result, 'manifest-mismatch');
    assert.equal(hash(result.suppliedManifestBytes), manifest);
  }
});

test('a corrupted manifest is rejected without replacing expected fingerprints', async () => {
  const files = await packFiles();
  changeJson(files, 'pack.manifest.json', value => value.records[0].sourceDigest = `sha256:${'0'.repeat(64)}`);
  const expected = hash(files['pack.manifest.json']);
  const result = await intent.validateDisciplinePack(new intent.MemorySource(files));
  hasIssue(result, 'manifest-digest');
  assert.equal(hash(result.suppliedManifestBytes), expected);
});

test('duplicate JSON keys and non-current records fail complete Pack validation', async () => {
  for (const mutation of ['duplicate-key', 'draft']) {
    const files = await packFiles(), path = Object.keys(files).find(path => path.startsWith('records/'));
    const original = Buffer.from(files[path]).toString('utf8');
    files[path] = mutation === 'duplicate-key'
      ? original.replace('"kind": "discipline",', '"kind": "discipline", "kind": "discipline",')
      : original.replace('"status": "current"', '"status": "draft"');
    const result = await intent.validateDisciplinePack(new intent.MemorySource(files));
    hasIssue(result, mutation === 'draft' ? 'pack-current' : 'duplicate');
  }
});

test('publisher ownership, required navigation and duplicate record identities are rejected', async () => {
  for (const mutation of ['owner', 'required-edge', 'duplicate-record']) {
    const files = await packFiles();
    if (mutation === 'owner') changeJson(files, 'catalog.json', value => value.records[0].owners = ['another-publisher']);
    if (mutation === 'required-edge') {
      const catalog = intent.parseStrictJson(Buffer.from(files['catalog.json']).toString('utf8'));
      changeJson(files, 'connections.json', value => value.relationships.push({ id: 'navigation',
        record: catalog.records[0].record, type: 'related-to', target: catalog.records[1].record, required: true }));
    }
    if (mutation === 'duplicate-record') files['records/duplicate.md'] = files[Object.keys(files).find(path => path.startsWith('records/'))];
    const result = await intent.validateDisciplinePack(new intent.MemorySource(files));
    hasIssue(result, mutation === 'owner' ? 'publisher' : mutation === 'duplicate-record' ? 'duplicate' : 'schema');
  }
});

test('Sets reject missing members and unordered selections', async () => {
  for (const mutation of ['missing', 'order']) {
    const files = await packFiles();
    changeJson(files, 'pack.json', value => {
      if (mutation === 'missing') value.sets[0].recordIds.push('discipline.neutral.missing');
      else value.sets[0].recordIds.reverse();
    });
    const result = await intent.validateDisciplinePack(new intent.MemorySource(files));
    hasIssue(result, mutation === 'missing' ? 'set-member' : 'set-order');
  }
});

test('catalog validation refuses executable records and symlinks', async t => {
  const directory = await fixture(t), records = join(directory, 'packs', roots[0].name, 'records');
  const name = (await readdir(records))[0], path = join(records, name);
  await chmod(path, 0o755);
  await assert.rejects(validateCatalog(directory, intent), /non-executable regular Markdown/);
  await chmod(path, 0o644);
  await symlink(name, join(records, 'linked.md'));
  await assert.rejects(validateCatalog(directory, intent), /non-executable regular Markdown/);
});

test('manifest preview is read-only and explicit writes repair only the selected current Pack', async t => {
  const directory = await fixture(t), pack = roots[0].name;
  const manifestPath = join(directory, 'packs', pack, 'pack.manifest.json');
  const original = await readFile(manifestPath);
  const otherPath = join(directory, 'packs', roots[1].name, 'pack.manifest.json');
  const other = await readFile(otherPath);
  const catalogPath = join(directory, 'packs', pack, 'catalog.json');
  const catalog = JSON.parse(await readFile(catalogPath, 'utf8'));
  catalog.records[0].tags.push('release-review');
  await writeFile(catalogPath, JSON.stringify(catalog, null, 2) + '\n');
  await assert.rejects(validateCatalog(directory, intent), /manifest-mismatch/);
  const preview = await updateManifests(directory, intent, { pack });
  assert.equal(preview.length, 1);
  assert.equal(preview[0].changed, true);
  assert.equal(preview[0].written, false);
  assert.deepEqual(await readFile(manifestPath), original);
  const applied = await updateManifests(directory, intent, { pack, write: true });
  assert.equal(applied[0].written, true);
  assert.equal((await validateCatalog(directory, intent)).records, 29);
  assert.deepEqual(await readFile(otherPath), other);
  assert.deepEqual(await readdir(join(directory, 'packs', pack)),
    ['catalog.json', 'connections.json', 'pack.json', 'pack.manifest.json', 'records']);
  assert.equal((await updateManifests(directory, intent, { pack, write: true }))[0].changed, false);
});

test('manifest updates refuse invalid authored content and unknown Pack selection', async t => {
  const directory = await fixture(t), pack = roots[0].name;
  const path = join(directory, 'packs', pack, 'catalog.json');
  const manifestPath = join(directory, 'packs', pack, 'pack.manifest.json'), original = await readFile(manifestPath);
  const catalog = JSON.parse(await readFile(path, 'utf8'));
  catalog.records[0].owners = ['another-publisher'];
  await writeFile(path, JSON.stringify(catalog));
  await assert.rejects(updateManifests(directory, intent, { pack, write: true }), /publisher/);
  assert.deepEqual(await readFile(manifestPath), original);
  await assert.rejects(updateManifests(directory, intent, { pack: 'missing', write: true }), /unavailable/);
});
