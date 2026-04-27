import { useCallback, useEffect, useRef } from "react";

type Props = {
  isDark: boolean;
  onToggle: (originX: number, originY: number) => void;
};

// ── Rope physics ──────────────────────────────────────────────────────────────
const N = 10;                       // number of nodes  (9 segments)
const ROPE_LEN = 48;                // total rest length in px
const SEG = ROPE_LEN / (N - 1);    // per-segment rest length
const PULL_THRESHOLD = 40;         // extra downward pull beyond ROPE_LEN to fire toggle
const PULL_H_THRESHOLD = 40;       // horizontal drag distance to fire toggle
const GRAVITY = 0.28;              // downward acceleration per frame
const VEL_DAMP = 0.978;            // velocity scalar per frame  (< 1 = damping)
const ITERS = 16;                  // constraint-relaxation iterations per frame
const SCROLL_H = 0.001;             // wheel.deltaY → horizontal impulse per node
const SCROLL_NX = 0.5;             // random x noise per scroll event
const SCROLL_NY = 0.15;            // random y noise per scroll event

// ── SVG canvas ────────────────────────────────────────────────────────────────
const SVG_W = 200;
const SVG_H = ROPE_LEN + PULL_THRESHOLD + 40;
const AX = SVG_W / 2; // anchor x (fixed attach point)

// ── Node ──────────────────────────────────────────────────────────────────────
interface RNode { x: number; y: number; px: number; py: number }

function initNodes(): RNode[] {
  return Array.from({ length: N }, (_, i) => ({
    x: AX, y: i * SEG, px: AX, py: i * SEG,
  }));
}

// Smooth path through nodes via quadratic bezier midpoints
function buildPath(ns: RNode[]): string {
  let d = `M ${ns[0].x.toFixed(1)},${ns[0].y.toFixed(1)}`;
  for (let i = 1; i < N - 1; i++) {
    const mx = ((ns[i].x + ns[i + 1].x) / 2).toFixed(1);
    const my = ((ns[i].y + ns[i + 1].y) / 2).toFixed(1);
    d += ` Q ${ns[i].x.toFixed(1)},${ns[i].y.toFixed(1)} ${mx},${my}`;
  }
  d += ` L ${ns[N - 1].x.toFixed(1)},${ns[N - 1].y.toFixed(1)}`;
  return d;
}

