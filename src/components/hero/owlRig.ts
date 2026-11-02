import * as THREE from 'three';

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

export interface OwlSceneController {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  update: (timeSec: number, dt: number, interaction: OwlInteractionState) => {
    scanWave: number;
    owlScreenPos: THREE.Vector2;
  };
  triggerScanHop: (timeSec: number) => void;
  dispose: () => void;
}

/**
 * Builds the vertex-sculpted 3D Little Owl (*Athene noctua*) rig, directional
 * architectural studio lighting, ground shadow catcher, and 5-act behavioral
 * spring-physics animation director.
 */
export function createOwlSceneController(): OwlSceneController {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 40);
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

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.88);
  keyLight.position.set(-6.4, 2.75, 1.95);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(512, 512);
  keyLight.shadow.camera.near = 1.0;
  keyLight.shadow.camera.far = 18.0;
  keyLight.shadow.camera.left = -3.5;
  keyLight.shadow.camera.right = 5.5;
  keyLight.shadow.camera.top = 3.5;
  keyLight.shadow.camera.bottom = -3.5;
  keyLight.shadow.bias = -0.0008;
  keyLight.shadow.radius = 2.5;
  scene.add(keyLight);

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

  /* Ground Shadow Catcher at y = -1.38 */
  const floorGeo = track(new THREE.PlaneGeometry(14, 8));
  const floorMat = track(
    new THREE.ShadowMaterial({
      color: 0x000000,
      opacity: 0.44,
    })
  );
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.set(1.2, -1.38, 0);
  floorMesh.receiveShadow = true;
  scene.add(floorMesh);

  /* -----------------------------------------------------------------------
     Root Owl Rig Hierarchy
     ----------------------------------------------------------------------- */
  const owlRoot = new THREE.Group();
  owlRoot.position.set(-0.08, -0.04, 0);
  /* Slight 3/4 sculptural angle so left side catches key light and right side casts depth */
  owlRoot.rotation.y = -0.08;
  scene.add(owlRoot);

  /* 1. Sculpted Plump Owl Torso */
  const bodyGroup = new THREE.Group();
  bodyGroup.position.set(0, -0.62, 0);
  owlRoot.add(bodyGroup);

  const torsoGeo = track(new THREE.SphereGeometry(0.82, 40, 30));
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
  const tailGeo = track(new THREE.SphereGeometry(0.32, 18, 14));
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

    const wingGeo = track(new THREE.SphereGeometry(0.54, 28, 22));
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

  const craniumGeo = track(new THREE.SphereGeometry(1.0, 48, 36));
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

    const outerGeo = track(new THREE.SphereGeometry(0.24, 20, 16));
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
    const innerGeo = track(new THREE.SphereGeometry(0.11, 14, 10));
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

  const sharedGlobeGeo = track(new THREE.SphereGeometry(0.215, 24, 18));
  const sharedGlintGeo = track(new THREE.SphereGeometry(0.068, 12, 12));
  const sharedLidGeo = track(
    new THREE.SphereGeometry(0.232, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.52)
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
  const beakGeo = track(new THREE.ConeGeometry(0.076, 0.175, 16));
  beakGeo.scale(0.84, 1.0, 0.90);
  const beakMesh = new THREE.Mesh(beakGeo, obsidianFeatureMat);
  beakMesh.position.set(0, 0.165, 0.875);
  beakMesh.rotation.x = Math.PI * 0.90;
  beakMesh.castShadow = false;
  headGroup.add(beakMesh);

  /* 7. Articulated Feet & 3-Toed Talons */
  const sharedToeGeo = track(new THREE.CapsuleGeometry(0.048, 0.14, 6, 10));

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
  const eyeYaw = new DampedSpring(0, 320, 26);
  const eyePitch = new DampedSpring(0, 320, 26);

  const bodyX = new DampedSpring(-0.08, 130, 18);
  const bodyY = new DampedSpring(-0.04, 190, 19);
  const bodyYaw = new DampedSpring(-0.08, 120, 18);
  const chestPuff = new DampedSpring(1.0, 160, 15);

  const leftWingOpen = new DampedSpring(0, 180, 16);
  const rightWingOpen = new DampedSpring(0, 180, 16);
  const leftTuftPerk = new DampedSpring(0, 195, 14);
  const rightTuftPerk = new DampedSpring(0, 195, 14);

  let manualScanStart = -999;
  let lastAutoScanCycle = -1;
  const owlProjected = new THREE.Vector3();
  const owlScreenPos = new THREE.Vector2(0.46, 0.48);

  function triggerScanHop(timeSec: number): void {
    manualScanStart = timeSec;
    bodyY.impulse(2.35);
    chestPuff.impulse(0.9);
    leftWingOpen.impulse(3.2);
    rightWingOpen.impulse(3.6);
    leftTuftPerk.impulse(2.8);
    rightTuftPerk.impulse(2.8);
    headRoll.impulse((Math.random() > 0.5 ? 1 : -1) * 1.8);
  }

  function computeBlinkAmount(t: number, cycleT: number): { blink: number; squint: number } {
    /* Double-blink during Act 3 (cycleT ~ 9.1s) + periodic natural bird blinks */
    const pulse = (center: number, width: number): number => {
      const d = Math.abs(cycleT - center);
      return d < width ? Math.cos((d / width) * Math.PI * 0.5) ** 2 : 0;
    };

    let blink = Math.max(
      pulse(1.65, 0.11),
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

    /* Curious analytical lower-lid squint during Act 1 head-tilt */
    const squint = cycleT >= 2.6 && cycleT <= 5.0 ? 0.36 : 0.0;
    return { blink, squint };
  }

  function update(
    timeSec: number,
    dt: number,
    interaction: OwlInteractionState
  ): { scanWave: number; owlScreenPos: THREE.Vector2 } {
    const LOOP_LEN = 12.6;
    const cycleT = timeSec % LOOP_LEN;
    const cycleIndex = Math.floor(timeSec / LOOP_LEN);

    /* Base targets before behavioral act overrides */
    let tgtHeadYaw = 0;
    let tgtHeadPitch = 0;
    let tgtHeadRoll = 0;
    let tgtEyeYaw = 0;
    let tgtEyePitch = 0;
    let tgtBodyX = -0.08;
    let tgtBodyY = -0.04;
    let tgtBodyYaw = -0.08;
    let tgtPuff = 1.0 + Math.sin(timeSec * 2.35) * 0.016; // Calm breathing
    let tgtLWing = 0;
    let tgtRWing = 0;
    let tgtLTuft = 0;
    let tgtRTuft = 0;
    let leftFootLift = 0;
    let rightFootLift = 0;

    /* -------------------------------------------------------------------
       5-Act Autonomous Owl Story Choreography
       ------------------------------------------------------------------- */
    if (cycleT < 2.4) {
      /* ACT 0: Charming 2-step owl sidestep hop & feather ruffle settle */
      if (cycleT < 0.75) {
        const p = cycleT / 0.75;
        tgtBodyX = -0.22 + p * 0.08;
        tgtBodyY = -0.04 + Math.sin(p * Math.PI) * 0.14;
        leftFootLift = Math.sin(p * Math.PI) * 0.16;
        tgtHeadRoll = -0.08;
        tgtLWing = Math.sin(p * Math.PI) * 0.22;
        tgtRWing = Math.sin(p * Math.PI) * 0.22;
      } else if (cycleT < 1.45) {
        const p = (cycleT - 0.75) / 0.7;
        tgtBodyX = -0.14 + p * 0.06;
        tgtBodyY = -0.04 + Math.sin(p * Math.PI) * 0.11;
        rightFootLift = Math.sin(p * Math.PI) * 0.14;
        tgtHeadRoll = 0.07;
        tgtLWing = Math.sin(p * Math.PI) * 0.18;
        tgtRWing = Math.sin(p * Math.PI) * 0.18;
      } else {
        /* Feather ruffle flutter & chest settle */
        const settleT = cycleT - 1.45;
        const flutter = Math.exp(-settleT * 3.8) * Math.sin(settleT * 36.0);
        tgtLWing = Math.max(0, flutter * 0.24);
        tgtRWing = Math.max(0, -flutter * 0.24);
        tgtPuff += Math.exp(-settleT * 2.5) * 0.045;
        tgtLTuft = 0.12;
        tgtRTuft = 0.12;
      }
    } else if (cycleT < 5.2) {
      /* ACT 1: Signature 26° Curious Owl Head-Tilt ("Inspecting a Command") */
      tgtEyeYaw = 0.14;
      tgtEyePitch = 0.06;
      tgtHeadYaw = 0.12;
      tgtHeadPitch = -0.04;
      tgtHeadRoll = 0.44; // ~25.2 deg owl head cock!
      tgtLTuft = 0.22;
      tgtRTuft = 0.34;
      /* Micro ear-tuft radar twitch */
      if (cycleT > 3.7 && cycleT < 4.1) {
        tgtRTuft += Math.sin((cycleT - 3.7) * 24.0) * 0.14;
      }
    } else if (cycleT < 8.5) {
      /* ACT 2: 18ms Architectural Sonar Sweep + Expressive Right-Wing Gesture */
      if (cycleT > 5.75 && lastAutoScanCycle !== cycleIndex) {
        lastAutoScanCycle = cycleIndex;
      }
      /* 3-stop bird saccade across the solution graph */
      if (cycleT < 6.3) {
        tgtHeadYaw = -0.28;
        tgtEyeYaw = -0.16;
      } else if (cycleT < 7.3) {
        tgtHeadYaw = 0.06;
        tgtEyeYaw = 0.08;
      } else {
        tgtHeadYaw = 0.32;
        tgtEyeYaw = 0.18;
      }
      tgtHeadPitch = 0.04;
      tgtHeadRoll = -0.10;
      tgtBodyYaw = -0.02;
      /* Right wing lifts outward like a conductor / architect tracing a flow */
      const wingWindow = Math.sin(
        Math.min(1, Math.max(0, (cycleT - 5.4) / 2.8)) * Math.PI
      );
      tgtRWing = wingWindow * 0.56;
      tgtLTuft = 0.28;
      tgtRTuft = 0.28;
    } else if (cycleT < 10.7) {
      /* ACT 3: Quick Bird Saccade Glance Left (Toward Headline & CTA) + Double-Blink */
      tgtEyeYaw = -0.24;
      tgtEyePitch = -0.06;
      tgtHeadYaw = -0.36;
      tgtHeadPitch = -0.06;
      tgtHeadRoll = -0.18;
      tgtBodyYaw = -0.16;
      tgtLTuft = 0.20;
      tgtRTuft = 0.14;
    } else {
      /* ACT 4: Calm Attentive Perch */
      tgtHeadYaw = Math.sin(timeSec * 0.9) * 0.04;
      tgtHeadRoll = Math.sin(timeSec * 0.7) * 0.03;
    }

    /* -------------------------------------------------------------------
       Live User Interactivity Blending (Pointer Tracking & CTA Hover)
       ------------------------------------------------------------------- */
    if (interaction.inspectingCta) {
      /* Owl turns attentively toward the left-side CTA / CLI command */
      tgtEyeYaw = -0.26;
      tgtEyePitch = -0.12;
      tgtHeadYaw = -0.44;
      tgtHeadPitch = -0.14;
      tgtHeadRoll = 0.28;
      tgtBodyYaw = -0.18;
      tgtLTuft = 0.36;
      tgtRTuft = 0.36;
      tgtLWing = 0.12;
    } else if (interaction.pointerActive) {
      /* Blend 72% live cursor gaze with 28% autonomous owl personality */
      const lookX = THREE.MathUtils.clamp(interaction.pointerX - 0.18, -1.0, 1.0);
      const lookY = THREE.MathUtils.clamp(interaction.pointerY, -1.0, 1.0);
      tgtEyeYaw = THREE.MathUtils.lerp(tgtEyeYaw, lookX * 0.26, 0.82);
      tgtEyePitch = THREE.MathUtils.lerp(tgtEyePitch, lookY * 0.20, 0.82);
      tgtHeadYaw = THREE.MathUtils.lerp(tgtHeadYaw, lookX * 0.46, 0.72);
      tgtHeadPitch = THREE.MathUtils.lerp(tgtHeadPitch, -lookY * 0.26, 0.72);
      tgtHeadRoll = THREE.MathUtils.lerp(tgtHeadRoll, -lookX * lookY * 0.32, 0.55);
      tgtLTuft = Math.max(tgtLTuft, 0.18);
      tgtRTuft = Math.max(tgtRTuft, 0.18);
    }

    /* Drive all damped springs */
    headYaw.target = tgtHeadYaw;
    headPitch.target = tgtHeadPitch;
    headRoll.target = tgtHeadRoll;
    eyeYaw.target = tgtEyeYaw;
    eyePitch.target = tgtEyePitch;
    bodyX.target = tgtBodyX;
    bodyY.target = tgtBodyY;
    bodyYaw.target = tgtBodyYaw;
    chestPuff.target = tgtPuff;
    leftWingOpen.target = tgtLWing;
    rightWingOpen.target = tgtRWing;
    leftTuftPerk.target = tgtLTuft;
    rightTuftPerk.target = tgtRTuft;

    const hYaw = headYaw.step(dt);
    const hPitch = headPitch.step(dt);
    const hRoll = headRoll.step(dt);
    const eYaw = eyeYaw.step(dt);
    const ePitch = eyePitch.step(dt);
    const bX = bodyX.step(dt);
    const bY = bodyY.step(dt);
    const bYaw = bodyYaw.step(dt);
    const puff = chestPuff.step(dt);
    const lWing = leftWingOpen.step(dt);
    const rWing = rightWingOpen.step(dt);
    const lTuft = leftTuftPerk.step(dt);
    const rTuft = rightTuftPerk.step(dt);

    /* Apply kinematics to 3D rig */
    owlRoot.position.x = bX;
    owlRoot.position.y = bY;
    owlRoot.rotation.y = bYaw;

    torsoMesh.scale.set(puff, 2.0 - puff, puff);

    headGroup.rotation.set(hPitch, hYaw, hRoll, 'YXZ');

    leftEye.eyeball.rotation.set(-ePitch, eYaw, 0, 'YXZ');
    rightEye.eyeball.rotation.set(-ePitch, eYaw, 0, 'YXZ');

    const { blink, squint } = computeBlinkAmount(timeSec, cycleT);
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

    leftFoot.position.y = -1.34 - Math.max(0, bY + 0.04) * 0.35 + leftFootLift;
    rightFoot.position.y = -1.34 - Math.max(0, bY + 0.04) * 0.35 + rightFootLift;

    /* Compute active sonar scan wave progress (-1 when idle, 0..1.25 when sweeping) */
    let scanWave = -1.0;
    const sinceManual = timeSec - manualScanStart;
    if (sinceManual >= 0 && sinceManual <= 1.35) {
      scanWave = sinceManual / 1.1;
    } else if (cycleT >= 5.75 && cycleT <= 7.25) {
      scanWave = (cycleT - 5.75) / 1.2;
    }

    /* Project Owl chest/head center to normalized canvas UV for radial sonar origin */
    owlProjected.set(bX, bY + 0.2, 0).project(camera);
    owlScreenPos.set(owlProjected.x * 0.5 + 0.5, owlProjected.y * 0.5 + 0.5);

    return { scanWave, owlScreenPos };
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
    dispose,
  };
}
