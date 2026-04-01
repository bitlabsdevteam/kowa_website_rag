import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

test('retrieval eval gate outputs versioned report with scoring and unanswered clusters', async () => {
  const { stdout } = await execFileAsync('node', ['scripts/eval_retrieval_gate.mjs', '--json'], {
    cwd: process.cwd(),
    env: { ...process.env, NODE_ENV: 'development' },
  });

  const report = JSON.parse(stdout);

  assert.equal(typeof report.goldenSetVersion, 'string');
  assert.equal(report.goldenSetVersion.length > 0, true);
  assert.equal(typeof report.summary.groundedRate, 'number');
  assert.equal(typeof report.summary.citationValidRate, 'number');
  assert.equal(typeof report.summary.correctOrPartialRate, 'number');
  assert.equal(Array.isArray(report.unansweredClusters), true);
  assert.equal(Array.isArray(report.results), true);
  assert.equal(report.results.length > 0, true);

  const result = report.results[0];
  assert.equal(typeof result.scores.grounded, 'boolean');
  assert.equal(typeof result.scores.citationPresent, 'boolean');
  assert.equal(typeof result.scores.citationValid, 'boolean');
  assert.equal(['correct', 'partial', 'miss'].includes(result.scores.correctness), true);
});

test('retrieval eval gate enforces release threshold and exits non-zero when forced to fail', async () => {
  let failed = false;

  try {
    await execFileAsync('node', ['scripts/eval_retrieval_gate.mjs', '--fail-threshold=1.1'], {
      cwd: process.cwd(),
      env: { ...process.env, NODE_ENV: 'development' },
    });
  } catch (error) {
    failed = true;
  }

  assert.equal(failed, true);
});
