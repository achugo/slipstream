import type { Input } from './sim/state';

/** Keyboard → Input. Arrow keys or WASD. */
export class Keyboard {
  private readonly down = new Set<string>();

  constructor(target: Window = window) {
    target.addEventListener('keydown', (e) => this.down.add(e.code));
    target.addEventListener('keyup', (e) => this.down.delete(e.code));
    target.addEventListener('blur', () => this.down.clear());
  }

  sample(): Input {
    const k = (...codes: string[]) => codes.some((c) => this.down.has(c));
    return {
      throttle: k('ArrowUp', 'KeyW') ? 1 : 0,
      brake: k('ArrowDown', 'KeyS') ? 1 : 0,
      steer: (k('ArrowRight', 'KeyD') ? 1 : 0) - (k('ArrowLeft', 'KeyA') ? 1 : 0),
    };
  }
}
