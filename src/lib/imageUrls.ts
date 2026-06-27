type ImageTransform = {
  width: number;
  height?: number;
  quality?: number;
  resize?: "cover" | "contain" | "fill";
};

export function getOptimizedImageUrl(src: string | undefined, transform: ImageTransform) {
  if (!src || src.startsWith("data:") || src.startsWith("blob:")) return src ?? "";

  try {
    const url = new URL(src);
    const marker = "/storage/v1/object/public/";
    const markerIndex = url.pathname.indexOf(marker);
    if (markerIndex === -1) return src;

    const storagePath = url.pathname.slice(markerIndex + marker.length);
    const next = new URL(`${url.origin}/storage/v1/render/image/public/${storagePath}`);
    next.searchParams.set("width", String(transform.width));
    if (transform.height) next.searchParams.set("height", String(transform.height));
    if (transform.quality) next.searchParams.set("quality", String(transform.quality));
    if (transform.resize) next.searchParams.set("resize", transform.resize);
    return next.toString();
  } catch {
    return src;
  }
}

export function getOptimizedSrcSet(
  src: string | undefined,
  widths: number[],
  options: Omit<ImageTransform, "width">,
) {
  if (!src || src.startsWith("data:") || src.startsWith("blob:")) return undefined;
  return widths
    .map((width) => `${getOptimizedImageUrl(src, { ...options, width })} ${width}w`)
    .join(", ");
}
