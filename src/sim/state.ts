/**
 * Simulation state and step function.
 *
 * PLACEHOLDER: the car here is a simple kinematic point so the loop has
 * something to move. The real vehicle model (tyres, weight transfer,
 * drivetrain) replaces `stepCar` later.
 *
 * Rules for everything in src/sim:
 *   - No Math.random(), no Date.now(), no reading the DOM.
 *   - Only advance via `step(state, input, dt)` with a fixed dt.
 */
export interface Input {
  throttle: number; // 0..1
  brake: number; // 0..1
  steer: number; // -1..1 (left negative)
}

export interface CarState {
  x: number;
  z: number;
  heading: number; // radians, 0 = +z
  speed: number; // m/s
}

export interface SimState {
  tick: number;
  car: CarState;
}

export const NEUTRAL_INPUT: Input = { throttle: 0, brake: 0, steer: 0 };

export function createSimState(): SimState {
  return { tick: 0, car: { x: 0, z: 0, heading: 0, speed: 0 } };
}

function stepCar(car: CarState, input: Input, dt: number): CarState {
  const accel = input.throttle * 8 - input.brake * 15 - car.speed * 0.1;
  const speed = Math.max(0, car.speed + accel * dt);
  const heading = car.heading - input.steer * 1.5 * dt * Math.min(1, speed / 5);
  return {
    x: car.x + Math.sin(heading) * speed * dt,
    z: car.z + Math.cos(heading) * speed * dt,
    heading,
    speed,
  };
}

export function step(state: SimState, input: Input, dt: number): SimState {
  return { tick: state.tick + 1, car: stepCar(state.car, input, dt) };
}
