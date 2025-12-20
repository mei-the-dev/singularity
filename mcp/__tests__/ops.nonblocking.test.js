import { startService } from '../tools/ops.js';

describe('Non-blocking startService', () => {
  test('startService returns quickly with PID and log', async () => {
    const start = Date.now();
    const res = await startService({ command: 'node -e "console.log(\'hi\')"' });
    const duration = Date.now() - start;
    expect(res).toHaveProperty('pid');
    expect(res).toHaveProperty('log');
    expect(typeof res.pid).toBe('number');
    expect(duration).toBeLessThan(5000);
    // cleanup
    try { process.kill(res.pid); } catch(e) {}
  });
});
