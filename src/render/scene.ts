import * as THREE from 'three';
import type { CarState } from '../sim/state';

/**
 * Three.js view of the simulation. Reads sim state, never writes it.
 */
export class Renderer {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly car: THREE.Mesh;

  constructor(container: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    this.scene.background = new THREE.Color(0x0b0d10);
    this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 2000);

    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x334455, 1.2));
    const sun = new THREE.DirectionalLight(0xffffff, 1.5);
    sun.position.set(30, 50, 20);
    this.scene.add(sun);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(1000, 1000),
      new THREE.MeshStandardMaterial({ color: 0x2a2f36 }),
    );
    ground.rotation.x = -Math.PI / 2;
    this.scene.add(ground);
    this.scene.add(new THREE.GridHelper(1000, 200, 0x444b55, 0x353b44));

    // Placeholder car: a box roughly the size of a small car (w, h, l in metres).
    this.car = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 1.2, 4.2),
      new THREE.MeshStandardMaterial({ color: 0xe04a2f }),
    );
    this.car.position.y = 0.6;
    this.scene.add(this.car);

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  /** Draw a state interpolated between `prev` and `curr` by `alpha`. */
  render(prev: CarState, curr: CarState, alpha: number): void {
    const x = prev.x + (curr.x - prev.x) * alpha;
    const z = prev.z + (curr.z - prev.z) * alpha;
    const heading = prev.heading + (curr.heading - prev.heading) * alpha;

    this.car.position.set(x, 0.6, z);
    this.car.rotation.y = heading;

    // Simple chase camera.
    const back = 9;
    this.camera.position.set(x - Math.sin(heading) * back, 4, z - Math.cos(heading) * back);
    this.camera.lookAt(x, 1, z);

    this.renderer.render(this.scene, this.camera);
  }

  private resize(): void {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }
}
