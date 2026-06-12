const COLORS = [
  "#1877f2",
  "#e91e63",
  "#9c27b0",
  "#673ab7",
  "#009688",
  "#ff5722",
  "#795548",
  "#607d8b",
  "#3f51b5",
  "#00897b",
];

function colorFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <span
      aria-hidden
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        borderRadius: "50%",
        background: colorFor(name),
        color: "#fff",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        fontSize: `${Math.round(size * 0.45)}px`,
        lineHeight: 1,
        userSelect: "none",
      }}
    >
      {initial}
    </span>
  );
}
