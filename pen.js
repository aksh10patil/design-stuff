/**
 * Pen: a fountain pen on a desk rest. Moving across draws the cap open along
 * its axis on a spring, revealing the polished grip section, feed and nib.
 * The slider sets how far the cap opens.
 */
const {
  Cam, clamp, disposer, facing, fit, flatDot, hull, mk, open, place, pointer,
  poly, prism, proj, rad, reflect, register, rings, rrect, seg, solid, put,
  spring, stepS, unproj,
} = HL;

const N_PTS = 20;

/** Samples a circle in the Y-Z plane at position x. */
function ringYZ(P, x, r, y0 = 0, z0 = 14) {
  const pts = [];
  for (let k = 0; k < N_PTS; k++) {
    const a = (k / N_PTS) * Math.PI * 2;
    pts.push(P(x, y0 + r * Math.cos(a), z0 + r * Math.sin(a)));
  }
  return pts;
}

/** Convex hull silhouette of a cylinder between two rings. */
const cyl = (P, x0, r0, x1, r1) => poly(hull(ringYZ(P, x0, r0).concat(ringYZ(P, x1, r1))));

/** Top blade polygon of a classic fountain pen nib. */
function nibPoly(P) {
  const pts = [
    [42, 3.8, 15.2], [47, 4.8, 15.0], [52, 4.6, 14.6], [57, 3.0, 14.2], [61, 1.4, 13.8], [64.5, 0, 13.5],
    [61, -1.4, 13.8], [57, -3.0, 14.2], [52, -4.6, 14.6], [47, -4.8, 15.0], [42, -3.8, 15.2],
  ];
  return poly(pts.map((pt) => P(pt[0], pt[1], pt[2])));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let G_MAX = value;

  const C = Cam(45, 0.5, 2.10);
  fit(C, [
    [-46, -20, -5], [130, 20, -5], [-46, 20, -5], [130, -20, -5],
    [-46, 0, 24], [130, 0, 24], [0, 0, 0],
  ], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);

  // 1. Plinth stand and reflection
  const [pr, pi] = rings(-38, -17, 70, 17, 6, 2.0);
  reflect(svg, g, P, front, pr, -5, 12);
  put(solid(g), prism(P, front, pr, pi, -5, 0));

  // Cradle supports for the resting barrel
  for (const cx of [-22, 8]) {
    const [cr0, cr1] = rings(cx - 3.5, -8, cx + 3.5, 8, 2.2, 0.8);
    put(solid(g), prism(P, front, cr0, cr1, 0, 6.2));
  }

  // 2. Pen Barrel (fixed on the rest)
  const barrel = mk("g", {}, g);
  mk("path", { class: "sil", d: cyl(P, -46, 3.8, -42, 6.2) }, barrel);
  mk("path", { class: "sil", d: cyl(P, -42, 6.2, 18, 6.2) }, barrel);
  mk("path", { class: "nf lo", d: open(ringYZ(P, 18, 6.2)) }, barrel);
  mk("path", { class: "sil", d: cyl(P, 18, 6.4, 20, 6.4) }, barrel);
  mk("path", { class: "nf lo", d: open(ringYZ(P, 20, 6.4)) }, barrel);

  // 3. Grip Section (revealed as cap opens)
  const grip = mk("g", {}, g);
  mk("path", { class: "sil", d: cyl(P, 20, 5.8, 23, 5.8) }, grip);
  for (const tx of [21, 22]) mk("path", { class: "nf lo", d: open(ringYZ(P, tx, 5.8)) }, grip);
  mk("path", { class: "sil", d: cyl(P, 23, 5.5, 38, 4.3) }, grip);
  mk("path", { class: "sil", d: cyl(P, 38, 4.3, 42, 4.7) }, grip);
  mk("path", { class: "nf lo", d: open(ringYZ(P, 42, 4.7)) }, grip);

  // 4. Feed and Fountain Pen Nib
  const nibGroup = mk("g", {}, g);
  mk("path", { class: "sil", d: cyl(P, 42, 3.2, 55, 2.2) }, nibGroup);
  for (const fx of [45, 48, 51, 54]) mk("path", { class: "nf lo", d: open(ringYZ(P, fx, 3.0)) }, nibGroup);
  const nibBlade = mk("path", { class: "sil", d: nibPoly(P) }, nibGroup);
  const nibSlit = mk("path", { class: "nf", d: seg(P(53.2, 0, 14.6), P(64.5, 0, 13.5)) }, nibGroup);
  const breather = flatDot(nibGroup, C, 0.7, "dot m");
  place(breather, P(52.4, 0, 14.6));
  const tines = mk("path", {
    class: "nf lo",
    d: open([P(44, 2.4, 15.0), P(50, 3.2, 14.7), P(58, 1.2, 14.1)]) +
       open([P(44, -2.4, 15.0), P(50, -3.2, 14.7), P(58, -1.2, 14.1)]),
  }, nibGroup);

  // 5. The Cap (moves along X on a spring)
  const capGroup = mk("g", {}, g);
  const capBody = mk("path", { class: "sil" }, capGroup);
  const capCrown = mk("path", { class: "sil" }, capGroup);
  const capCrownCrease = mk("path", { class: "nf lo" }, capGroup);
  const capBand = mk("path", { class: "sil" }, capGroup);
  const capBandCrease = mk("path", { class: "nf lo" }, capGroup);
  const capMouth = mk("path", { class: "nf lo" }, capGroup);
  const clip = mk("path", { class: "sil hi" }, capGroup);
  const clipBall = flatDot(capGroup, C, 0.9, "dot");

  const sp = spring(0, { k: 110, c: 19, m: 1 });
  let drawn = NaN;

  function drawCap(gap) {
    if (Math.abs(gap - drawn) < 0.04) return;
    drawn = gap;
    const c0 = 16 + gap, c1 = 64 + gap, c2 = 68 + gap;
    capBody.setAttribute("d", cyl(P, c0, 7.0, c1, 7.0));
    capCrown.setAttribute("d", cyl(P, c1, 7.0, c2, 4.5));
    capCrownCrease.setAttribute("d", poly(ringYZ(P, c2, 4.5)));
    capBand.setAttribute("d", cyl(P, c0 + 2, 7.15, c0 + 5, 7.15));
    capBandCrease.setAttribute("d", open(ringYZ(P, c0 + 2, 7.15)));
    capMouth.setAttribute("d", open(ringYZ(P, c0, 6.9)));

    const clPts = [
      P(c1 - 3, 0, 21.0), P(c1 - 5, 0, 22.8), P(c0 + 15, 0, 22.6),
      P(c0 + 13, 0, 21.6), P(c0 + 14, 0, 21.0),
    ];
    clip.setAttribute("d", open(clPts));
    place(clipBall, P(c0 + 13.5, 0, 21.8));

    const isOpen = gap > 2.0;
    clip.classList.toggle("hi", !isOpen);
    clipBall.classList.toggle("m", isOpen);
    nibBlade.classList.toggle("hi", isOpen);
    nibSlit.classList.toggle("hi", isOpen);
    tines.classList.toggle("hi", isOpen);
  }

  drawCap(0);

  const B = register(stage, (dt) => {
    const moving = stepS(sp, dt);
    drawCap(sp.x);
    return moving;
  });
  bag.add(B.unregister);

  let over = null;

  function hitTest([wx, wy]) {
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
      read.textContent = "rest";
    } else {
      const part = hitTest(over);
      if (!part) {
        sp.t = 0;
        read.textContent = "rest";
      } else {
        const t = clamp((over[0] - (-10)) / 85, 0, 1);
        sp.t = G_MAX * Math.max(0.18, t);
        read.textContent = part;
      }
    }
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      over = unproj(C, p[0], p[1], 0);
      retarget();
    },
    leave: () => {
      over = null;
      retarget();
    },
  }));

  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => {
      G_MAX = v;
      if (over) retarget();
    },
    destroy: bag.dispose,
  };
}

hairline({
  name: "pen",
  means: "A fountain pen on a rest: the pointer draws its cap open along its axis, revealing the nib and feed.",
  rules: [1, 3, 5, 9],
  range: [25, 45, 65],
  mount,
});
