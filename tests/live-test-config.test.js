import test from 'node:test';
import assert from 'node:assert/strict';

import { getLiveTestConfig } from '../src/live_test_config.js';

test('getLiveTestConfig disables live tests by default', () => {
  const config = getLiveTestConfig({});

  assert.equal(config.enabled, false);
  assert.match(config.reason, /SLACKLANE_LIVE_TESTS=1/);
});

test('getLiveTestConfig validates read-only live test prerequisites', () => {
  const config = getLiveTestConfig({
    SLACKLANE_LIVE_TESTS: '1',
  });

  assert.equal(config.enabled, true);
  assert.equal(config.allowWrite, false);
  assert.deepEqual(config.readTargets.missing, ['SLACKLANE_LIVE_CHANNEL', 'SLACKLANE_LIVE_MESSAGE_TS']);
});

test('getLiveTestConfig validates optional write prerequisites separately', () => {
  const config = getLiveTestConfig({
    SLACKLANE_LIVE_TESTS: '1',
    SLACKLANE_LIVE_ALLOW_WRITE: '1',
    SLACKLANE_LIVE_CHANNEL: 'general',
    SLACKLANE_LIVE_MESSAGE_TS: '1714280000.000100',
  });

  assert.equal(config.enabled, true);
  assert.equal(config.allowWrite, true);
  assert.deepEqual(config.readTargets.missing, []);
  assert.deepEqual(config.writeTargets.missing, ['SLACKLANE_LIVE_THREAD_TS']);
});

test('getLiveTestConfig returns resolved read and write targets when fully configured', () => {
  const config = getLiveTestConfig({
    SLACKLANE_LIVE_TESTS: '1',
    SLACKLANE_LIVE_ALLOW_WRITE: '1',
    SLACKLANE_LIVE_CHANNEL: 'general',
    SLACKLANE_LIVE_MESSAGE_TS: '1714280000.000100',
    SLACKLANE_LIVE_THREAD_TS: '1714280000.000100',
  });

  assert.equal(config.enabled, true);
  assert.equal(config.allowWrite, true);
  assert.deepEqual(config.readTargets, {
    channel: 'general',
    messageTs: '1714280000.000100',
    missing: [],
  });
  assert.deepEqual(config.writeTargets, {
    threadTs: '1714280000.000100',
    missing: [],
  });
});
