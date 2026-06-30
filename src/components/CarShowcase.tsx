"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  Environment,
  ContactShadows,
  Loader,
  AdaptiveDpr,
} from "@react-three/drei";
import * as THREE from "three";
import { useLocale } from "@/i18n/locale-context";

const MODEL_URL = "/models/zeekr_7x_2025.glb";

/** Rest pose: car sits in profile (side view). Flip sign / use 0 if your
 *  model's "front" faces a different axis. */
const REST_Y = Math.PI / 2;

/** How large the car renders. Bigger = fills more of the screen. */
const FIT = 6.4;

/** Scroll journey colours — starts on the site's own background (#08080a) and
 *  deepens toward the brand red, so the section blends with the rest of the site. */
const COLOR_STOPS = ["#08080a", "#13131a", "#3a1518", "#7f1d1d"];

/** Static car metadata for the showcase HUD (the hero model). */
const SHOWCASE = {
  brand: "Zeekr",
  model: "7X",
  subtitle: "All-electric flagship SUV",
  priceUsd: 62000,
  city: "Tashkent",
  year: 2025,
  mileageKm: 0,
  hp: 639,
};

/* ----------------------------- 3D model ----------------------------- */

function CarModel({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  // `true` enables the Draco decoder (no-op for an uncompressed glb).
  const { scene } = useGLTF(MODEL_URL, true);

  // Clone, strip the baked-in studio floor/podium, then measure: centre at
  // origin and normalise the diagonal so the car fills the frame regardless of
  // the source model's native units. Floor is removed BEFORE measuring so it
  // doesn't shrink the car in the bounding box.
  const { model, scale, center } = useMemo(() => {
    const cloned = scene.clone(true);
    const junk: THREE.Object3D[] = [];
    cloned.traverse((o) => {
      if (/carplane|floor/i.test(o.name)) junk.push(o);
    });
    junk.forEach((o) => o.removeFromParent());
    const box = new THREE.Box3().setFromObject(cloned);
    return {
      model: cloned,
      scale: FIT / box.getSize(new THREE.Vector3()).length(),
      center: box.getCenter(new THREE.Vector3()),
    };
  }, [scene]);

  useFrame((_, delta) => {
    if (!group.current) return;
    const p = progress.current;
    // Y: full 360° tumble bound to scroll, starting from the profile pose.
    const targetY = REST_Y + p * Math.PI * 2;
    // X: gentle tilt that peaks mid-scroll so the roof / top becomes visible.
    const targetX = Math.sin(p * Math.PI) * 0.5;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 4, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 4, delta);
  });

  return (
    <group ref={group} dispose={null}>
      <group scale={scale}>
        <primitive object={model} position={[-center.x, -center.y, -center.z]} />
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_URL);

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

function gradientAt(p: number): string {
  const c = colorAt(p);
  return `radial-gradient(130% 130% at 50% 30%, ${hexLerp(c, "#ffffff", 0.16)} 0%, ${c} 50%, ${hexLerp(
    c,
    "#000000",
    0.5
  )} 100%)`;
}

/* ------------------------------ section ------------------------------ */

export function CarShowcase() {
  const { t } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const idxRef = useRef<HTMLSpanElement>(null);
  const progress = useRef(0);
  // Active stage (0..3) — which of the 4 scroll positions the car is on. The
  // overlay text (sourced from the old <Hero/>) crossfades as this changes.
  const [stage, setStage] = useState(0);
  const stageRef = useRef(0);

  // 4 text blocks revealed across the 4 positions — the former Hero content.
  const slides = [
    { a: t.hero.title, b: t.hero.titleAccent, sub: t.hero.subtitle, eyebrow: t.hero.eyebrow },
    { a: "", b: t.hero.stat1, sub: t.hero.stat1l, eyebrow: "" },
    { a: "", b: t.hero.stat2, sub: t.hero.stat2l, eyebrow: "" },
    { a: "", b: t.hero.stat3, sub: t.hero.stat3l, eyebrow: "" },
  ];

  // Native page-scroll progress (0→1) for this section. Drives BOTH the DOM
  // (background colour + position index) and, via the shared ref, the 3D
  // rotation inside <useFrame>. Reversible and frame-synced through rAF.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = sectionRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const p = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
        progress.current = p;
        if (bgRef.current) bgRef.current.style.background = gradientAt(p);
        const stageIdx = Math.min(COLOR_STOPS.length - 1, Math.floor(p * COLOR_STOPS.length));
        if (idxRef.current) {
          idxRef.current.textContent = String(stageIdx + 1).padStart(2, "0");
        }
        if (stageIdx !== stageRef.current) {
          stageRef.current = stageIdx;
          setStage(stageIdx);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[320vh] w-full">
      {/* Pinned full-screen viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* scroll-driven colour layer (behind the transparent canvas) */}
        <div ref={bgRef} className="absolute inset-0" style={{ background: gradientAt(0) }} />
        <div className="pointer-events-none absolute inset-0 bg-black/10" />

        {/* 3D scene — alpha canvas, fills the whole viewport */}
        <Canvas
          className="!absolute inset-0"
          dpr={[1, 2]}
          gl={{ alpha: true, antialias: true }}
          camera={{ position: [0, 0.4, 6], fov: 42 }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 6]} intensity={2.4} />
          <directionalLight position={[-7, 4, -5]} intensity={1.1} />
          <Suspense fallback={null}>
            <Environment preset="studio" />
            <CarModel progress={progress} />
            <ContactShadows position={[0, -1.9, 0]} opacity={0.5} scale={16} blur={2.8} far={4.5} />
          </Suspense>
          <AdaptiveDpr pixelated />
        </Canvas>

        {/* ============================ HUD ============================ */}
        {/* (the global <Header /> renders on top — no separate top bar here) */}

        {/* centre top: changing Hero text — crossfades per scroll position */}
        <div className="pointer-events-none absolute inset-x-0 top-24 px-5 sm:top-28">
          <div className="relative mx-auto h-44 max-w-3xl text-center sm:h-48">
            {slides.map((s, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-all duration-700 ${
                  stage === i ? "opacity-100 blur-0 translate-y-0" : "pointer-events-none opacity-0 blur-[2px] translate-y-3"
                }`}
              >
                {s.eyebrow && (
                  <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {s.eyebrow}
                  </span>
                )}
                <h2 className="text-4xl font-semibold leading-[1.05] tracking-tight text-white drop-shadow sm:text-6xl">
                  {s.a && <span className="text-gradient">{s.a} </span>}
                  {s.b && <span className="text-accent">{s.b}</span>}
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm text-white/80 sm:text-base">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* top right: product identity + price */}
        <div className="pointer-events-none absolute right-5 top-20 text-right sm:right-10 sm:top-28">
          <p className="text-xs uppercase tracking-widest text-white/60">
            {SHOWCASE.brand} {SHOWCASE.model}
          </p>
          <p className="mt-1 text-2xl font-semibold text-white drop-shadow sm:text-3xl">
            ${SHOWCASE.priceUsd.toLocaleString("en-US")}
          </p>
          <p className="mt-1 text-sm text-white/80">{SHOWCASE.city}</p>
        </div>

        {/* persistent CTAs (from the old Hero) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-28 flex justify-center gap-3 sm:bottom-32">
          <Link
            href="/catalog"
            className="pointer-events-auto rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover glow-accent"
          >
            {t.hero.cta}
          </Link>
          <Link
            href="/contact"
            className="pointer-events-auto rounded-full border border-white/25 bg-black/20 px-6 py-3 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-black/40"
          >
            {t.hero.secondary}
          </Link>
        </div>

        {/* left: vertical arrows + position number */}
        <div className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 sm:left-10">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="opacity-70">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
          <span className="text-sm font-medium tracking-widest text-white">
            <span ref={idxRef}>01</span>
            <span className="text-white/50"> / 0{COLOR_STOPS.length}</span>
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="opacity-70">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>

        {/* bottom: spec row + full details */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-5 pb-8 sm:px-10">
          <div className="mx-auto flex max-w-5xl flex-wrap items-end justify-between gap-6 border-t border-white/20 pt-5">
            <dl className="flex flex-wrap gap-x-10 gap-y-3 text-white">
              <Spec label={t.car.year} value={String(SHOWCASE.year)} />
              <Spec label={t.car.mileage} value={`${SHOWCASE.mileageKm.toLocaleString("en-US")} km`} />
              <Spec label={t.car.power} value={`${SHOWCASE.hp} ${t.car.hp}`} />
            </dl>
            <a
              href="/catalog"
              className="pointer-events-auto text-sm font-medium text-white underline-offset-4 hover:underline"
            >
              {t.showcase.details} →
            </a>
          </div>
        </div>
      </div>

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
