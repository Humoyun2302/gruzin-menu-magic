export function GruzinLogo({
  className = "",
  small = false,
}: {
  className?: string;
  small?: boolean;
}) {
  return (
    <img
      src="/brand/gruzin-logo.png"
      alt="GRUZIN Georgian Restaurant"
      className={`${small ? "h-11 w-auto md:h-14" : "h-20 w-auto max-w-[min(76vw,300px)] sm:h-[86px] md:h-40 md:max-w-[520px]"} object-contain ${className}`}
      loading="eager"
      decoding="async"
    />
  );
}
