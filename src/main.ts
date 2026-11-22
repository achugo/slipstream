import { Keyboard } from './input';
import { Renderer } from './render/scene';
import { FixedStepLoop } from './sim/loop';
import { createSimState, step, type SimState } from './sim/state';

const renderer = new Renderer(document.body);
const keyboard = new Keyboard();
const loop = new FixedStepLoop(120);

let prev: SimState = createSimState();
let curr: SimState = prev;
let last = performance.now();

function frame(now: number): void {
  const frameSeconds = (now - last) / 1000;
  last = now;

  // Input is sampled once per frame and held for every sim step in it.
  // A replay will record (tick, input) pairs at this boundary.
  const input = keyboard.sample();
  const alpha = loop.advance(frameSeconds, (dt) => {
    prev = curr;
    curr = step(curr, input, dt);
  });

  renderer.render(prev.car, curr.car, alpha);
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
