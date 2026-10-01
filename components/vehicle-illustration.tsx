import { useId } from "react";
import type { VehicleType } from "@/lib/types";

/**
 * Side-profile vehicle illustrations (facing right), drawn on a shared 400Ã—160 canvas
 * so every vehicle sits on the same ground line. Wheels spin via the `.vehicle-wheel`
 * class (see globals.css) while a parent `.group` is hovered or has `.is-driving`.
 */

interface Wheel {
  cx: number;
  r: number;
}

interface Shape {
  body: string;
  glass: string;
  pillars: { x: number; y1: number; y2: number }[];
  wheels: [Wheel, Wheel];
  lines: string[];
  stripe: string;
  stripeFill?: boolean;
  handles: [number, number][];
  headlight: string;
  /** Vertical centre of the headlight glow shown on hover. */
  glowY?: number;
  taillight: string;
  extras?: (ids: Ids) => React.ReactNode;
}

interface Ids {
  body: string;
  glass: string;
  gold: string;
  rim: string;
  shadow: string;
  glow: string;
}

const GROUND = 150;

const shapes: Record<VehicleType, Shape> = {
  sedan: {
    body: "M30 120Q28 106 38 100L48 92Q80 86 112 84Q136 64 160 58Q200 52 236 56Q262 64 284 82Q330 86 358 92Q372 96 374 108L374 122Q374 132 364 132L330 132A26 26 0 0 0 278 132L124 132A26 26 0 0 0 72 132L40 132Q30 132 30 120Z",
    glass: "M121 84Q140 68 162 63Q200 58 234 61Q254 68 272 84Z",
    pillars: [{ x: 194, y1: 56, y2: 86 }],
    wheels: [
      { cx: 98, r: 21 },
      { cx: 304, r: 21 },
    ],
    lines: ["M50 92Q200 86 356 94", "M194 88L195 126", "M130 86L132 124", "M268 85L266 124"],
    stripe: "M33 104Q200 99 373 106",
    handles: [
      [178, 98],
      [250, 98],
    ],
    headlight: "M352 93Q369 96 373 104L356 104Z",
    taillight: "M33 101L47 95L47 103L32 107Z",
    extras: () => <path d="M268 80q7-7 14-2l-2 6z" fill="#cfd5df" />,
  },
  suv: {
    body: "M30 118L30 76Q30 64 38 58L50 44Q56 38 68 38L252 38Q266 38 274 46L300 76Q346 80 366 86Q376 90 376 102L376 120Q376 130 366 130L333 130A29 29 0 0 0 275 130L129 130A29 29 0 0 0 71 130L40 130Q30 130 30 118Z",
    glass: "M48 74L60 51Q64 45 72 45L250 45Q260 45 266 52L288 76Z",
    pillars: [
      { x: 130, y1: 44, y2: 78 },
      { x: 208, y1: 44, y2: 78 },
    ],
    wheels: [
      { cx: 100, r: 24 },
      { cx: 304, r: 24 },
    ],
    lines: ["M36 84Q200 80 370 88", "M133 78L133 126", "M211 78L211 126", "M286 80L284 118"],
    stripe: "M31 97Q200 92 375 100",
    handles: [
      [116, 90],
      [194, 90],
    ],
    headlight: "M356 87Q372 90 375 98L358 98Z",
    taillight: "M30 66L37 66L37 90L30 90Z",
    extras: () => (
      <g fill="#9aa3b2">
        <rect x="78" y="30" width="168" height="4" rx="2" />
        <rect x="92" y="33" width="4" height="6" rx="1" />
        <rect x="228" y="33" width="4" height="6" rx="1" />
      </g>
    ),
  },
  "seven-seater": {
    body: "M30 120L32 78Q34 62 46 54L60 46Q66 42 78 42L238 42Q256 42 268 52L300 80Q344 84 364 90Q375 94 375 106L375 121Q375 131 365 131L333 131A27 27 0 0 0 279 131L123 131A27 27 0 0 0 69 131L40 131Q30 131 30 120Z",
    glass: "M44 80L56 56Q62 49 74 49L236 49Q250 49 260 57L286 80Z",
    pillars: [
      { x: 110, y1: 48, y2: 82 },
      { x: 174, y1: 48, y2: 82 },
      { x: 236, y1: 48, y2: 82 },
    ],
    wheels: [
      { cx: 96, r: 22 },
      { cx: 306, r: 22 },
    ],
    lines: ["M34 89Q200 85 368 93", "M113 82L113 126", "M177 82L177 128", "M239 82L239 128", "M118 86L236 86"],
    stripe: "M31 99Q200 95 374 102",
    handles: [
      [160, 96],
      [224, 96],
    ],
    headlight: "M352 90Q370 93 374 101L356 101Z",
    taillight: "M32 64L38 60L38 90L32 92Z",
  },
  van: {
    body: "M30 120L30 50Q30 32 46 30L280 28Q296 28 306 38L336 76Q360 80 370 88Q376 94 376 104L376 121Q376 131 366 131L331 131A27 27 0 0 0 277 131L119 131A27 27 0 0 0 65 131L40 131Q30 131 30 120Z",
    glass: "M40 76L40 46Q40 38 48 38L282 37Q292 37 298 44L324 76Z",
    pillars: [
      { x: 98, y1: 36, y2: 78 },
      { x: 162, y1: 36, y2: 78 },
      { x: 228, y1: 36, y2: 78 },
    ],
    wheels: [
      { cx: 92, r: 22 },
      { cx: 304, r: 22 },
    ],
    lines: ["M32 85Q200 82 372 89", "M165 78L165 128", "M231 78L231 128", "M170 81L226 81"],
    stripe: "M31 95Q200 92 375 99",
    handles: [
      [150, 92],
      [216, 92],
    ],
    headlight: "M340 84Q360 86 374 92L373 96Q356 91 340 89Z",
    taillight: "M30 50L36 50L36 80L30 80Z",
  },
  "mini-van": {
    body: "M26 120L26 30Q26 14 42 14L300 14Q318 14 326 26L348 74Q366 78 372 86Q378 92 378 104L378 121Q378 131 368 131L343 131A27 27 0 0 0 289 131L115 131A27 27 0 0 0 61 131L36 131Q26 131 26 120Z",
    glass: "M36 70L36 32Q36 24 44 24L306 24Q314 24 318 32L338 72Z",
    pillars: [
      { x: 90, y1: 22, y2: 74 },
      { x: 150, y1: 22, y2: 74 },
      { x: 210, y1: 22, y2: 74 },
      { x: 270, y1: 22, y2: 74 },
    ],
    wheels: [
      { cx: 88, r: 22 },
      { cx: 316, r: 22 },
    ],
    lines: ["M213 74L213 128", "M273 74L273 128", "M28 82L366 84"],
    stripe: "M27 92L377 95L377 102L27 99Z",
    stripeFill: true,
    handles: [
      [198, 86],
      [258, 86],
    ],
    headlight: "M356 85Q372 88 376 96L358 96Z",
    taillight: "M26 70L32 70L32 96L26 96Z",
  },
  bus: {
    body: "M14 122L14 26Q14 12 30 12L368 12Q384 12 386 28L388 120Q388 131 378 131L327 131A27 27 0 0 0 273 131L119 131A27 27 0 0 0 65 131L24 131Q14 131 14 122Z",
    glass: "M24 64L24 30Q24 22 32 22L334 22L334 64Z",
    pillars: [
      { x: 76, y1: 21, y2: 65 },
      { x: 128, y1: 21, y2: 65 },
      { x: 180, y1: 21, y2: 65 },
      { x: 232, y1: 21, y2: 65 },
      { x: 284, y1: 21, y2: 65 },
    ],
    wheels: [
      { cx: 92, r: 22 },
      { cx: 300, r: 22 },
    ],
    lines: ["M128 106L262 106L262 124L128 124Z", "M173 106L173 124", "M218 106L218 124"],
    stripe: "M14 92C120 78 230 104 388 80L388 94C230 118 120 92 14 106Z",
    stripeFill: true,
    handles: [],
    headlight: "M378 100L387 100L387 110L378 110Z",
    glowY: 105,
    taillight: "M14 96L20 96L20 116L14 116Z",
    extras: (ids) => (
      <g>
        <rect x="150" y="5" width="96" height="9" rx="3" fill="#cfd5df" />
        {/* windscreen */}
        <path d="M360 22L374 22Q382 22 382 30L384 90L362 90Z" fill={`url(#${ids.glass})`} />
        {/* door */}
        <rect x="338" y="22" width="18" height="104" rx="2" fill={`url(#${ids.glass})`} />
        <path d="M347 24L347 124" stroke="#cfd5df" strokeWidth="1.5" />
      </g>
    ),
  },
};

