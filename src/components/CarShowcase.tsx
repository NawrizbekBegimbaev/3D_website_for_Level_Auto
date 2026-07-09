"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import Link from "next/link";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useGLTF,
  Environment,
  ContactShadows,
  Loader,
  AdaptiveDpr,
} from "@react-three/drei";
import * as THREE from "three";
import { PHONES, SOCIALS, telHref } from "@/data/contacts";
import { getCar } from "@/data/cars";
import { formatMoney, formatYears } from "@/lib/format";
import { useLocale } from "@/i18n/locale-context";
import { ContactForm } from "./ContactForm";
import { Logo } from "./Logo";

const MODEL_URL = "/models/zeekr_7x_2025_v4.glb";

/** GLB material names to force near-black (murdered-out look): tires, the
 *  rims / discs and the red trim + light bar. Names are the model's own. */
const BLACKEN = new Set([
  "luntai", // tires
  "lungujinshu", // rim metal
  "lunguhei", // rim black
  "lunguhei2", // rim (reddish) trim
  "lunguluosi", // wheel bolts
  "deng_red", // red light bar / trim
  "deng_red2",
  "moshahei", // lower sill / body cladding — named "matte black" but ships untinted (renders grey)
  "fanguangjin", // bright chrome side moulding
]);

/** Rest pose: car sits in profile (side view). Flip sign / use 0 if your
 *  model's "front" faces a different axis. */
const REST_Y = Math.PI / 2;

/** How large the car renders. Bigger = fills more of the screen. */
const FIT = 6.4;

/** Final two stages ("contact" + "footer"): the car stops tumbling, turns to
 *  face the camera, slides into the LEFT half and moves closer — freeing the
 *  right half first for the request form, then for the footer. `focus` ramps
 *  0→1 as we enter those stages and holds to the end. */
const FRONT_Y = Math.PI; // contact stage: faces the camera (flip to 0 if the rear shows)
const REAR_Y = FRONT_Y + Math.PI; // footer stage: same pose but rear turned to us
const FOCUS_LEFT_X = -2.1; // shift into the left half
const FOCUS_ZOOM = 1.5; // how much closer / bigger the car gets when focused

/** Scroll journey colours — starts on the site's own background (#08080a) and
 *  deepens toward the brand red, which then holds across the contact + footer
 *  stages so the car keeps the same lit backdrop through to the end. */
const COLOR_STOPS = ["#08080a", "#13131a", "#3a1518", "#7f1d1d", "#7f1d1d"];

/** Витрина показывает ту же машину, что и каталог — данные берём из прайса,
 *  а не дублируем руками (раньше здесь висели выдуманные 639 л.с. и $62 000). */
const SHOWCASE_CAR = getCar("zeekr-7x-full")!;
const SHOWCASE_CITY = "Tashkent";

/* Shared positions for the text that surrounds the car per scroll stage. */
const HEADING_WRAP = "absolute inset-x-0 top-24 px-5 text-center sm:top-28";
// Floating corner cards are desktop-only; on mobile the stage content is
// collapsed into a single bottom panel (see the `sm:hidden` blocks per stage).
const POS_TL = "absolute left-5 top-44 hidden sm:left-10 sm:top-52 sm:block";
const POS_TR = "absolute right-5 top-44 hidden sm:right-10 sm:top-52 sm:block";
// Left rail keeps its middle free: the scroll arrows + position index live there.
const POS_BL = "absolute left-5 bottom-28 hidden sm:left-10 sm:bottom-32 sm:block";
const POS_MR = "absolute right-5 top-1/2 hidden -translate-y-1/2 sm:right-10 sm:block";
const POS_BR = "absolute right-5 bottom-28 hidden sm:right-10 sm:bottom-32 sm:block";
const CTA_PRIMARY =
  "pointer-events-auto rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:scale-[1.03] hover:bg-accent-hover active:scale-95 glow-accent";

/* ----------------------------- 3D model ----------------------------- */

