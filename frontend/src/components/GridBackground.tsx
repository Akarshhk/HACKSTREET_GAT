const GridBackground = () => (
  <div
    className="fixed inset-0 -z-50 pointer-events-none overflow-hidden"
    aria-hidden="true"
  >
    {/* Grid */}
    <div className="absolute inset-0 bg-grid opacity-40" />

    {/* Gradient orbs */}
    <div
      className="absolute -top-40 -left-40 w-96 h-96 rounded-full animate-float"
      style={{
        background:
          "radial-gradient(circle, hsl(187 100% 45% / 0.08) 0%, transparent 70%)",
      }}
    />
    <div
      className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full animate-float"
      style={{
        background:
          "radial-gradient(circle, hsl(265 85% 60% / 0.06) 0%, transparent 70%)",
        animationDelay: "3s",
      }}
    />
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
      style={{
        background:
          "radial-gradient(circle, hsl(187 100% 45% / 0.03) 0%, transparent 60%)",
      }}
    />

    {/* Scan line */}
    <div className="absolute inset-0 scan-line" />
  </div>
);

export default GridBackground;