function WheelShape({ cx, r, ids }: Wheel & { ids: Ids }) {
  const cy = GROUND - r;
  return (
    <g className="vehicle-wheel">
      <circle cx={cx} cy={cy} r={r} fill="#14171f" />
      <circle cx={cx} cy={cy} r={r - 2.5} fill="none" stroke="#2b303b" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r={r * 0.6} fill={`url(#${ids.rim})`} />
      {[0, 72, 144, 216, 288].map((angle) => (
        <rect
          key={angle}
          x={cx - 1.6}
          y={cy - r * 0.58}
          width="3.2"
          height={r * 0.5}
          rx="1.4"
          fill="#6b7383"
          transform={`rotate(${angle} ${cx} ${cy})`}
        />
      ))}
      <circle cx={cx} cy={cy} r={r * 0.17} fill="#3b4250" />
    </g>
  );
}

export function VehicleIllustration({
  type,
  className = "",
  title,
}: {
  type: VehicleType;
  className?: string;
  title?: string;
}) {
  const shape = shapes[type] ?? shapes.sedan;
  const uid = useId().replace(/:/g, "");
  const ids: Ids = {
    body: `vb-${uid}`,
    glass: `vg-${uid}`,
    gold: `vo-${uid}`,
    rim: `vr-${uid}`,
    shadow: `vs-${uid}`,
    glow: `vl-${uid}`,
  };

  return (
    <svg viewBox="0 0 400 160" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <defs>
        <linearGradient id={ids.body} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#eef1f6" />
          <stop offset="1" stopColor="#c3cad6" />
        </linearGradient>
        <linearGradient id={ids.glass} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3a4c78" />
          <stop offset="0.55" stopColor="#152039" />
          <stop offset="1" stopColor="#0a1122" />
        </linearGradient>
        <linearGradient id={ids.gold} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffd770" />
          <stop offset="0.5" stopColor="#f5a800" />
          <stop offset="1" stopColor="#ff6a3d" />
        </linearGradient>
        <radialGradient id={ids.rim}>
          <stop offset="0" stopColor="#f4f6fa" />
          <stop offset="1" stopColor="#8f98a8" />
        </radialGradient>
        <radialGradient id={ids.shadow}>
          <stop offset="0" stopColor="#000" stopOpacity="0.45" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={ids.glow}>
          <stop offset="0" stopColor="#ffe7a3" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffe7a3" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="200" cy={GROUND + 2} rx="190" ry="9" fill={`url(#${ids.shadow})`} />

      <path d={shape.body} fill={`url(#${ids.body})`} stroke="#aab3c2" strokeWidth="1" />
      <path d={shape.glass} fill={`url(#${ids.glass})`} />
      {/* glass reflection */}
      <path d={shape.glass} fill="#ffffff" opacity="0.08" transform="translate(0 -3) scale(1 0.98)" />
      {shape.pillars.map(({ x, y1, y2 }) => (
        <rect key={x} x={x} y={y1} width="6" height={y2 - y1} fill={`url(#${ids.body})`} />
      ))}

      {shape.lines.map((d) => (
        <path key={d} d={d} fill="none" stroke="#aeb7c6" strokeWidth="1.1" />
      ))}

      {shape.stripeFill ? (
        <path d={shape.stripe} fill={`url(#${ids.gold})`} />
      ) : (
        <path d={shape.stripe} fill="none" stroke={`url(#${ids.gold})`} strokeWidth="3.2" strokeLinecap="round" />
      )}

      {shape.handles.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="11" height="3" rx="1.5" fill="#9aa3b2" />
      ))}

      {shape.extras?.(ids)}

      <path d={shape.headlight} fill="#ffe7a3" />
      <ellipse
        cx={400 - 18}
        cy={shape.glowY ?? 98}
        rx="22"
        ry="12"
        fill={`url(#${ids.glow})`}
        className="opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <path d={shape.taillight} fill="#ff4d4d" />

      {shape.wheels.map((wheel) => (
        <WheelShape key={wheel.cx} {...wheel} ids={ids} />
      ))}
    </svg>
  );
}
