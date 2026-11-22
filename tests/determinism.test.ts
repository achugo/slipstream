import { describe, expect, it } from 'vitest';
import { FixedStepLoop } from '../src/sim/loop';
import { createSimState, step, type Input } from '../src/sim/state';

const input: Input = { throttle: 1, brake: 0, steer: 0.3 };

describe('FixedStepLoop', () => {
  it('runs the same number of steps regardless of frame pacing', () => {
    const count = (frames: number[]) => {
      const loop = new FixedStepLoop(120, 1000); // high cap: no dropped backlog
      let steps = 0;
      for (const f of frames) loop.advance(f, () => steps++);
      return steps;
    };
    // One second in total, split three different ways. Use 1/64 s frames
    // (exactly representable) to avoid float accumulation noise in the test.
    const even = count(Array(64).fill(1 / 64));
    const uneven = count([0.25, 0.25, 0.125, 0.125, 0.0625, 0.0625, 0.0625, 0.0625]);
    expect(even).toBe(uneven);
  });
});

describe('simulation', () => {
  it('is deterministic for identical input sequences', () => {
    const run = () => {
      let s = createSimState();
      for (let i = 0; i < 1200; i++) s = step(s, input, 1 / 120);
      return s;
    };
    expect(run()).toEqual(run());
  });
});