function CarModel({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  // meshopt-compressed geometry (5.6 MB vs 30 MB). drei bundles the meshopt
  // decoder locally — no CDN — so it loads reliably on mobile too. (draco off)
  const { scene } = useGLTF(MODEL_URL, false, true);

  // Clone, strip the baked-in studio floor/podium, then measure: centre at
  // origin and normalise the diagonal so the car fills the frame regardless of
  // the source model's native units. Floor is removed BEFORE measuring so it
  // doesn't shrink the car in the bounding box.
  const { model, scale, center } = useMemo(() => {
    const cloned = scene.clone(true);
    const junk: THREE.Object3D[] = [];
    // Recolor targeted materials to black. Clone the material first so the
    // shared/cached GLTF material (reused elsewhere) is never mutated.
    const blacken = (m: THREE.Material) => {
      if (!m || !BLACKEN.has(m.name)) return m;
      const c = m.clone() as THREE.MeshStandardMaterial;
      c.color?.setRGB(0.02, 0.02, 0.02);
      c.emissive?.setRGB(0, 0, 0);
      // Tires ship with a grey tread texture and catch grey studio reflections.
      // Force a true matte black: drop the base texture and mute the env map.
      if (m.name === "luntai") {
        c.map = null;
        c.color?.setRGB(0, 0, 0);
        c.roughness = 1;
        c.metalness = 0;
        c.envMapIntensity = 0.1;
        c.needsUpdate = true;
      }
      return c;
    };
    cloned.traverse((o) => {
      if (/carplane|floor/i.test(o.name)) {
        junk.push(o);
        return;
      }
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map(blacken)
        : blacken(mesh.material);
    });
    junk.forEach((o) => o.removeFromParent());
    const box = new THREE.Box3().setFromObject(cloned);
    return {
      model: cloned,
      scale: FIT / box.getSize(new THREE.Vector3()).length(),
      center: box.getCenter(new THREE.Vector3()),
    };
  }, [scene]);

  // Shrink the car on narrow / portrait screens so the whole body stays in
  // frame. On wide desktop viewports the factor clamps to 1 (no change).
  const { size, invalidate } = useThree();
  const isMobile = size.width < 640;
  const fitFactor = Math.min(1, (size.width / size.height) * 0.85);
  // On desktop the contact/footer stages slide the car into the left half
  // (form on the right). On mobile the panel is full-width, so keep the car
  // centred — otherwise it slides off the left edge.
  const focusLeftX = isMobile ? 0 : FOCUS_LEFT_X;

  // The canvas runs in `frameloop="demand"`, so a frame only happens when
  // something asks for one. Kick one off once the GLB is in and on resize —
  // otherwise the first (and post-resize) frame would never be drawn.
  useEffect(() => {
    invalidate();
  }, [invalidate, model, size.width, size.height]);

  useFrame((_, delta) => {
    if (!group.current) return;
    const g = group.current;
    const p = progress.current;
    // focus: 0 during the tumble, ramps to 1 as we reach the contact stage and
    // holds through the footer stage — same left/zoom hero pose for both.
    const focus = THREE.MathUtils.smoothstep(p, 0.58, 0.68);
    // rear: on the footer stage the car keeps that pose but turns its back to us
    // (settled by ~0.9, the footer snap anchor).
    const rear = THREE.MathUtils.smoothstep(p, 0.8, 0.9);
    // Y: full 360° tumble, turned to the front (contact) then round to the rear.
    const tumbleY = REST_Y + p * Math.PI * 2;
    let targetY = THREE.MathUtils.lerp(tumbleY, FRONT_Y, focus);
    targetY = THREE.MathUtils.lerp(targetY, REAR_Y, rear);
    // X: gentle tilt that peaks mid-scroll; flattens as the car faces us.
    const targetX = Math.sin(p * Math.PI) * 0.5 * (1 - focus);
    // Slide into the left half and move closer, freeing the right half
    // (desktop only — centred on mobile).
    const targetPosX = focusLeftX * focus;
    const targetScale = 1 + (FOCUS_ZOOM - 1) * focus;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 4, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 4, delta);
    g.position.x = THREE.MathUtils.damp(g.position.x, targetPosX, 4, delta);
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, targetScale, 4, delta));

    // Damping is asymptotic: keep asking for frames until the pose has visually
    // caught up with the target, then let the loop go quiet. Scrolling wakes it
    // again from the progress ticker.
    const settled =
      Math.abs(g.rotation.y - targetY) < 1e-3 &&
      Math.abs(g.rotation.x - targetX) < 1e-3 &&
      Math.abs(g.position.x - targetPosX) < 1e-3 &&
      Math.abs(g.scale.x - targetScale) < 1e-3;
    if (!settled) invalidate();
  });

  return (
    <group ref={group} dispose={null}>
      <group scale={scale * fitFactor}>
        <primitive object={model} position={[-center.x, -center.y, -center.z]} />
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_URL, false, true);

