# Slipstream

A browser racing game with hand-written car physics, rule-based opponents and deterministic replays. Built with TypeScript and Three.js.

> **Status: early setup.** What's here now is the project skeleton: a fixed-timestep simulation loop, a seeded random number generator, and a placeholder box you can drive around a flat plane. The real vehicle model, opponents, tracks and replays are still to come. See the [roadmap](#roadmap).

## What it is

In Slipstream the car is properly simulated:

- **Tyres** lose grip as they slide.
- **Weight shifts** under braking, acceleration and cornering.
- **The engine, gearbox and differential** each change how the car drives.

You race opponents on generated tracks or on tracks you build in an editor. You can watch any race back, or chase your best lap as a ghost.

## Why

Some driving games feel right and most don't. This project is about understanding why. All the physics is written by hand in TypeScript, with no physics library. That's the point of the project, not a shortcut that was skipped.

## Design principles

1. **Hand-written physics.** No physics engine. Every force is code in this repo.
2. **Feel over realism, but never at the cost of stability.** Too much grip and the car drives like a train; too little and it's undriveable. The simulation must stay stable at high speed.
3. **Determinism.** The same inputs give the same race, frame for frame. Replays and ghosts work by re-running the simulation from recorded inputs, so this is not optional. In practice:
   - The simulation advances only in fixed steps (120 Hz), separate from rendering.
   - Code in `src/sim` never calls `Math.random()`, `Date.now()` or the DOM. Randomness comes from a seeded `Rng`.
4. **No machine learning for opponents.** AI drivers are rule-based: they follow a racing line, overtake, and recover from spins.
5. **Generated tracks should be fun, not just valid.**

## Getting started

Requires Node.js 22 or newer.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173). Drive with the arrow keys or WASD.

### Scripts

| Command              | What it does                   |
| -------------------- | ------------------------------ |
| `npm run dev`        | Start the dev server           |
| `npm run build`      | Typecheck and build to `dist/` |
| `npm run preview`    | Serve the production build     |
| `npm test`           | Run the tests once (Vitest)    |
| `npm run test:watch` | Run the tests in watch mode    |
| `npm run typecheck`  | TypeScript type checking only  |
| `npm run lint`       | ESLint                         |
| `npm run format`     | Format with Prettier           |

## Project layout

```
src/
  main.ts          Wires input, simulation and rendering together
  input.ts         Keyboard -> Input
  sim/             Deterministic simulation (no DOM, no Math.random)
    loop.ts        Fixed-timestep accumulator
    rng.ts         Seeded PRNG (mulberry32)
    state.ts       Sim state + step(); the car is a placeholder for now
  render/          Three.js view; reads sim state, never writes it
    scene.ts
  ai/              Rule-based opponents (planned)
  track/           Track model, generator and editor (planned)
  replay/          Input recording, playback and ghosts (planned)
tests/             Vitest tests (determinism, RNG)
```

## Roadmap

- [x] Project setup: Vite, TypeScript (strict), Three.js, Vitest, ESLint, Prettier
- [x] Fixed-timestep loop with render interpolation
- [x] Seeded RNG
- [ ] Vehicle model
  - [ ] Rigid body with four wheel contact points
  - [ ] Tyre model with slip-dependent grip
  - [ ] Suspension and weight transfer
  - [ ] Engine torque curve, gearbox, differential
  - [ ] Stability at high speed
- [ ] Tracks
  - [ ] Track representation (spline + width)
  - [ ] Seeded procedural generator
  - [ ] Track editor
- [ ] Opponents
  - [ ] Racing line computation
  - [ ] Line following and speed control
  - [ ] Overtaking and defending
  - [ ] Spin recovery
- [ ] Replays and ghosts
  - [ ] Input recording per tick
  - [ ] Replay playback and camera
  - [ ] Best-lap ghost
- [ ] Race structure: laps, timing, results
- [ ] HUD and menus

## Contributing

This is a personal project with one maintainer. Issues and suggestions are welcome.

## License

[MIT](LICENSE) © achugo