export default function PullStringSwitch({ isDark, onToggle }: Props) {
  const nodesRef = useRef<RNode[]>(initNodes());
  const rafRef = useRef(0);
  const bulbRef = useRef<SVGSVGElement>(null);

  // Drag state — all mutable, never causes renders
  const drag = useRef({
    active: false,
    cx0: 0, cy0: 0,   // pointer start (client coords)
    nx0: 0, ny0: 0,   // bead start (SVG coords)
    pinX: 0, pinY: 0, // current pinned position during drag
    fired: false,
  });

  // SVG element refs — updated directly in the RAF loop
  const ropeBodyRef = useRef<SVGPathElement>(null);
  const ropeTwistRef = useRef<SVGPathElement>(null);
  const beadRef = useRef<SVGCircleElement>(null);
  const hitRef = useRef<SVGCircleElement>(null);
  // Timestamp of last drag-triggered toggle — suppresses bulb-click double-fire
  const lastDragFireRef = useRef(0);

  // ── Simulation step ─────────────────────────────────────────────────────────
  const step = useCallback(() => {
    const ns = nodesRef.current;
    const d = drag.current;

    // Verlet integration (skip dragged node)
    for (let i = 1; i < N; i++) {
      if (d.active && i === N - 1) continue;
      const n = ns[i];
      const vx = (n.x - n.px) * VEL_DAMP;
      const vy = (n.y - n.py) * VEL_DAMP;
      n.px = n.x; n.py = n.y;
      n.x += vx;
      n.y += vy + GRAVITY;
    }

    // Pin dragged node to pointer
    if (d.active) {
      const last = ns[N - 1];
      last.px = last.x; last.py = last.y;
      last.x = d.pinX;  last.y = d.pinY;
    }

    // Constraint relaxation — restore segment lengths
    for (let iter = 0; iter < ITERS; iter++) {
      for (let i = 0; i < N - 1; i++) {
        const a = ns[i], b = ns[i + 1];
        const dx = b.x - a.x, dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 1e-6;
        const diff = (dist - SEG) / dist;
        const aPin = i === 0;
        const bPin = d.active && i === N - 2;
        if (aPin && bPin) continue;
        if (aPin)       { b.x -= dx * diff;       b.y -= dy * diff; }
        else if (bPin)  { a.x += dx * diff;       a.y += dy * diff; }
        else            { const h = diff * 0.5;
                          a.x += dx * h; a.y += dy * h;
                          b.x -= dx * h; b.y -= dy * h; }
      }
      // Re-pin anchor and drag node each iteration
      ns[0].x = AX; ns[0].y = 0;
      if (d.active) { ns[N - 1].x = d.pinX; ns[N - 1].y = d.pinY; }
    }
  }, []);

  // ── Flush physics state → DOM ────────────────────────────────────────────────
  const flush = useCallback(() => {
    const ns = nodesRef.current;
    const pathD = buildPath(ns);
    ropeBodyRef.current?.setAttribute("d", pathD);
    ropeTwistRef.current?.setAttribute("d", pathD);
    const bx = ns[N - 1].x.toFixed(1);
    const by = ns[N - 1].y.toFixed(1);
    beadRef.current?.setAttribute("cx", bx);
    beadRef.current?.setAttribute("cy", by);
    hitRef.current?.setAttribute("cx", bx);
    hitRef.current?.setAttribute("cy", by);
  }, []);

  // ── RAF loop ─────────────────────────────────────────────────────────────────
  const loop = useCallback(() => {
    step();
    flush();
    const ns = nodesRef.current;
    let moving = drag.current.active;
    if (!moving) {
      for (let i = 1; i < N; i++) {
        const n = ns[i];
        if (Math.abs(n.x - n.px) > 0.02 || Math.abs(n.y - n.py) > 0.02 || Math.abs(n.x - AX) > 0.15) { moving = true; break; }
      }
    }
    rafRef.current = moving ? requestAnimationFrame(loop) : 0;
  }, [step, flush]);

  const kick = useCallback(() => {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(loop);
  }, [loop]);

  // ── Scroll → horizontal impulse with noise (wheel + mobile scroll) ───────────
  useEffect(() => {
    const applyImpulse = (deltaY: number) => {
      const ns = nodesRef.current;
      const h = deltaY * SCROLL_H;
      for (let i = 1; i < N; i++) {
        ns[i].px -= h + (Math.random() - 0.5) * SCROLL_NX * 2;
        ns[i].py += (Math.random() - 0.5) * SCROLL_NY * 2;
      }
      kick();
    };

    // Desktop — wheel events carry deltaY directly
    const onWheel = (e: WheelEvent) => {
      const atTop = window.scrollY === 0 && e.deltaY < 0;
      const atBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1 &&
        e.deltaY > 0;
      if (atTop || atBottom) return;
      applyImpulse(e.deltaY);
    };

    // Mobile — derive deltaY from consecutive scroll positions
    let lastScrollY = window.scrollY;
    const onScroll = () => {
      const deltaY = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      if (deltaY !== 0) applyImpulse(deltaY);
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
    };
  }, [kick]);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  // ── Pointer handlers ──────────────────────────────────────────────────────────

  // Resolve bulb centre in viewport coords and call onToggle with the origin
  const fireToggle = useCallback(() => {
    const rect = bulbRef.current?.getBoundingClientRect();
    const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    onToggle(cx, cy);
  }, [onToggle]);

  const onPointerDown = useCallback((e: React.PointerEvent<SVGCircleElement>) => {
    e.preventDefault();
    const last = nodesRef.current[N - 1];
    const d = drag.current;
    d.active = true;
    d.cx0 = e.clientX; d.cy0 = e.clientY;
    d.nx0 = last.x;    d.ny0 = last.y;
    d.pinX = last.x;   d.pinY = last.y;
    d.fired = false;
    if (hitRef.current) hitRef.current.style.cursor = "grabbing";
    e.currentTarget.setPointerCapture(e.pointerId);
    kick();
  }, [kick]);

  const onPointerMove = useCallback((e: React.PointerEvent<SVGCircleElement>) => {
    const d = drag.current;
    if (!d.active) return;
    d.pinX = d.nx0 + (e.clientX - d.cx0);
    d.pinY = Math.max(SEG * 0.5, d.ny0 + (e.clientY - d.cy0));
    const pulledDown = d.pinY >= ROPE_LEN + PULL_THRESHOLD;
    const pulledSide = Math.abs(d.pinX - d.nx0) >= PULL_H_THRESHOLD;
    if (!d.fired && (pulledDown || pulledSide)) {
      d.fired = true;
      lastDragFireRef.current = performance.now();
      fireToggle();
      // Release drag so the rope snaps back freely
      d.active = false;
      if (hitRef.current) hitRef.current.style.cursor = "grab";
      e.currentTarget.releasePointerCapture(e.pointerId);
      kick();
    }
  }, [fireToggle]);

  const onPointerUp = useCallback(() => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    if (hitRef.current) hitRef.current.style.cursor = "grab";
    kick();
  }, [kick]);

  // Bulb tap/click — fallback for mobile or users who don't pull the string
  const onBulbClick = useCallback(() => {
    // Suppress if a drag-pull just fired within the last 300 ms
    if (performance.now() - lastDragFireRef.current < 300) return;
    fireToggle();
  }, [fireToggle]);

  const isOn = !isDark;
  const initPath = buildPath(nodesRef.current);

  return (
    // Relative container — takes up inline space just for the bulb.
    // The rope SVG hangs absolutely below so it doesn't affect layout.
    <div
      className="select-none"
      style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 20 }}
      role="button"
      aria-pressed={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Fixed lightbulb — tapping it also toggles (mobile fallback) */}
      <svg
        ref={bulbRef}
        width="16"
        height="20"
        viewBox="0 0 16 20"
        fill="none"
        onClick={onBulbClick}
        aria-hidden="true"
        style={{
          filter: isOn ? "drop-shadow(0 0 5px rgba(251,191,36,0.85))" : "none",
          transition: "filter 0.4s ease",
          overflow: "visible",
          display: "block",
          cursor: "pointer",
        }}
      >
        <circle cx="8" cy="7" r="5.5"
          fill={isOn ? "#fbbf24" : "currentColor"} opacity={isOn ? 1 : 0.2}
          style={{ transition: "fill 0.4s ease, opacity 0.4s ease" }} />
        <polyline points="6,8 7.5,5.5 8.5,5.5 10,8"
          stroke="white" strokeWidth="0.6" fill="none"
          opacity={isOn ? 0.65 : 0} style={{ transition: "opacity 0.4s ease" }} />
        <rect x="5.5" y="12" width="5" height="2"
          fill={isOn ? "#f59e0b" : "currentColor"} opacity={isOn ? 0.9 : 0.15}
          style={{ transition: "fill 0.4s ease, opacity 0.4s ease" }} />
        <rect x="4.5" y="14" width="7" height="2" rx="1" fill="currentColor" opacity="0.5" />
        <rect x="5" y="16" width="6" height="2" rx="1" fill="currentColor" opacity="0.4" />
        <rect x="5.5" y="18" width="5" height="2" rx="1" fill="currentColor" opacity="0.3" />
      </svg>

      {/* Physics rope — zero layout impact, pointer-events isolated to hit circle */}
      <svg
        width={SVG_W}
        height={SVG_H}
        style={{
          position: "absolute",
          top: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          overflow: "visible",
          pointerEvents: "none",
          touchAction: "none",
        }}
        aria-hidden="true"
      >
        {/* Rope body — thick, muted */}
        <path ref={ropeBodyRef} d={initPath}
          stroke="currentColor" strokeWidth="3" strokeLinecap="round"
          strokeLinejoin="round" fill="none" opacity="0.35" />
        {/* Twist texture — thin dashed overlay */}
        <path ref={ropeTwistRef} d={initPath}
          stroke="currentColor" strokeWidth="1" strokeLinecap="round"
          fill="none" opacity="0.45" strokeDasharray="3 5" />
        {/* Bead */}
        <circle ref={beadRef} cx={AX} cy={ROPE_LEN} r={5}
          fill="currentColor" opacity="0.65"
          style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.3))" }} />
        {/* Hit area — wider than bead, sole receiver of pointer events */}
        <circle ref={hitRef} cx={AX} cy={ROPE_LEN} r={24}
          fill="transparent"
          style={{ pointerEvents: "all", cursor: "grab" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
      </svg>
    </div>
  );
}
