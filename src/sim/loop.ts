/**
 * Fixed-timestep accumulator.
 *
 * The simulation always advances in steps of exactly `dt` seconds, no matter
 * how irregular the browser's frame times are. This is the foundation of
 * determinism: the same inputs, fed step by step, produce the same result.
 *
 * Rendering happens separately and uses `alpha` (0..1) to interpolate between
 * the previous and current simulation states.
 */
export class FixedStepLoop {
  readonly dt: number;
  private accumulator = 0;
  private readonly maxStepsPerFrame: number;

  constructor(hz = 120, maxStepsPerFrame = 8) {
    this.dt = 1 / hz;
    this.maxStepsPerFrame = maxStepsPerFrame;
  }

  /**
   * Feed elapsed real time (seconds). Calls `step` zero or more times.
   * Returns the interpolation factor for rendering.
   */
  advance(frameSeconds: number, step: (dt: number) => void): number {
    this.accumulator += frameSeconds;

    let steps = 0;
    while (this.accumulator >= this.dt && steps < this.maxStepsPerFrame) {
      step(this.dt);
      this.accumulator -= this.dt;
      steps++;
    }

    // If we fell too far behind (e.g. a backgrounded tab), drop the backlog
    // rather than spiralling. Dropped time is never simulated.
    if (steps === this.maxStepsPerFrame && this.accumulator >= this.dt) {
      this.accumulator = 0;
    }

    return this.accumulator / this.dt;
  }
}
