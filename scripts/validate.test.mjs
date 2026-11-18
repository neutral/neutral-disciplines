// Runs the Pack validation with the Intent Library named by INTENT_MODULE and fails on any diagnostic.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { basename, join } from 'node:path';
import test from 'node:test';
import { diagnosticLine, loadIntent, packDirs, root, validate } from './validate.mjs';

const script = join(root, 'scripts', 'validate.mjs');
const modulePath = process.env.INTENT_MODULE;

if (!modulePath) {
  test('the Intent Library is given', () => {
    assert.fail('set INTENT_MODULE to the Intent Library module to run the validation');
  });
} else {
  const intent = await loadIntent(modulePath);

  test('every Pack release reads with no diagnostic', async () => {
    const packs = await validate(intent);
    assert.deepEqual(packs.map((p) => basename(p.dir)), (await packDirs()).map((d) => basename(d)));
    assert.ok(packs.length > 0, 'no Pack folder in packs/');
    for (const p of packs) {
      const lines = p.diagnostics.map((d) => diagnosticLine(p.dir, d));
      assert.deepEqual(lines, [], `${basename(p.dir)} has diagnostics`);
      assert.equal(p.name, basename(p.dir), 'a Pack folder is named for its Pack');
      assert.ok(p.records.length > 0, `${p.name} has no record`);
      assert.match(p.fingerprint, /^sha256:[0-9a-f]{64}$/);
    }
  });

  test('the check command prints each fingerprint and exits 0', async () => {
    const run = spawnSync(process.execPath, [script, '--intent-module', modulePath], { encoding: 'utf8' });
    assert.equal(run.status, 0, run.stdout + run.stderr);
    for (const p of await validate(intent)) assert.ok(run.stdout.includes(p.fingerprint), run.stdout);
  });

  test('the check command fails when no Library is given', () => {
    const env = { ...process.env };
    delete env.INTENT_MODULE;
    const run = spawnSync(process.execPath, [script], { encoding: 'utf8', env });
    assert.equal(run.status, 1);
    assert.match(run.stderr, /no Intent Library given/);
  });
}
