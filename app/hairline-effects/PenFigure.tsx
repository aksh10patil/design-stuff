"use client";

import React, { useEffect, useRef, useCallback } from "react";

// Hairline isometric projection & vector math
const rad = (d: number) => (d * Math.PI) / 180;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const r2 = (n: number) => Math.round(n * 100) / 100;
const poly = (pts: number[][]) => "M" + pts.map((p) => r2(p[0]) + " " + r2(p[1])).join("L") + "Z";
const open = (pts: number[][]) => (pts.length < 2 ? "" : "M" + pts.map((p) => r2(p[0]) + " " + r2(p[1])).join("L"));
const seg = (a: number[], b: number[]) => `M${r2(a[0])} ${r2(a[1])}L${r2(b[0])} ${r2(b[1])}`;

function Cam(azDeg: number, k: number, S: number) {
  return { az: rad(azDeg), k, S, ox: 0, oy: 0 };
}

function proj(C: ReturnType<typeof Cam>) {
  const c = Math.cos(C.az),
    s = Math.sin(C.az),
    zf = Math.sqrt(1 - C.k * C.k);
  return (x: number, y: number, z: number): [number, number] => {
    const X = x * c - y * s,
      Y = x * s + y * c;
    return [C.ox + C.S * X, C.oy + C.S * (Y * C.k - z * zf)];
  };
}

function unproj(C: ReturnType<typeof Cam>, sx: number, sy: number, z: number): [number, number] {
  const c = Math.cos(C.az),
    s = Math.sin(C.az),
    zf = Math.sqrt(1 - C.k * C.k);
  const X = (sx - C.ox) / C.S,
    Y = ((sy - C.oy) / C.S + z * zf) / C.k;
  return [X * c + Y * s, -X * s + Y * c];
}

function fit(C: ReturnType<typeof Cam>, pts: number[][], cx: number, cy: number) {
  C.ox = 0;
  C.oy = 0;
  const P = proj(C);
  let a = 1e9,
    b = -1e9,
    c = 1e9,
    d = -1e9;
  for (const p of pts) {
    const q = P(p[0], p[1], p[2]);
    a = Math.min(a, q[0]);
    b = Math.max(b, q[0]);
    c = Math.min(c, q[1]);
    d = Math.max(d, q[1]);
  }
  C.ox = cx - (a + b) / 2;
  C.oy = cy - (c + d) / 2;
}

