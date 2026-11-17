import * as THREE from 'three';

/**
 * Smooth Hermite interpolation clamped to [0, 1].
 */
function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Second-order damped spring for organic, interruptible bird kinematics.
 */
class DampedSpring {
  value: number;
  velocity = 0;
  target: number;
  stiffness: number;
  damping: number;

  constructor(initial = 0, stiffness = 170, damping = 20) {
    this.value = initial;
    this.target = initial;
    this.stiffness = stiffness;
    this.damping = damping;
  }

  step(dt: number): number {
    const clampedDt = Math.min(dt, 0.05);
    const force = (this.target - this.value) * this.stiffness;
    const drag = this.velocity * this.damping;
    this.velocity += (force - drag) * clampedDt;
    this.value += this.velocity * clampedDt;
    return this.value;
  }

  impulse(vel: number): void {
    this.velocity += vel;
  }
}

export interface OwlInteractionState {
  /** Normalized pointer in [-1, 1] relative to hero; null when inactive */
  pointerX: number;
  pointerY: number;
  pointerActive: boolean;
  /** True when user hovers primary CTA or install command on the left */
  inspectingCta: boolean;
}

export interface OwlControllerOptions {
  /** Uses lighter sphere/capsule subdivisions & 256px shadow map for mobile/compact GPUs. */
  compactDetail?: boolean;
}

export const WALK_IN_DURATION = 3.25;

export interface OwlSceneController {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  update: (timeSec: number, dt: number, interaction: OwlInteractionState) => {
    scanWave: number;
    owlScreenPos: THREE.Vector2;
    footY: number;
  };
  triggerScanHop: (timeSec: number, aimX?: number, aimY?: number) => void;
  snapToPerch: () => void;
  dispose: () => void;
}

/**
 * Builds the vertex-sculpted 3D Little Owl (*Athene noctua*) rig, directional
 * architectural studio lighting, ground shadow catcher, and depth walk-in +
 * 5-act behavioral spring-physics animation director.
 */
