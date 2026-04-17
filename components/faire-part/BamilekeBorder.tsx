"use client";

// Motif decoratif inspire des motifs geometriques Bamileke
// Utilise en bordure de faire-part et en separateur de sections

export function BamilekeDivider({
  color = "#B8935A",
  className = "",
}: {
  color?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-center gap-3 py-4 ${className}`}>
      <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
        <path
          d="M0 6L6 0L12 6L6 12L0 6Z"
          fill={color}
          fillOpacity="0.3"
        />
        <path
          d="M14 6L20 0L26 6L20 12L14 6Z"
          fill={color}
          fillOpacity="0.6"
        />
        <path
          d="M28 6L34 0L40 6L34 12L28 6Z"
          fill={color}
          fillOpacity="0.3"
        />
      </svg>
      <div className="w-16 sm:w-24 h-px" style={{ backgroundColor: color }} />
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <rect
          x="2"
          y="2"
          width="8"
          height="8"
          transform="rotate(45 6 2)"
          stroke={color}
          strokeWidth="1"
          fill="none"
        />
      </svg>
      <div className="w-16 sm:w-24 h-px" style={{ backgroundColor: color }} />
      <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
        <path
          d="M0 6L6 0L12 6L6 12L0 6Z"
          fill={color}
          fillOpacity="0.3"
        />
        <path
          d="M14 6L20 0L26 6L20 12L14 6Z"
          fill={color}
          fillOpacity="0.6"
        />
        <path
          d="M28 6L34 0L40 6L34 12L28 6Z"
          fill={color}
          fillOpacity="0.3"
        />
      </svg>
    </div>
  );
}

export function BamilekeCorner({
  color = "#B8935A",
  position,
}: {
  color?: string;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}) {
  const rotations = {
    "top-left": "rotate(0)",
    "top-right": "rotate(90)",
    "bottom-right": "rotate(180)",
    "bottom-left": "rotate(270)",
  };

  const positions = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0",
    "bottom-left": "bottom-0 left-0",
    "bottom-right": "bottom-0 right-0",
  };

  return (
    <div className={`absolute ${positions[position]} w-16 h-16 sm:w-20 sm:h-20`}>
      <svg
        viewBox="0 0 80 80"
        fill="none"
        className="w-full h-full"
        style={{ transform: rotations[position] }}
      >
        <path
          d="M0 0L0 30L4 30L4 4L30 4L30 0L0 0Z"
          fill={color}
          fillOpacity="0.6"
        />
        <path
          d="M0 0L0 20L2 20L2 2L20 2L20 0L0 0Z"
          fill={color}
        />
        <rect x="8" y="8" width="6" height="6" fill={color} fillOpacity="0.3" />
        <path
          d="M8 20L14 14L20 20L14 26L8 20Z"
          fill={color}
          fillOpacity="0.2"
        />
      </svg>
    </div>
  );
}

export function BamilekeFrame({
  color = "#B8935A",
  children,
  className = "",
}: {
  color?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <BamilekeCorner color={color} position="top-left" />
      <BamilekeCorner color={color} position="top-right" />
      <BamilekeCorner color={color} position="bottom-left" />
      <BamilekeCorner color={color} position="bottom-right" />
      <div className="px-8 py-8 sm:px-12 sm:py-10">{children}</div>
    </div>
  );
}