function hull(input: number[][]): number[][] {
  const pts = input.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: number[], a: number[], b: number[]) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: number[][] = [],
    up: number[][] = [];
  for (const p of pts) {
    while (lo.length > 1 && cross(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop();
    lo.push(p);
  }
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
    while (up.length > 1 && cross(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop();
    up.push(p);
  }
  lo.pop();
  up.pop();
  return lo.concat(up);
}

function rrect(u0: number, v0: number, u1: number, v1: number, r: number, n = 4) {
  r = Math.max(0, Math.min(r, (u1 - u0) / 2, (v1 - v0) / 2));
  const out: { u: number; v: number; nu: number; nv: number }[] = [];
  for (const [cu, cv, a0] of [
    [u1 - r, v1 - r, 0],
    [u0 + r, v1 - r, 90],
    [u0 + r, v0 + r, 180],
    [u1 - r, v0 + r, 270],
  ])
    for (let k = 0; k <= n; k++) {
      const a = rad(a0 + (90 * k) / n),
        ca = Math.cos(a),
        sa = Math.sin(a);
      out.push({ u: cu + r * ca, v: cv + r * sa, nu: ca, nv: sa });
    }
  return out;
}

const rings = (x0: number, y0: number, x1: number, y1: number, r: number, b: number) => [
  rrect(x0, y0, x1, y1, r),
  rrect(x0 + b, y0 + b, x1 - b, y1 - b, Math.max(0.3, r - b)),
];

const ringAt = (P: (x: number, y: number, z: number) => [number, number], ring: { u: number; v: number }[], z: number) =>
  ring.map((q) => P(q.u, q.v, z));

const facing = (C: ReturnType<typeof Cam>) => {
  const s = Math.sin(C.az),
    c = Math.cos(C.az);
  return (q: { nu: number; nv: number }) => q.nu * s + q.nv * c >= -1e-6;
};

function run<T>(ring: T[], keep: (item: T) => boolean): T[] {
  const n = ring.length;
  let s = -1;
  for (let i = 0; i < n; i++)
    if (keep(ring[i]) && !keep(ring[(i + n - 1) % n])) {
      s = i;
      break;
    }
  if (s < 0) return keep(ring[0]) ? ring.slice() : [];
  const out: T[] = [];
  for (let k = 0; k < n && keep(ring[(s + k) % n]); k++) out.push(ring[(s + k) % n]);
  return out;
}

function prism(
  P: (x: number, y: number, z: number) => [number, number],
  front: (q: { nu: number; nv: number }) => boolean,
  ring: { u: number; v: number; nu: number; nv: number }[],
  inner: { u: number; v: number; nu: number; nv: number }[] | null,
  z0: number,
  z1: number
) {
  return {
    sil: poly(hull(ringAt(P, ring, z1).concat(ringAt(P, ring, z0)))),
    crease: inner ? open(ringAt(P, run(inner, front), z1)) : "",
  };
}

function spring(x: number, o: { k?: number; c?: number; m?: number; eps?: number } = {}) {
  return { x, v: 0, t: x, k: o.k ?? 100, c: o.c ?? 18, m: o.m ?? 1, eps: o.eps ?? 0.01 };
}

function stepS(sp: ReturnType<typeof spring>, dt: number) {
  const n = Math.max(1, Math.ceil(dt * 240)),
    h = dt / n;
  for (let i = 0; i < n; i++) {
    const a = (-sp.k * (sp.x - sp.t) - sp.c * sp.v) / sp.m;
    sp.v += a * h;
    sp.x += sp.v * h;
  }
  if (Math.abs(sp.x - sp.t) < sp.eps && Math.abs(sp.v) < sp.eps * 10) {
    sp.x = sp.t;
    sp.v = 0;
    return false;
  }
  return true;
}

const N_PTS = 20;
function ringYZ(P: (x: number, y: number, z: number) => [number, number], x: number, r: number, y0 = 0, z0 = 14) {
  const pts: [number, number][] = [];
  for (let k = 0; k < N_PTS; k++) {
    const a = (k / N_PTS) * Math.PI * 2;
    pts.push(P(x, y0 + r * Math.cos(a), z0 + r * Math.sin(a)));
  }
  return pts;
}

const cyl = (
  P: (x: number, y: number, z: number) => [number, number],
  x0: number,
  r0: number,
  x1: number,
  r1: number
) => poly(hull(ringYZ(P, x0, r0).concat(ringYZ(P, x1, r1))));

function nibPoly(P: (x: number, y: number, z: number) => [number, number]) {
  const pts = [
    [42, 3.8, 15.2],
    [47, 4.8, 15.0],
    [52, 4.6, 14.6],
    [57, 3.0, 14.2],
    [61, 1.4, 13.8],
    [64.5, 0, 13.5],
    [61, -1.4, 13.8],
    [57, -3.0, 14.2],
    [52, -4.6, 14.6],
    [47, -4.8, 15.0],
    [42, -3.8, 15.2],
  ];
  return poly(pts.map((pt) => P(pt[0], pt[1], pt[2])));
}

export interface PenFigureProps {
  intensity?: number;
  theme?: "auto" | "light" | "dark";
  onRead?: (text: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function PenFigure({
  intensity = 0.5,
  theme = "auto",
  onRead,
  className,
  style,
}: PenFigureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onReadRef = useRef(onRead);
  const intensityRef = useRef(intensity);
  const setIntensityRef = useRef<((v: number) => void) | null>(null);

  useEffect(() => {
    onReadRef.current = onRead;
  }, [onRead]);

  useEffect(() => {
    intensityRef.current = intensity;
    // Map intensity 0..1 to range [25, 45, 65]
    const gapMax = intensity <= 0.5 ? 25 + (intensity / 0.5) * 20 : 45 + ((intensity - 0.5) / 0.5) * 20;
    setIntensityRef.current?.(gapMax);
  }, [intensity]);

  const mountEngine = useCallback((stage: HTMLElement) => {
    stage.replaceChildren();

    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 400 320");
    svg.setAttribute("aria-hidden", "true");
    stage.appendChild(svg);

    const mk = (tag: string, attrs: Record<string, string>, parent: Element) => {
      const e = document.createElementNS(NS, tag);
      for (const k in attrs) e.setAttribute(k, attrs[k]);
      parent.appendChild(e);
      return e;
    };

    const solid = (parent: Element) => {
      const g = mk("g", {}, parent);
      return { g, sil: mk("path", { class: "sil" }, g), cr: mk("path", { class: "nf lo" }, g) };
    };

    const put = (el: { sil: Element; cr: Element }, s: { sil: string; crease: string }) => {
      el.sil.setAttribute("d", s.sil);
      el.cr.setAttribute("d", s.crease);
    };

    const C = Cam(45, 0.5, 2.1);
    fit(
      C,
      [
        [-46, -20, -5],
        [130, 20, -5],
        [-46, 20, -5],
        [130, -20, -5],
        [-46, 0, 24],
        [130, 0, 24],
        [0, 0, 0],
      ],
      200,
      166
    );
    const P = proj(C),
      front = facing(C);

    const g = mk("g", {}, svg);

    // 1. Plinth stand and cradle supports
    const [pr, pi] = rings(-38, -17, 70, 17, 6, 2.0);
    put(solid(g), prism(P, front, pr, pi, -5, 0));

    for (const cx of [-22, 8]) {
      const [cr0, cr1] = rings(cx - 3.5, -8, cx + 3.5, 8, 2.2, 0.8);
      put(solid(g), prism(P, front, cr0, cr1, 0, 6.2));
    }

    // 2. Pen Barrel (fixed)
    const barrel = mk("g", {}, g);
    mk("path", { class: "sil", d: cyl(P, -46, 3.8, -42, 6.2) }, barrel);
    mk("path", { class: "sil", d: cyl(P, -42, 6.2, 18, 6.2) }, barrel);
    mk("path", { class: "nf lo", d: open(ringYZ(P, 18, 6.2)) }, barrel);
    mk("path", { class: "sil", d: cyl(P, 18, 6.4, 20, 6.4) }, barrel);
    mk("path", { class: "nf lo", d: open(ringYZ(P, 20, 6.4)) }, barrel);

    // 3. Grip Section (revealed)
    const grip = mk("g", {}, g);
    mk("path", { class: "sil", d: cyl(P, 20, 5.8, 23, 5.8) }, grip);
    for (const tx of [21, 22]) mk("path", { class: "nf lo", d: open(ringYZ(P, tx, 5.8)) }, grip);
    mk("path", { class: "sil", d: cyl(P, 23, 5.5, 38, 4.3) }, grip);
    mk("path", { class: "sil", d: cyl(P, 38, 4.3, 42, 4.7) }, grip);
    mk("path", { class: "nf lo", d: open(ringYZ(P, 42, 4.7)) }, grip);

    // 4. Feed & Nib
    const nibGroup = mk("g", {}, g);
    mk("path", { class: "sil", d: cyl(P, 42, 3.2, 55, 2.2) }, nibGroup);
    for (const fx of [45, 48, 51, 54]) mk("path", { class: "nf lo", d: open(ringYZ(P, fx, 3.0)) }, nibGroup);
    const nibBlade = mk("path", { class: "sil", d: nibPoly(P) }, nibGroup);
    const nibSlit = mk("path", { class: "nf", d: seg(P(53.2, 0, 14.6), P(64.5, 0, 13.5)) }, nibGroup);
    const breather = mk(
      "ellipse",
      {
        rx: String(r2(0.7 * C.S)),
        ry: String(r2(0.7 * C.S * C.k)),
        cx: String(r2(P(52.4, 0, 14.6)[0])),
        cy: String(r2(P(52.4, 0, 14.6)[1])),
        class: "dot m",
      },
      nibGroup
    );
    const tines = mk(
      "path",
      {
        class: "nf lo",
        d:
          open([P(44, 2.4, 15.0), P(50, 3.2, 14.7), P(58, 1.2, 14.1)]) +
          open([P(44, -2.4, 15.0), P(50, -3.2, 14.7), P(58, -1.2, 14.1)]),
      },
      nibGroup
    );

    // 5. Dynamic Cap
    const capGroup = mk("g", {}, g);
    const capBody = mk("path", { class: "sil" }, capGroup);
    const capCrown = mk("path", { class: "sil" }, capGroup);
    const capCrownCrease = mk("path", { class: "nf lo" }, capGroup);
    const capBand = mk("path", { class: "sil" }, capGroup);
    const capBandCrease = mk("path", { class: "nf lo" }, capGroup);
    const capMouth = mk("path", { class: "nf lo" }, capGroup);
    const clip = mk("path", { class: "sil hi" }, capGroup);
    const clipBall = mk(
      "ellipse",
      {
        rx: String(r2(0.9 * C.S)),
        ry: String(r2(0.9 * C.S * C.k)),
        class: "dot",
      },
      capGroup
    );

    let G_MAX = 45;
    const sp = spring(0, { k: 110, c: 19, m: 1 });
    let drawn = NaN;

    function drawCap(gap: number) {
      if (Math.abs(gap - drawn) < 0.04) return;
      drawn = gap;
      const c0 = 16 + gap,
        c1 = 64 + gap,
        c2 = 68 + gap;
      capBody.setAttribute("d", cyl(P, c0, 7.0, c1, 7.0));
      capCrown.setAttribute("d", cyl(P, c1, 7.0, c2, 4.5));
      capCrownCrease.setAttribute("d", poly(ringYZ(P, c2, 4.5)));
      capBand.setAttribute("d", cyl(P, c0 + 2, 7.15, c0 + 5, 7.15));
      capBandCrease.setAttribute("d", open(ringYZ(P, c0 + 2, 7.15)));
      capMouth.setAttribute("d", open(ringYZ(P, c0, 6.9)));

      const clPts = [
        P(c1 - 3, 0, 21.0),
        P(c1 - 5, 0, 22.8),
        P(c0 + 15, 0, 22.6),
        P(c0 + 13, 0, 21.6),
        P(c0 + 14, 0, 21.0),
      ];
      clip.setAttribute("d", open(clPts));
      const ptBall = P(c0 + 13.5, 0, 21.8);
      clipBall.setAttribute("cx", String(r2(ptBall[0])));
      clipBall.setAttribute("cy", String(r2(ptBall[1])));

      const isOpen = gap > 2.0;
      clip.classList.toggle("hi", !isOpen);
      clipBall.classList.toggle("m", isOpen);
      nibBlade.classList.toggle("hi", isOpen);
      nibSlit.classList.toggle("hi", isOpen);
      tines.classList.toggle("hi", isOpen);
    }

    drawCap(0);

    let rafId = 0;
    let lastTime = performance.now();
    let isAwake = true;

    function loop(now: number) {
      const dt = Math.min(0.05, Math.max(0, (now - lastTime) / 1000));
      lastTime = now;
      const moving = stepS(sp, dt);
      drawCap(sp.x);
      if (moving || isAwake) {
        rafId = requestAnimationFrame(loop);
      } else {
        rafId = 0;
      }
    }

    function wake() {
      if (!rafId) {
        lastTime = performance.now();
        isAwake = true;
        rafId = requestAnimationFrame(loop);
      }
    }

    rafId = requestAnimationFrame(loop);

    let over: [number, number] | null = null;

    function hitTest([wx, wy]: [number, number]) {
      if (Math.abs(wy) > 36 || wx < -65 || wx > 125) return null;
      if (wx < -36) return "finial";
      if (wx < 18) return "barrel";
      if (sp.t > 15) {
        if (wx < 42) return "grip";
        if (wx < 65) return "nib";
        return "cap";
      }
      return "cap";
    }

    function retarget() {
      if (!over) {
        sp.t = 0;
        onReadRef.current?.("rest");
      } else {
        const part = hitTest(over);
        if (!part) {
          sp.t = 0;
          onReadRef.current?.("rest");
        } else {
          const t = clamp((over[0] - -10) / 85, 0, 1);
          sp.t = G_MAX * Math.max(0.18, t);
          onReadRef.current?.(part);
        }
      }
      wake();
    }

    const onPointerMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      const sx = ((e.clientX - r.left) / r.width) * 400;
      const sy = ((e.clientY - r.top) / r.height) * 320;
      over = unproj(C, sx, sy, 0);
      retarget();
    };

    const onPointerLeave = () => {
      over = null;
      retarget();
    };

    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerleave", onPointerLeave);

    setIntensityRef.current = (v: number) => {
      G_MAX = v;
      if (over) retarget();
    };

    onReadRef.current?.("rest");

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerleave", onPointerLeave);
      stage.replaceChildren();
    };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const cleanup = mountEngine(el);
    return () => {
      cleanup();
    };
  }, [mountEngine]);

  return (
    <div
      ref={containerRef}
      data-hairline="pen"
      data-hairline-theme={theme}
      role="img"
      aria-label="A fountain pen on a rest whose cap glides open along its axis"
      className={className}
      style={{
        aspectRatio: "5 / 4",
        position: "relative",
        userSelect: "none",
        ...style,
      }}
    />
  );
}
