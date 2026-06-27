import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { getOptimizedImageUrl, getOptimizedSrcSet } from "@/lib/imageUrls";
import { FoodImagePlaceholder } from "@/components/menu/FoodImagePlaceholder";

type Variant = "card" | "detail";

const IMAGE_CONFIG = {
  card: {
    width: 520,
    height: 390,
    quality: 72,
    widths: [320, 480, 640],
    sizes: "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw",
  },
  detail: {
    width: 1100,
    height: 825,
    quality: 78,
    widths: [640, 900, 1200],
    sizes: "(min-width: 768px) 680px, 100vw",
  },
} satisfies Record<
  Variant,
  { width: number; height: number; quality: number; widths: number[]; sizes: string }
>;

export function OptimizedFoodImage({
  src,
  alt,
  className,
  imageClassName,
  variant = "card",
  priority = false,
}: {
  src?: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  variant?: Variant;
  priority?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failedOptimizedUrl, setFailedOptimizedUrl] = useState(false);
  const [failedOriginalUrl, setFailedOriginalUrl] = useState(false);
  const config = IMAGE_CONFIG[variant];

  useEffect(() => {
    setLoaded(false);
    setFailedOptimizedUrl(false);
    setFailedOriginalUrl(false);
  }, [src]);

  const optimizedSrc = useMemo(
    () =>
      getOptimizedImageUrl(src, {
        width: config.width,
        height: config.height,
        quality: config.quality,
        resize: "cover",
      }),
    [config.height, config.quality, config.width, src],
  );

  const srcSet = useMemo(
    () =>
      failedOptimizedUrl
        ? undefined
        : getOptimizedSrcSet(src, config.widths, {
            height: config.height,
            quality: config.quality,
            resize: "cover",
          }),
    [config.height, config.quality, config.widths, failedOptimizedUrl, src],
  );

  const imageSrc = failedOptimizedUrl ? src : optimizedSrc;
  const hasImage = Boolean(src && !failedOriginalUrl);

  return (
    <div className={cn("relative aspect-[4/3] w-full overflow-hidden bg-muted", className)}>
      <FoodImagePlaceholder
        className={cn(
          "absolute inset-0 transition-opacity duration-300",
          loaded && hasImage && "opacity-0",
        )}
      />
      {hasImage && (
        <img
          src={imageSrc}
          srcSet={srcSet}
          sizes={srcSet ? config.sizes : undefined}
          alt={alt}
          width={config.width}
          height={config.height}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => {
            if (!failedOptimizedUrl && optimizedSrc !== src) {
              setFailedOptimizedUrl(true);
              return;
            }
            setFailedOriginalUrl(true);
          }}
          className={cn(
            "h-full w-full object-cover opacity-0 transition duration-500 group-hover:scale-105",
            loaded && "opacity-100",
            imageClassName,
          )}
        />
      )}
    </div>
  );
}
