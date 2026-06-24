export function GruzinLogo({ className = "", small = false }: { className?: string; small?: boolean }) {
  // Recreation inspired by uploaded logo: bold GRUZIN wordmark with diamond ornaments either side.
  const size = small ? "h-7" : "h-12 md:h-16";
  return (
    <div className={`inline-flex items-center gap-3 md:gap-5 ${className}`}>
      <Diamond />
      <span
        className={`font-display font-bold tracking-[0.04em] text-foreground ${size} leading-none flex items-center`}
        style={{ fontSize: small ? "1.25rem" : "clamp(1.75rem, 5vw, 3.25rem)" }}
      >
        GRUZIN
      </span>
      <Diamond />
    </div>
  );
}

function Diamond() {
  return (
    <span
      aria-hidden
      className="inline-block bg-foreground"
      style={{ width: "0.6em", height: "0.6em", transform: "rotate(45deg)" }}
    />
  );
}