export function createOwlSceneController(
  options: OwlControllerOptions = {}
): OwlSceneController {
  const compact = Boolean(options.compactDetail);
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(30, 1, 0.5, 40);
  /* Position camera so the Owl sits comfortably around x = ~48% of the canvas
     (which spans the right ~64vw of the hero), leaving space on the right for
     its floor cast shadow and sweeping gobo scanline field. */
  camera.position.set(0.22, 0.05, 8.6);
  camera.lookAt(0.22, -0.06, 0);

  const disposables: Array<{ dispose: () => void }> = [];
  const track = <T extends { dispose: () => void }>(item: T): T => {
    disposables.push(item);
    return item;
  };

  /* -----------------------------------------------------------------------
     Studio Lighting — Strong front-left key light so the Owl's left brow,
     cheek, and chest hit pure white (> 0.90 lum => zero scanlines), paired
     with calibrated right fill so shaded white plumage stays in Regime 2
     scanlines (lum 0.38..0.88) while obsidian eyes/beak hit Regime 3 blocks.
     ----------------------------------------------------------------------- */
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.46);
  scene.add(ambientLight);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xd8ddd9, 0.34);
  hemiLight.position.set(-2.5, 4, 1.5);
  scene.add(hemiLight);

  const shadowSize = compact ? 256 : 512;
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.88);
  keyLight.position.set(-6.4, 2.75, 1.95);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(shadowSize, shadowSize);
  keyLight.shadow.camera.near = 1.0;
  keyLight.shadow.camera.far = 18.0;
  keyLight.shadow.camera.left = -3.5;
  keyLight.shadow.camera.right = 5.5;
  keyLight.shadow.camera.top = 3.5;
  keyLight.shadow.camera.bottom = -3.5;
  keyLight.shadow.bias = -0.0008;
  keyLight.shadow.radius = compact ? 1.5 : 2.5;
  scene.add(keyLight);
  scene.add(keyLight.target);

  /* Soft right-side fill keeps shaded plumage inside airy Regime-2 scanlines */
  const rightFillLight = new THREE.DirectionalLight(0xffffff, 0.58);
  rightFillLight.position.set(4.4, 0.9, 2.8);
  scene.add(rightFillLight);

  /* Subtle rim light from left keeps outer left contour bright porcelain */
  const rimLight = new THREE.DirectionalLight(0xffffff, 0.92);
  rimLight.position.set(-4.2, 1.4, -1.2);
  scene.add(rimLight);

  /* -----------------------------------------------------------------------
     Materials
     ----------------------------------------------------------------------- */
  const porcelainMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.78,
      metalness: 0.0,
    })
  );

  const softCreaseMat = track(
    new THREE.MeshStandardMaterial({
      color: 0x727874,
      roughness: 0.88,
      metalness: 0.0,
    })
  );

  const obsidianFeatureMat = track(
    new THREE.MeshStandardMaterial({
      color: 0x060706,
      roughness: 0.35,
      metalness: 0.05,
    })
  );

  const catchlightMat = track(
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
    })
  );

  const talonMat = track(
    new THREE.MeshStandardMaterial({
      color: 0x161715,
      roughness: 0.65,
      metalness: 0.0,
    })
  );

  /* Ground Shadow Catcher at y = -1.38 spanning full walk-in horizon depth */
  const floorGeo = track(new THREE.PlaneGeometry(20, 26));
  const floorMat = track(
    new THREE.ShadowMaterial({
      color: 0x000000,
      opacity: 0.44,
    })
  );
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.set(1.2, -1.38, -6.5);
  floorMesh.receiveShadow = true;
  scene.add(floorMesh);

  /* -----------------------------------------------------------------------
     Root Owl Rig Hierarchy (starts afar in depth at z = -14.5 for walk-in)
     ----------------------------------------------------------------------- */
  const owlRoot = new THREE.Group();
  owlRoot.position.set(1.15, -0.04, -14.5);
  owlRoot.rotation.y = 0.14;
  scene.add(owlRoot);

  /* 1. Sculpted Plump Owl Torso */
  const bodyGroup = new THREE.Group();
  bodyGroup.position.set(0, -0.62, 0);
  owlRoot.add(bodyGroup);

  const torsoGeo = track(new THREE.SphereGeometry(0.82, compact ? 30 : 40, compact ? 22 : 30));
  {
    const pos = torsoGeo.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      /* Pear / plump owl chest profile: slightly narrower near neck, fuller mid-belly */
      const ny = v.y / 0.82; // -1 .. 1
      const taper = 1.0 - 0.14 * Math.max(0, ny) - 0.08 * Math.max(0, -ny - 0.45);
      v.x *= 0.96 * taper;
      v.y *= 0.94;
      v.z *= 0.86 * taper;
      /* Puff forward chest slightly */
      if (v.z > 0) {
        v.z += 0.07 * Math.cos(ny * Math.PI * 0.5);
      }
      /* Subtle sculpted breast-feather chevron ridges so scanlines pick up delicate owl plumage */
      if (v.z > 0.25 && Math.abs(ny) < 0.58) {
        const chevron = Math.sin((ny * 10.5 + Math.abs(v.x) * 5.0)) * 0.014;
        v.z += chevron;
      }
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    torsoGeo.computeVertexNormals();
  }
  const torsoMesh = new THREE.Mesh(torsoGeo, porcelainMat);
  torsoMesh.castShadow = true;
  torsoMesh.receiveShadow = false;
  bodyGroup.add(torsoMesh);

  /* Tail feathers tucked behind */
  const tailGeo = track(new THREE.SphereGeometry(0.32, compact ? 14 : 18, compact ? 10 : 14));
  tailGeo.scale(0.95, 0.55, 1.35);
  const tailMesh = new THREE.Mesh(tailGeo, porcelainMat);
  tailMesh.position.set(0, -0.52, -0.58);
  tailMesh.rotation.x = -0.32;
  tailMesh.castShadow = true;
  bodyGroup.add(tailMesh);

  /* 2. Articulated Left & Right Sculpted Wings */
  function buildWing(side: -1 | 1): THREE.Group {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.70, 0.34, 0.02);

    const wingGeo = track(new THREE.SphereGeometry(0.54, compact ? 20 : 28, compact ? 16 : 22));
    const pos = wingGeo.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const ny = v.y / 0.54; // -1..1
      /* Teardrop wing contour hugging torso flank */
      v.x *= 0.34 * (1.0 - 0.25 * Math.max(0, -ny));
      v.y *= 1.18;
      v.z *= 0.76 * (1.0 - 0.32 * Math.max(0, -ny));
      /* Curve inward around body */
      v.x -= side * 0.08 * (ny * ny);
      /* Taper tip backward slightly */
      if (ny < 0) {
        v.z -= 0.12 * (-ny);
      }
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    wingGeo.computeVertexNormals();

    const mesh = new THREE.Mesh(wingGeo, porcelainMat);
    mesh.position.set(side * 0.08, -0.42, -0.02);
    mesh.rotation.z = side * -0.10;
    mesh.castShadow = true;
    mesh.receiveShadow = false;
    pivot.add(mesh);
    return pivot;
  }

  const leftWingPivot = buildWing(-1);
  const rightWingPivot = buildWing(1);
  bodyGroup.add(leftWingPivot, rightWingPivot);

  /* 3. Articulated Head Group with Vertex-Sculpted Binocular Facial Disc */
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.30, 0.04);
  owlRoot.add(headGroup);

  const craniumGeo = track(new THREE.SphereGeometry(1.0, compact ? 34 : 48, compact ? 26 : 36));
  {
    const pos = craniumGeo.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      /* Wide, charming vinyl-proportion owl cranium */
      v.x *= 1.04;
      v.y *= 0.87;
      v.z *= 0.88;

      if (v.z > 0.12) {
        /* Carve twin concave binocular facial-disc saucers around (+/-0.40, -0.05) */
        const dLeft = Math.hypot((v.x + 0.40) * 1.05, (v.y + 0.05) * 1.12);
        const dRight = Math.hypot((v.x - 0.40) * 1.05, (v.y + 0.05) * 1.12);

        const saucerL = Math.max(0, 1.0 - (dLeft / 0.46) ** 2);
        const saucerR = Math.max(0, 1.0 - (dRight / 0.46) ** 2);
        v.z -= (saucerL + saucerR) * 0.115;

        /* Raised heart/V-shaped owl supraorbital brow ridge framing the top of the facial disc */
        const browCurveY = 0.25 - 0.22 * Math.exp(-(v.x * v.x) * 7.5) + 0.08 * Math.abs(v.x);
        const distBrow = Math.abs(v.y - browCurveY);
        if (Math.abs(v.x) < 0.86 && distBrow < 0.16) {
          const ridge = Math.cos((distBrow / 0.16) * Math.PI * 0.5);
          v.z += ridge * ridge * 0.068;
        }
      }

      pos.setXYZ(i, v.x, v.y, v.z);
    }
    craniumGeo.computeVertexNormals();
  }

  const craniumMesh = new THREE.Mesh(craniumGeo, porcelainMat);
  craniumMesh.position.set(0, 0.34, 0);
  craniumMesh.castShadow = true;
  craniumMesh.receiveShadow = false;
  headGroup.add(craniumMesh);

  /* 4. Articulated Feathered Plumicorn Ear Tufts (Rounded owl feather tufts, not sharp cat cones) */
  function buildEarTuft(side: -1 | 1): THREE.Group {
    const tuftPivot = new THREE.Group();
    tuftPivot.position.set(side * 0.64, 0.90, 0.02);
    tuftPivot.rotation.z = side * -0.52;
    tuftPivot.rotation.x = 0.06;

    const outerGeo = track(new THREE.SphereGeometry(0.24, compact ? 14 : 20, compact ? 12 : 16));
    const pos = outerGeo.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const ny = v.y / 0.24; // -1..1
      /* Sculpt rounded feathery owl plumicorn sweeping slightly outward at tip */
      const taper = 1.0 - 0.42 * Math.max(0, ny);
      v.x = v.x * 0.88 * taper + side * 0.07 * Math.max(0, ny) ** 1.6;
      v.y = (v.y + 0.20) * 1.28;
      v.z *= 0.56 * taper;
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    outerGeo.computeVertexNormals();

    const outerMesh = new THREE.Mesh(outerGeo, porcelainMat);
    outerMesh.castShadow = true;
    outerMesh.receiveShadow = false;
    tuftPivot.add(outerMesh);

    /* Subtle mid-tone feather crease (renders as thin scanlines, not a black triangle) */
    const innerGeo = track(new THREE.SphereGeometry(0.11, compact ? 10 : 14, compact ? 8 : 10));
    innerGeo.scale(0.85, 1.45, 0.35);
    innerGeo.translate(side * 0.02, 0.22, 0.09);
    const innerMesh = new THREE.Mesh(innerGeo, softCreaseMat);
    tuftPivot.add(innerMesh);

    return tuftPivot;
  }

  const leftTuft = buildEarTuft(-1);
  const rightTuft = buildEarTuft(1);
  headGroup.add(leftTuft, rightTuft);

  /* 5. Huge Soulful Owl Eyes + Specular Pixel Catchlights + Articulated 3D Eyelids */
  interface EyeRig {
    root: THREE.Group;
    eyeball: THREE.Group;
    upperLid: THREE.Mesh;
    lowerLid: THREE.Mesh;
  }

  const sharedGlobeGeo = track(new THREE.SphereGeometry(0.215, compact ? 18 : 24, compact ? 14 : 18));
  const sharedGlintGeo = track(new THREE.SphereGeometry(0.068, compact ? 10 : 12, compact ? 8 : 12));
  const sharedLidGeo = track(
    new THREE.SphereGeometry(
      0.232,
      compact ? 18 : 24,
      compact ? 12 : 16,
      0,
      Math.PI * 2,
      0,
      Math.PI * 0.52
    )
  );

  function buildEye(side: -1 | 1): EyeRig {
    const root = new THREE.Group();
    root.position.set(side * 0.39, 0.28, 0.72);

    const eyeball = new THREE.Group();
    root.add(eyeball);

    const globeMesh = new THREE.Mesh(sharedGlobeGeo, obsidianFeatureMat);
    eyeball.add(globeMesh);

    /* Crisp white corneal catchlight positioned cleanly proud of the globe & below upper lid */
    const glintMesh = new THREE.Mesh(sharedGlintGeo, catchlightMat);
    glintMesh.position.set(-0.062, 0.044, 0.205);
    eyeball.add(glintMesh);

    /* Upper & lower hemispherical porcelain eyelids */
    const upperLid = new THREE.Mesh(sharedLidGeo, porcelainMat);
    upperLid.rotation.x = -1.42;
    root.add(upperLid);

    const lowerLid = new THREE.Mesh(sharedLidGeo, porcelainMat);
    lowerLid.rotation.z = Math.PI;
    lowerLid.rotation.x = 1.42;
    root.add(lowerLid);

    return { root, eyeball, upperLid, lowerLid };
  }

  const leftEye = buildEye(-1);
  const rightEye = buildEye(1);
  headGroup.add(leftEye.root, rightEye.root);

  /* 6. Compact Diamond Hooked Owl Beak (non-shadow-casting so chin stays clean white) */
  const beakGeo = track(new THREE.ConeGeometry(0.076, 0.175, compact ? 12 : 16));
  beakGeo.scale(0.84, 1.0, 0.90);
  const beakMesh = new THREE.Mesh(beakGeo, obsidianFeatureMat);
  beakMesh.position.set(0, 0.165, 0.875);
  beakMesh.rotation.x = Math.PI * 0.90;
  beakMesh.castShadow = false;
  headGroup.add(beakMesh);

  /* 7. Articulated Feet & 3-Toed Talons */
  const sharedToeGeo = track(new THREE.CapsuleGeometry(0.048, 0.14, compact ? 4 : 6, compact ? 8 : 10));

  function buildFoot(side: -1 | 1): THREE.Group {
    const footGroup = new THREE.Group();
    footGroup.position.set(side * 0.34, -1.34, 0.14);

    for (let t = -1; t <= 1; t++) {
      const toe = new THREE.Mesh(sharedToeGeo, talonMat);
      toe.rotation.x = Math.PI * 0.5;
      toe.rotation.z = t * -0.28;
      toe.position.set(t * 0.08, 0, 0.05);
      toe.castShadow = true;
      footGroup.add(toe);
    }
    return footGroup;
  }

  const leftFoot = buildFoot(-1);
  const rightFoot = buildFoot(1);
  owlRoot.add(leftFoot, rightFoot);

  /* -----------------------------------------------------------------------
     Spring Kinematics & 5-Act Behavioral Choreography State
     ----------------------------------------------------------------------- */
  const headYaw = new DampedSpring(0, 185, 21);
  const headPitch = new DampedSpring(0, 175, 20);
  const headRoll = new DampedSpring(0, 155, 17); // Signature owl head-tilt!
  const eyeYaw = new DampedSpring(0, 340, 26);
  const eyePitch = new DampedSpring(0, 340, 26);
  const lidSquint = new DampedSpring(0, 155, 20);

  const bodyX = new DampedSpring(1.15, 135, 19);
  const bodyY = new DampedSpring(-0.04, 195, 19);
  const bodyZ = new DampedSpring(-14.5, 125, 22);
  const bodyYaw = new DampedSpring(0.14, 120, 18);
  const bodyRoll = new DampedSpring(0, 170, 18);
  const bodySquash = new DampedSpring(0, 240, 17);
  const chestPuff = new DampedSpring(1.0, 160, 15);

  const leftWingOpen = new DampedSpring(0, 180, 16);
  const rightWingOpen = new DampedSpring(0, 180, 16);
  const leftTuftPerk = new DampedSpring(0.18, 195, 14);
  const rightTuftPerk = new DampedSpring(0.18, 195, 14);
  const tailPitch = new DampedSpring(0, 170, 16);
  const tailYaw = new DampedSpring(0, 150, 16);

  let manualScanStart = -999;
  let lastHopTriggerSec = -999;
  let nextHopSign = 1;
  let tapBiasTime = -999;
  let tapAimX = 0;
  let tapAimY = 0;
  const owlProjected = new THREE.Vector3();
  const footProjected = new THREE.Vector3();
  const owlScreenPos = new THREE.Vector2(0.46, 0.48);

  function snapToPerch(): void {
    bodyX.value = bodyX.target = -0.08;
    bodyX.velocity = 0;
    bodyY.value = bodyY.target = -0.04;
    bodyY.velocity = 0;
    bodyZ.value = bodyZ.target = 0;
    bodyZ.velocity = 0;
    bodyYaw.value = bodyYaw.target = -0.08;
    bodyYaw.velocity = 0;
    bodyRoll.value = bodyRoll.target = 0;
    bodyRoll.velocity = 0;
    leftTuftPerk.value = leftTuftPerk.target = 0;
    rightTuftPerk.value = rightTuftPerk.target = 0;
  }

  function triggerScanHop(timeSec: number, aimX?: number, aimY?: number): void {
    const sinceLast = timeSec - lastHopTriggerSec;
    lastHopTriggerSec = timeSec;
    manualScanStart = timeSec;

    const hasAim = typeof aimX === 'number' && typeof aimY === 'number';
    if (hasAim) {
      tapAimX = THREE.MathUtils.clamp(aimX, -1, 1);
      tapAimY = THREE.MathUtils.clamp(aimY, -1, 1);
      tapBiasTime = timeSec;
    }

    /* Soften stacked velocities when pulsing rapidly so rapid clicks stay springy */
    const gain = sinceLast >= 0 && sinceLast < 0.32 ? 0.38 : 1.0;
    nextHopSign =
      hasAim && Math.abs(tapAimX) > 0.12 ? (tapAimX >= 0 ? -1 : 1) : -nextHopSign;

    bodyY.velocity = Math.min(bodyY.velocity + 2.35 * gain, 3.3);
    bodySquash.impulse(-0.42 * gain);
    chestPuff.impulse(0.85 * gain);
    leftWingOpen.velocity = Math.min(leftWingOpen.velocity + 3.0 * gain, 4.4);
    rightWingOpen.velocity = Math.min(rightWingOpen.velocity + 3.4 * gain, 4.8);
    leftTuftPerk.impulse(2.6 * gain);
    rightTuftPerk.impulse(2.6 * gain);
    tailPitch.impulse(-1.35 * gain);
    headRoll.impulse(nextHopSign * 1.65 * gain);
    if (hasAim) {
      eyeYaw.impulse(tapAimX * 1.25 * gain);
      eyePitch.impulse(tapAimY * 0.9 * gain);
    }
  }

  function computeBlinkAmount(t: number, cycleT: number, inWalk: boolean): number {
    /* Double-blink during Act 3 (cycleT ~ 9.1s) + periodic natural bird blinks */
    const pulse = (center: number, width: number): number => {
      const d = Math.abs(cycleT - center);
      return d < width ? Math.cos((d / width) * Math.PI * 0.5) ** 2 : 0;
    };

    if (inWalk) {
      const d = Math.abs(t - 1.38);
      return d < 0.10 ? Math.cos((d / 0.10) * Math.PI * 0.5) ** 2 : 0;
    }

    let blink = Math.max(
      pulse(1.68, 0.11),
      pulse(5.15, 0.10),
      pulse(9.05, 0.09),
      pulse(9.28, 0.09) // Rapid double-blink!
    );

    /* Occasional organic aperiodic blink */
    const slowPhase = (t * 0.27) % 1.0;
    if (slowPhase > 0.965) {
      const local = (slowPhase - 0.965) / 0.035;
      blink = Math.max(blink, Math.sin(local * Math.PI));
    }

    return blink;
  }

  function update(
    timeSec: number,
    dt: number,
    interaction: OwlInteractionState
  ): { scanWave: number; owlScreenPos: THREE.Vector2; footY: number } {
    const LOOP_LEN = 12.6;
    const isWalkingIn = timeSec < WALK_IN_DURATION;
    /* Offset arrival into calm Act 4 perch (~1.7s breathe) before first sidestep hop */
    const cycleT = isWalkingIn ? 11.4 : (timeSec - WALK_IN_DURATION + 10.9) % LOOP_LEN;
    const breath = Math.sin(timeSec * 2.25);

    /* Base targets before behavioral act overrides */
    let tgtHeadYaw = 0;
    let tgtHeadPitch = 0;
    let tgtHeadRoll = 0;
    let tgtEyeYaw = 0;
    let tgtEyePitch = 0;
    let tgtSquint = 0;
    let tgtBodyX = -0.08;
    let tgtBodyY = -0.04;
    let tgtBodyZ = 0;
    let tgtBodyYaw = -0.08;
    let tgtBodyRoll = 0;
    let tgtSquash = 0;
    let tgtPuff = 1.0 + breath * 0.015; // Calm chest breathing
    let tgtLWing = Math.max(0, breath) * 0.018;
    let tgtRWing = Math.max(0, breath) * 0.018;
    let tgtLTuft = 0;
    let tgtRTuft = 0;
    let tgtTailPitch = -breath * 0.03;
    let tgtTailYaw = 0;
    let leftFootLift = 0;
    let rightFootLift = 0;
    let leftFootSwingZ = 0;
    let rightFootSwingZ = 0;
    let leftFootFlexX = 0;
    let rightFootFlexX = 0;

    if (isWalkingIn) {
      /* -----------------------------------------------------------------
         Entrance Walk-In: Grounded 6-Step Owl Stride From Far Depth (-14.5 -> 0)
         with opposite-phase swing/stance pinning, lateral waddle, wing
         balance, tail counterbalance, and avian head-gimbal stabilization.
         ----------------------------------------------------------------- */
      const u = THREE.MathUtils.clamp(timeSec / WALK_IN_DURATION, 0, 1);
      const strideEnv = smoothstep(0.0, 0.10, u) * (1 - smoothstep(0.84, 1.0, u));
      const phi = u * 3.0 * Math.PI * 2; // 3 full L+R gait cycles (6 clean steps)
      const stepSin = Math.sin(phi);
      const stepCos = Math.cos(phi);

      /* Monotonically advancing Z/X travel with gentle stride surge per push-off */
      const baseTravel = smoothstep(0.0, 0.96, u);
      const travel = THREE.MathUtils.clamp(
        baseTravel + Math.sin(2 * phi) * 0.008 * strideEnv,
        0,
        1
      );
      const curveS = Math.sin(u * Math.PI) * 0.14;
      const walkX = THREE.MathUtils.lerp(1.15, -0.08, travel) - curveS;
      const walkZ = THREE.MathUtils.lerp(-14.5, 0.0, travel);

      /* Grounded alternating feet: swinging foot lifts forward (-cos -> +cos),
         planted stance foot sweeps smoothly backward relative to moving torso
         so talons stay pinned against the floor shadow without foot-sliding. */
      const strideZ = 0.25 * strideEnv;
      const swingL = Math.max(0, stepSin);
      const swingR = Math.max(0, -stepSin);

      leftFootLift = swingL * 0.22 * strideEnv;
      rightFootLift = swingR * 0.22 * strideEnv;
      leftFootSwingZ = -stepCos * strideZ;
      rightFootSwingZ = stepCos * strideZ;
      leftFootFlexX = -0.34 * swingL * strideEnv;
      rightFootFlexX = -0.34 * swingR * strideEnv;

      /* Plump owl center-of-mass weight shift onto supporting foot + bounce */
      const doubleSupport = 1 - Math.abs(stepSin);
      tgtBodyX = walkX + stepSin * 0.055 * strideEnv;
      tgtBodyZ = walkZ;
      tgtBodyY = -0.04 + Math.abs(stepSin) * 0.075 * strideEnv - doubleSupport * 0.018 * strideEnv;
      tgtBodyRoll = -stepSin * 0.088 * strideEnv;
      tgtBodyYaw = THREE.MathUtils.lerp(0.14, -0.08, smoothstep(0.1, 0.94, u)) - stepSin * 0.095 * strideEnv;
      tgtSquash = doubleSupport * 0.052 * strideEnv;
      tgtPuff += Math.abs(stepSin) * 0.025 * strideEnv;

      /* Balance wings & tail counterbalance */
      tgtLWing += (swingR * 0.15 + swingL * 0.06) * strideEnv;
      tgtRWing += (swingL * 0.15 + swingR * 0.06) * strideEnv;
      tgtTailPitch = -0.06 + Math.abs(stepSin) * 0.16 * strideEnv;
      tgtTailYaw = stepSin * 0.12 * strideEnv;

      /* Avian gimbal head stabilization + alert arrival glance */
      const curiosity = Math.sin(u * Math.PI * 1.5) * 0.16 * (1 - smoothstep(0.75, 1.0, u));
      tgtHeadRoll = -tgtBodyRoll * 0.65;
      tgtHeadYaw = stepSin * 0.045 * strideEnv + curiosity;
      tgtHeadPitch = -0.04 * strideEnv + Math.cos(2 * phi) * 0.032 * strideEnv;
      tgtEyeYaw = curiosity * 0.45;
      tgtLTuft = 0.22 * smoothstep(0.0, 0.8, u);
      tgtRTuft = 0.22 * smoothstep(0.0, 0.8, u);
    } else if (cycleT < 2.4) {
      /* ACT 0: Seamless anticipation crouch -> 2-step sidestep hop -> ruffle */
      if (cycleT < 0.18) {
        const p = cycleT / 0.18;
        const dip = smoothstep(0, 1, p);
        tgtBodyY = -0.04 - dip * 0.042;
        tgtSquash = dip * 0.065;
        tgtHeadPitch = dip * 0.05;
        tgtTailPitch = -dip * 0.08;
      } else if (cycleT < 0.85) {
        const p = (cycleT - 0.18) / 0.67;
        const arc = Math.sin(p * Math.PI);
        tgtBodyX = THREE.MathUtils.lerp(-0.08, 0.02, smoothstep(0, 1, p));
        tgtBodyY = -0.04 + arc * 0.145;
        leftFootLift = arc * 0.16;
        tgtHeadRoll = -0.09 * arc;
        tgtLWing += arc * 0.22;
        tgtRWing += arc * 0.22;
        tgtTailPitch = 0.22 * arc;
        tgtSquash = p > 0.82 ? ((p - 0.82) / 0.18) * 0.055 : -0.03 * arc;
      } else if (cycleT < 1.52) {
        const p = (cycleT - 0.85) / 0.67;
        const arc = Math.sin(p * Math.PI);
        tgtBodyX = THREE.MathUtils.lerp(0.02, -0.08, smoothstep(0, 1, p));
        tgtBodyY = -0.04 + arc * 0.12;
        rightFootLift = arc * 0.145;
        tgtHeadRoll = 0.08 * arc;
        tgtLWing += arc * 0.19;
        tgtRWing += arc * 0.19;
        tgtTailPitch = 0.18 * arc;
        tgtSquash = p > 0.82 ? ((p - 0.82) / 0.18) * 0.065 : -0.025 * arc;
      } else {
        /* Landing cushion & feather ruffle settle */
        const settleT = cycleT - 1.52;
        const fadeOut = 1 - smoothstep(2.05, 2.4, cycleT);
        const flutter = Math.exp(-settleT * 4.0) * Math.sin(settleT * 34.0);
        tgtSquash = Math.exp(-settleT * 9.0) * 0.075;
        tgtLWing += Math.max(0, flutter * 0.24);
        tgtRWing += Math.max(0, -flutter * 0.24);
        tgtPuff += Math.exp(-settleT * 2.6) * 0.042;
        tgtLTuft = 0.12 * fadeOut;
        tgtRTuft = 0.12 * fadeOut;
      }
    } else if (cycleT < 5.2) {
      /* ACT 1: Signature ~25° Curious Owl Head-Tilt + Smooth Analytical Squint */
      const env = smoothstep(2.4, 2.74, cycleT) * (1 - smoothstep(4.85, 5.2, cycleT));
      const microSearch = Math.sin((cycleT - 2.6) * 2.6) * 0.024;
      tgtEyeYaw = 0.14 * env;
      tgtEyePitch = 0.06 * env;
      tgtHeadYaw = 0.12 * env + microSearch * env;
      tgtHeadPitch = -0.04 * env;
      tgtHeadRoll = 0.44 * env; // ~25.2 deg owl head cock!
      tgtLTuft = 0.22 * env;
      tgtRTuft = 0.34 * env;
      tgtSquint = 0.36 * smoothstep(2.55, 2.88, cycleT) * (1 - smoothstep(4.75, 5.15, cycleT));
      /* Micro ear-tuft radar twitch */
      if (cycleT > 3.7 && cycleT < 4.1) {
        tgtRTuft += Math.sin((cycleT - 3.7) * 24.0) * 0.14;
      }
    } else if (cycleT < 8.5) {
      /* ACT 2: Architectural Sonar Sweep + Eye-Leads-Head Bird Saccades */
      const entry = smoothstep(5.2, 5.5, cycleT);
      const exit = 1 - smoothstep(8.1, 8.5, cycleT);
      const actEnv = entry * exit;

      /* Smooth saccade stops with eyes leading head by ~120ms */
      const s12 = smoothstep(6.22, 6.46, cycleT);
      const s23 = smoothstep(7.22, 7.46, cycleT);
      const stopYaw = THREE.MathUtils.lerp(-0.28, THREE.MathUtils.lerp(0.06, 0.32, s23), s12);
      const eLead12 = smoothstep(6.10, 6.32, cycleT);
      const eLead23 = smoothstep(7.10, 7.32, cycleT);
      const stopEye = THREE.MathUtils.lerp(-0.17, THREE.MathUtils.lerp(0.09, 0.20, eLead23), eLead12);

      tgtHeadYaw = stopYaw * actEnv;
      tgtEyeYaw = stopEye * actEnv;
      tgtHeadPitch = 0.04 * actEnv;
      tgtHeadRoll = -0.10 * actEnv;
      tgtBodyYaw = THREE.MathUtils.lerp(-0.08, -0.02, actEnv);

      /* Right wing sweeps outward while tail & left wing counterbalance */
      const wingWindow =
        smoothstep(5.35, 6.1, cycleT) * (1 - smoothstep(7.7, 8.45, cycleT));
      tgtRWing += wingWindow * 0.54;
      tgtLWing += wingWindow * 0.08;
      tgtTailYaw = -0.14 * wingWindow;
      tgtPuff += 0.02 * wingWindow;
      tgtLTuft = 0.28 * actEnv;
      tgtRTuft = 0.28 * actEnv;
    } else if (cycleT < 10.7) {
      /* ACT 3: Quick Bird Saccade Glance Left (Toward Headline & CTA) + Double-Blink */
      const env = smoothstep(8.5, 8.76, cycleT) * (1 - smoothstep(10.35, 10.7, cycleT));
      const eyeEnv = smoothstep(8.46, 8.66, cycleT) * (1 - smoothstep(10.35, 10.7, cycleT));
      tgtEyeYaw = -0.24 * eyeEnv;
      tgtEyePitch = -0.06 * eyeEnv;
      tgtHeadYaw = -0.36 * env;
      tgtHeadPitch = -0.06 * env;
      tgtHeadRoll = -0.18 * env;
      tgtBodyYaw = THREE.MathUtils.lerp(-0.08, -0.16, env);
      tgtTailYaw = 0.10 * env;
      tgtLTuft = 0.20 * env;
      tgtRTuft = 0.14 * env;
    } else {
      /* ACT 4: Calm Attentive Perch with tapered neutral loop return */
      const settleEnv = smoothstep(10.7, 11.1, cycleT) * (1 - smoothstep(12.2, 12.6, cycleT));
      tgtHeadYaw = Math.sin(timeSec * 0.9) * 0.04 * settleEnv;
      tgtHeadRoll = Math.sin(timeSec * 0.7) * 0.03 * settleEnv;
    }

    /* -------------------------------------------------------------------
       Live User Interactivity Blending (Pointer Tracking, Tap Aim & CTA Hover)
       ------------------------------------------------------------------- */
    const sinceTap = timeSec - tapBiasTime;
    const tapBlend =
      sinceTap >= 0 && sinceTap < 1.25
        ? Math.exp(-sinceTap * 2.1) * (1 - smoothstep(0.85, 1.25, sinceTap))
        : 0;

    if (interaction.inspectingCta) {
      /* Owl turns attentively toward the left-side CTA / CLI command */
      tgtEyeYaw = -0.26;
      tgtEyePitch = -0.12;
      tgtHeadYaw = -0.44;
      tgtHeadPitch = -0.14;
      tgtHeadRoll = 0.28;
      tgtBodyYaw = -0.18;
      tgtTailYaw = 0.12;
      tgtLTuft = 0.36;
      tgtRTuft = 0.36;
      tgtLWing = Math.max(tgtLWing, 0.12);
      tgtSquint = Math.max(tgtSquint, 0.12);
    } else if (tapBlend > 0.01) {
      /* Brief turn toward where the user clicked/tapped on the owl stage */
      tgtEyeYaw = THREE.MathUtils.lerp(tgtEyeYaw, tapAimX * 0.28, tapBlend * 0.85);
      tgtEyePitch = THREE.MathUtils.lerp(tgtEyePitch, tapAimY * 0.22, tapBlend * 0.85);
      tgtHeadYaw = THREE.MathUtils.lerp(tgtHeadYaw, tapAimX * 0.42, tapBlend * 0.75);
      tgtHeadPitch = THREE.MathUtils.lerp(tgtHeadPitch, -tapAimY * 0.22, tapBlend * 0.75);
    } else if (interaction.pointerActive) {
      /* Blend 72% live cursor gaze with 28% autonomous owl personality */
      const lookX = THREE.MathUtils.clamp(interaction.pointerX - 0.18, -1.0, 1.0);
      const lookY = THREE.MathUtils.clamp(interaction.pointerY, -1.0, 1.0);
      tgtEyeYaw = THREE.MathUtils.lerp(tgtEyeYaw, lookX * 0.26, 0.82);
      tgtEyePitch = THREE.MathUtils.lerp(tgtEyePitch, lookY * 0.20, 0.82);
      tgtHeadYaw = THREE.MathUtils.lerp(tgtHeadYaw, lookX * 0.46, 0.72);
      tgtHeadPitch = THREE.MathUtils.lerp(tgtHeadPitch, -lookY * 0.26, 0.72);
      tgtHeadRoll = THREE.MathUtils.lerp(tgtHeadRoll, -lookX * lookY * 0.32, 0.55);
      tgtTailYaw = THREE.MathUtils.lerp(tgtTailYaw, -lookX * 0.08, 0.5);
      tgtLTuft = Math.max(tgtLTuft, 0.18);
      tgtRTuft = Math.max(tgtRTuft, 0.18);
    }

    /* Drive all damped springs */
    headYaw.target = tgtHeadYaw;
    headPitch.target = tgtHeadPitch;
    headRoll.target = tgtHeadRoll;
    eyeYaw.target = tgtEyeYaw;
    eyePitch.target = tgtEyePitch;
    lidSquint.target = tgtSquint;
    bodyX.target = tgtBodyX;
    bodyY.target = tgtBodyY;
    bodyZ.target = tgtBodyZ;
    bodyYaw.target = tgtBodyYaw;
    bodyRoll.target = tgtBodyRoll;
    bodySquash.target = tgtSquash;
    chestPuff.target = tgtPuff;
    leftWingOpen.target = tgtLWing;
    rightWingOpen.target = tgtRWing;
    leftTuftPerk.target = tgtLTuft;
    rightTuftPerk.target = tgtRTuft;
    tailPitch.target = tgtTailPitch;
    tailYaw.target = tgtTailYaw;

    const hYaw = headYaw.step(dt);
    const hPitch = headPitch.step(dt);
    const hRoll = headRoll.step(dt);
    const eYaw = eyeYaw.step(dt);
    const ePitch = eyePitch.step(dt);
    const squint = Math.max(0, lidSquint.step(dt));
    const bX = bodyX.step(dt);
    const bY = bodyY.step(dt);
    const bZ = bodyZ.step(dt);
    const bYaw = bodyYaw.step(dt);
    const bRoll = bodyRoll.step(dt);
    const squash = THREE.MathUtils.clamp(bodySquash.step(dt), -0.14, 0.16);
    const puff = chestPuff.step(dt);
    const lWing = leftWingOpen.step(dt);
    const rWing = rightWingOpen.step(dt);
    const lTuft = leftTuftPerk.step(dt);
    const rTuft = rightTuftPerk.step(dt);
    const tPitch = tailPitch.step(dt);
    const tYaw = tailYaw.step(dt);

    /* Keep directional shadow frustum centered around the owl at every depth */
    keyLight.position.set(bX - 6.4, 2.75, bZ + 1.95);
    keyLight.target.position.set(bX, 0, bZ);
    keyLight.target.updateMatrixWorld();

    /* Apply kinematics to 3D rig (plus subtle pitch tilt from gaze) */
    owlRoot.position.set(bX, bY, bZ);
    owlRoot.rotation.y = bYaw;
    owlRoot.rotation.z = bRoll;
    owlRoot.rotation.x = THREE.MathUtils.clamp(-ePitch * 0.05, -0.035, 0.035);

    const stretchX = puff * (1 + squash * 0.45);
    const stretchY = (2.0 - puff) * (1 - squash);
    torsoMesh.scale.set(stretchX, stretchY, stretchX);

    tailMesh.rotation.x = -0.32 + tPitch;
    tailMesh.rotation.y = tYaw;

    headGroup.rotation.set(hPitch, hYaw, hRoll, 'YXZ');

    leftEye.eyeball.rotation.set(-ePitch, eYaw, 0, 'YXZ');
    rightEye.eyeball.rotation.set(-ePitch, eYaw, 0, 'YXZ');

    const blink = computeBlinkAmount(timeSec, cycleT, isWalkingIn);
    const interactiveWide = interaction.inspectingCta ? -0.08 : 0;
    leftEye.upperLid.rotation.x = THREE.MathUtils.lerp(-1.42 + interactiveWide, -0.02, blink);
    rightEye.upperLid.rotation.x = THREE.MathUtils.lerp(-1.42 + interactiveWide, -0.02, blink);
    leftEye.lowerLid.rotation.x = THREE.MathUtils.lerp(1.42, 0.88, Math.max(blink * 0.7, squint));
    rightEye.lowerLid.rotation.x = THREE.MathUtils.lerp(1.42, 0.88, Math.max(blink * 0.7, squint));

    leftWingPivot.rotation.z = -lWing;
    leftWingPivot.rotation.x = lWing * 0.25;
    rightWingPivot.rotation.z = rWing;
    rightWingPivot.rotation.x = -rWing * 0.30;

    leftTuft.rotation.z = 0.52 - lTuft * 0.42;
    rightTuft.rotation.z = -0.52 + rTuft * 0.42;

    const groundOffset = Math.max(0, bY + 0.04) * 0.35;
    leftFoot.position.set(-0.34, -1.34 - groundOffset + leftFootLift, 0.14 + leftFootSwingZ);
    rightFoot.position.set(0.34, -1.34 - groundOffset + rightFootLift, 0.14 + rightFootSwingZ);
    leftFoot.rotation.x = leftFootFlexX;
    rightFoot.rotation.x = rightFootFlexX;

    /* Compute active sonar scan wave progress (-1 when idle, 0..1.25 when sweeping) */
    let scanWave = -1.0;
    const sinceManual = timeSec - manualScanStart;
    if (sinceManual >= 0 && sinceManual <= 1.35) {
      scanWave = sinceManual / 1.1;
    } else if (!isWalkingIn && cycleT >= 5.75 && cycleT <= 7.25) {
      scanWave = (cycleT - 5.75) / 1.2;
    }

    /* Project Owl chest/head center and ground horizon line in normalized stage UV */
    owlProjected.set(bX, bY + 0.2, bZ).project(camera);
    owlScreenPos.set(owlProjected.x * 0.5 + 0.5, owlProjected.y * 0.5 + 0.5);

    footProjected.set(bX, -1.4, bZ).project(camera);
    const footY = THREE.MathUtils.clamp(footProjected.y * 0.5 + 0.5, 0.05, 0.85);

    return { scanWave, owlScreenPos, footY };
  }

  function dispose(): void {
    for (const item of disposables) {
      item.dispose();
    }
  }

  return {
    scene,
    camera,
    update,
    triggerScanHop,
    snapToPerch,
    dispose,
  };
}
