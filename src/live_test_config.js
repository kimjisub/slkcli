export function getLiveTestConfig(env = process.env) {
  const enabled = env.SLACKLANE_LIVE_TESTS == '1' || env.SLK_LIVE_TESTS == '1';
  if (!enabled) {
    return {
      enabled: false,
      allowWrite: false,
      reason: 'Set SLACKLANE_LIVE_TESTS=1 to enable live Slack integration tests.',
      readTargets: { channel: null, messageTs: null, missing: [] },
      writeTargets: { threadTs: null, missing: [] },
    };
  }

  const channel = env.SLACKLANE_LIVE_CHANNEL || env.SLK_LIVE_CHANNEL || null;
  const messageTs = env.SLACKLANE_LIVE_MESSAGE_TS || env.SLK_LIVE_MESSAGE_TS || null;
  const threadTs = env.SLACKLANE_LIVE_THREAD_TS || env.SLK_LIVE_THREAD_TS || null;
  const allowWrite = env.SLACKLANE_LIVE_ALLOW_WRITE == '1' || env.SLK_LIVE_ALLOW_WRITE == '1';

  const readMissing = [];
  if (!channel) readMissing.push('SLACKLANE_LIVE_CHANNEL');
  if (!messageTs) readMissing.push('SLACKLANE_LIVE_MESSAGE_TS');

  const writeMissing = [];
  if (allowWrite && !threadTs) writeMissing.push('SLACKLANE_LIVE_THREAD_TS');

  return {
    enabled: true,
    allowWrite,
    reason: null,
    readTargets: {
      channel,
      messageTs,
      missing: readMissing,
    },
    writeTargets: {
      threadTs,
      missing: writeMissing,
    },
  };
}