/* --------------------------- colour helpers --------------------------- */

function hexLerp(a: string, b: string, t: number): string {
  const ca = parseInt(a.slice(1), 16);
  const cb = parseInt(b.slice(1), 16);
  const ar = (ca >> 16) & 255, ag = (ca >> 8) & 255, ab = ca & 255;
  const br = (cb >> 16) & 255, bg = (cb >> 8) & 255, bb = cb & 255;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1);
}

function colorAt(p: number): string {
  const n = COLOR_STOPS.length - 1;
  const x = Math.min(Math.max(p, 0), 1) * n;
  const i = Math.min(Math.floor(x), n - 1);
  return hexLerp(COLOR_STOPS[i], COLOR_STOPS[i + 1], x - i);
}

/** The vignette that used to be baked into a per-frame radial-gradient string.
 *  Alpha compositing over a solid fill *is* a lerp, so painting this once on a
 *  static layer above a plain background-colour is pixel-identical to
 *  recomputing `radial-gradient(… lerp(c,white,.16) … c … lerp(c,black,.5))`
 *  every frame — minus the full-screen gradient rasterisation. */
const VIGNETTE =
  "radial-gradient(130% 130% at 50% 30%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.5) 100%)";

/* ------------------------------ section ------------------------------ */

export function CarShowcase() {
  const { t, locale } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const idxRef = useRef<HTMLSpanElement>(null);
  const progress = useRef(0);
  /** R3F's `invalidate` — requests exactly one frame from the demand loop. */
  const invalidateRef = useRef<(() => void) | null>(null);
  // Active stage (0..3) — which of the 4 scroll positions the car is on. The
  // overlay text (sourced from the old <Hero/>) crossfades as this changes.
  const [stage, setStage] = useState(0);
  const stageRef = useRef(0);

  // Content that surrounds the car across the 4 scroll stages:
  // 01 intro · 02 why LevelAuto · 03 stats · 04 contact.
  const reasons = [
    { t: t.about.p1t, b: t.about.p1b },
    { t: t.about.p2t, b: t.about.p2b },
    { t: t.about.p3t, b: t.about.p3b },
    { t: t.about.p4t, b: t.about.p4b },
    { t: t.about.p5t, b: t.about.p5b },
  ];
  const stats = [
    { v: t.hero.stat1, l: t.hero.stat1l },
    { v: t.hero.stat2, l: t.hero.stat2l },
    { v: t.hero.stat3, l: t.hero.stat3l },
  ];

  // Native page-scroll progress (0→1) for this section. Drives BOTH the DOM
  // (background colour + position index) and, via the shared ref, the 3D
  // rotation inside <useFrame>. Reversible and frame-synced through rAF.
  //
  // Everything below is guarded on "did it actually change": when the user is
  // not scrolling this loop touches no styles and requests no WebGL frame, so
  // an idle showcase costs nothing beyond the rAF callback itself.
  useEffect(() => {
    let raf = 0;
    let lastP = -1;
    let lastColor = "";
    const tick = () => {
      const el = sectionRef.current;
      if (el && !document.hidden) {
        const rect = el.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const p = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
        if (Math.abs(p - lastP) > 1e-4) {
          lastP = p;
          progress.current = p;
          invalidateRef.current?.();

          const color = colorAt(p);
          if (bgRef.current && color !== lastColor) {
            lastColor = color;
            bgRef.current.style.backgroundColor = color;
          }
          const stageIdx = Math.min(COLOR_STOPS.length - 1, Math.floor(p * COLOR_STOPS.length));
          if (idxRef.current) {
            idxRef.current.textContent = String(stageIdx + 1).padStart(2, "0");
          }
          if (stageIdx !== stageRef.current) {
            stageRef.current = stageIdx;
            setStage(stageIdx);
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[400vh] w-full">
      {/* Pinned full-screen viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* scroll-driven colour layer (behind the transparent canvas) — a plain
            background-colour repaint; the vignette above it never changes. */}
        <div ref={bgRef} className="absolute inset-0" style={{ backgroundColor: colorAt(0) }} />
        <div className="pointer-events-none absolute inset-0" style={{ background: VIGNETTE }} />
        <div className="pointer-events-none absolute inset-0 bg-black/10" />

        {/* 3D scene — alpha canvas, fills the whole viewport. `demand` frameloop:
            frames are drawn only while the car is moving (see CarModel) or the
            scroll ticker asks for one — an idle showcase renders nothing. */}
        <Canvas
          className="!absolute inset-0"
          frameloop="demand"
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true }}
          camera={{ position: [0, 0.4, 6], fov: 42 }}
          onCreated={({ invalidate }) => {
            invalidateRef.current = invalidate;
          }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 6]} intensity={2.4} />
          <directionalLight position={[-7, 4, -5]} intensity={1.1} />
          <Suspense fallback={null}>
            {/* Local studio HDRI (same asset drei's "studio" preset uses) —
                served from our own CDN, no external dependency. */}
            <Environment files="/hdri/studio.hdr" />
            <CarModel progress={progress} />
            <ContactShadows
              position={[0, -1.9, 0]}
              opacity={0.5}
              scale={16}
              blur={2.8}
              far={4.5}
              resolution={256}
            />
          </Suspense>
          <AdaptiveDpr pixelated />
        </Canvas>

        {/* ============================ HUD ============================ */}
        {/* (the global <Header /> renders on top — no separate top bar here) */}

        {/* Text that surrounds the car — one layer per scroll stage, crossfaded. */}
        <div className="pointer-events-none absolute inset-0">
          {/* 01 — intro */}
          <Stage active={stage === 0}>
            <div className={HEADING_WRAP}>
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {t.hero.eyebrow}
              </span>
              <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-[1.02] tracking-tight text-white drop-shadow sm:text-6xl">
                <span className="text-gradient">{t.hero.title} </span>
                <span className="text-accent">{t.hero.titleAccent}</span>
              </h1>
              <p className="mx-auto mt-3 max-w-xl text-sm text-white/80 sm:text-base">{t.hero.subtitle}</p>
            </div>
            <div className="absolute right-5 top-44 hidden text-right sm:right-10 sm:top-52 sm:block">
              <p className="text-2xl font-semibold text-white drop-shadow sm:text-3xl">
                {SHOWCASE_CAR.brand} {SHOWCASE_CAR.model}
              </p>
              <p className="mt-1 text-base text-white/80 sm:text-lg">{SHOWCASE_CITY}</p>
              <p className="mt-1 text-lg font-medium text-white sm:text-xl">
                {formatMoney(SHOWCASE_CAR.price, SHOWCASE_CAR.currency, t.car.uzs)}
              </p>
            </div>
          </Stage>

          {/* 02 — why LevelAuto: three reasons around the car */}
          <Stage active={stage === 1}>
            <div className={HEADING_WRAP}>
              <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow sm:text-5xl">
                <span className="text-gradient">{t.about.title}</span>
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-white/80 sm:text-base">{t.about.body}</p>
            </div>
            {/* Five cards ring the car: two down the left rail, three down the
                right. The left rail's middle stays clear for the scroll index. */}
            <InfoCard className={POS_TL} index="01" title={reasons[0].t} body={reasons[0].b} />
            <InfoCard className={POS_TR} index="02" title={reasons[1].t} body={reasons[1].b} />
            <InfoCard className={POS_BL} index="03" title={reasons[2].t} body={reasons[2].b} />
            <InfoCard className={POS_MR} index="04" title={reasons[3].t} body={reasons[3].b} />
            <InfoCard className={POS_BR} index="05" title={reasons[4].t} body={reasons[4].b} />
            {/* mobile: one compact panel instead of floating cards */}
            <div className="absolute inset-x-4 bottom-24 rounded-2xl border border-white/15 bg-black/55 p-3.5 backdrop-blur-md sm:hidden">
              <ul className="space-y-2">
                {reasons.map((r, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-xs font-semibold text-accent">0{i + 1}</span>
                    <div>
                      <p className="text-sm font-semibold leading-tight text-white">{r.t}</p>
                      <p className="mt-0.5 text-[11px] leading-snug text-white/70">{r.b}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Stage>

          {/* 03 — stats */}
          <Stage active={stage === 2}>
            <div className={HEADING_WRAP}>
              <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow sm:text-5xl">
                <span className="text-gradient">{t.showcase.statsTitle}</span>
              </h2>
            </div>
            <StatCard className={POS_TL} value={stats[0].v} label={stats[0].l} />
            <StatCard className={POS_TR} value={stats[1].v} label={stats[1].l} />
            <StatCard className={POS_BR} value={stats[2].v} label={stats[2].l} />
            {/* mobile: three stats in a compact bottom row */}
            <div className="absolute inset-x-4 bottom-24 grid grid-cols-3 gap-2 sm:hidden">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/15 bg-black/55 p-3 text-center backdrop-blur-md"
                >
                  <p className="font-display text-2xl font-semibold text-accent">{s.v}</p>
                  <p className="mt-0.5 text-[11px] leading-tight text-white/80">{s.l}</p>
                </div>
              ))}
            </div>
          </Stage>

          {/* 04 — contact: car faces the camera on the left, request form on the right */}
          <Stage active={stage === 3}>
            <div className="pointer-events-auto absolute inset-y-0 right-0 flex w-full items-center justify-center bg-black/30 px-5 py-24 backdrop-blur-sm sm:w-1/2 sm:bg-transparent sm:px-10 sm:backdrop-blur-none">
              <div className="w-full max-w-md">
                <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow sm:text-4xl">
                  <span className="text-gradient">{t.contact.title}</span>
                </h2>
                <p className="mt-2 text-sm text-white/80 sm:text-base">{t.contact.subtitle}</p>
                <div className="mt-5 rounded-3xl border border-white/15 bg-black/55 p-5 backdrop-blur-md sm:p-6">
                  <ContactForm />
                </div>
              </div>
            </div>
          </Stage>

          {/* 05 — footer: same car pose as the contact stage, footer info on the right */}
          <Stage active={stage === 4}>
            <div className="pointer-events-auto absolute inset-y-0 right-0 flex w-full items-center justify-center bg-black/30 px-5 py-24 backdrop-blur-sm sm:w-1/2 sm:bg-transparent sm:px-10 sm:backdrop-blur-none">
              <div className="w-full max-w-md">
                <Logo className="h-12 w-auto" />
                <p className="mt-3 max-w-xs text-sm text-white/70">{t.footer.tagline}</p>

                <div className="mt-8 space-y-2 text-sm">
                  <p className="font-medium text-white">{t.nav.contact}</p>
                  <p className="text-white/70">{t.footer.address}</p>
                  {PHONES.map((phone) => (
                    <a key={phone} href={telHref(phone)} className="block text-white/70 hover:text-white">
                      {phone}
                    </a>
                  ))}
                </div>

                <div className="mt-6 space-y-2 text-sm">
                  <p className="font-medium text-white">{t.footer.social}</p>
                  {SOCIALS.map((s) => (
                    <a
                      key={s.name}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-white/70 hover:text-white"
                    >
                      {s.name} · {s.handle}
                    </a>
                  ))}
                </div>

                <div className="mt-8 flex flex-col gap-1 border-t border-white/15 pt-4 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
                  <span>© {new Date().getFullYear()} LevelAuto. {t.footer.rights}</span>
                  <span>Tashkent · Uzbekistan</span>
                </div>
              </div>
            </div>
          </Stage>
        </div>

        {/* persistent CTA — under the car on desktop; on mobile hidden on the
            form/footer stages where a full-width panel already owns the screen */}
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-6 px-5 transition-all duration-700 sm:bottom-32 sm:px-10 ${
            stage >= 3 ? "hidden justify-start sm:flex" : "flex justify-center"
          }`}
        >
          <Link href="/catalog" className={CTA_PRIMARY}>{t.hero.cta}</Link>
        </div>

        {/* left: vertical arrows + position number (hidden on mobile for the
            form/footer stages, where it would sit over the panel text) */}
        <div
          className={`pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 flex-col items-center gap-3 sm:left-10 sm:flex ${
            stage >= 3 ? "hidden" : "flex"
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="opacity-70">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
          <span className="text-sm font-medium tracking-widest text-white">
            <span ref={idxRef}>01</span>
            <span className="text-white/70"> / 0{COLOR_STOPS.length}</span>
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="opacity-70">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>

        {/* bottom: spec row — desktop only (on mobile it collides with the CTA) */}
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 hidden px-5 pb-8 transition-opacity duration-700 sm:block sm:px-10 ${
            stage >= 3 ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="mx-auto flex max-w-5xl flex-wrap items-end justify-between gap-6 border-t border-white/20 pt-5">
            <dl className="flex flex-wrap gap-x-10 gap-y-3 text-white">
              <Spec
                label={t.car.warranty}
                value={formatYears(SHOWCASE_CAR.warrantyYears, locale, t.car.years)}
              />
              <Spec label={t.car.offer} value={t.offers[SHOWCASE_CAR.offer]} />
            </dl>
          </div>
        </div>
      </div>

      {/* Scroll-snap anchors — one per stage, placed at the frame where each
          stage reads best (intro at the top, contact once the car is front-left,
          footer once it has turned its rear). Travel = 400vh − 100vh = 300vh. */}
      {[0, 90, 150, 216, 276].map((top, i) => (
        <div
          key={i}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 h-px"
          style={{ top: `${top}vh`, scrollSnapAlign: "start" }}
        />
      ))}

      {/* DOM overlay loader for the heavy GLB (reads Suspense progress) */}
      <Loader
        containerStyles={{ background: "rgba(8,8,10,0.9)" }}
        barStyles={{ background: "#ffffff" }}
        dataStyles={{ color: "#f4f4f5", fontSize: "13px" }}
      />
    </section>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-widest text-white/60">{label}</dt>
      <dd className="mt-0.5 text-lg font-medium">{value}</dd>
    </div>
  );
}

/** One crossfading layer of surrounding text, shown when its stage is active.
 *
 *  Inactive layers flip to `visibility: hidden` once the fade finishes, which
 *  drops them (and the `backdrop-blur` cards they contain) out of paint and
 *  compositing entirely. Without it, four full-screen blurred layers would be
 *  recomposited on every frame the background colour changes. */
function Stage({ active, children }: { active: boolean; children: ReactNode }) {
  return (
    <div
      className={`absolute inset-0 transition-opacity duration-700 ${
        active ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      style={{
        visibility: active ? "visible" : "hidden",
        transitionProperty: "opacity, visibility",
        transitionDelay: active ? "0ms" : "0ms, 700ms",
      }}
    >
      {children}
    </div>
  );
}

/** Readable annotation chip placed around the car (why-LevelAuto reasons). */
function InfoCard({
  index,
  title,
  body,
  className = "",
}: {
  index: string;
  title: string;
  body: string;
  className?: string;
}) {
  return (
    <div className={`w-[min(46vw,260px)] rounded-2xl border border-white/15 bg-black/45 p-4 backdrop-blur-md ${className}`}>
      <span className="text-[11px] font-semibold uppercase tracking-widest text-accent">{index}</span>
      <h3 className="mt-1 text-base font-semibold text-white sm:text-lg">{title}</h3>
      <p className="mt-1 text-xs text-white/75 sm:text-sm">{body}</p>
    </div>
  );
}

/** Big-number stat chip placed around the car. */
function StatCard({ value, label, className = "" }: { value: string; label: string; className?: string }) {
  return (
    <div className={`w-[min(42vw,220px)] rounded-2xl border border-white/15 bg-black/45 p-4 text-center backdrop-blur-md ${className}`}>
      <p className="font-display text-4xl font-semibold text-accent sm:text-5xl">{value}</p>
      <p className="mt-1 text-xs text-white/80 sm:text-sm">{label}</p>
    </div>
  );
}
