const DEFAULT_MAX_WIDTH = 1200;
const DEFAULT_MAX_HEIGHT = 900;
const DEFAULT_QUALITY = 0.82;
const TARGET_BYTES = 500 * 1024;

type CompressOptions = {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  targetBytes?: number;
};

export type CompressResult = {
  file: File;
  width: number;
  height: number;
  originalSize: number;
  compressedSize: number;
  mimeType: string;
};

export async function compressImage(
  file: File,
  options: CompressOptions = {},
): Promise<CompressResult> {
  const image = await loadImage(file);
  const maxWidth = options.maxWidth ?? DEFAULT_MAX_WIDTH;
  const maxHeight = options.maxHeight ?? DEFAULT_MAX_HEIGHT;
  const targetBytes = options.targetBytes ?? TARGET_BYTES;
  const baseQuality = options.quality ?? DEFAULT_QUALITY;
  const { width, height } = fitWithin(image.naturalWidth, image.naturalHeight, maxWidth, maxHeight);

  if (
    file.size <= targetBytes &&
    image.naturalWidth <= maxWidth &&
    image.naturalHeight <= maxHeight
  ) {
    return {
      file,
      width: image.naturalWidth,
      height: image.naturalHeight,
      originalSize: file.size,
      compressedSize: file.size,
      mimeType: file.type,
    };
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) throw new Error("Canvas is not available.");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, 0, 0, width, height);

  const mimeType = (await supportsWebp(canvas)) ? "image/webp" : "image/jpeg";
  const qualities = [baseQuality, 0.76, 0.7, 0.64];
  let bestBlob: Blob | null = null;

  for (const quality of qualities) {
    const blob = await canvasToBlob(canvas, mimeType, quality);
    bestBlob = blob;
    if (blob.size <= targetBytes) break;
  }

  if (!bestBlob) throw new Error("Не удалось оптимизировать изображение.");

  const extension = mimeType === "image/webp" ? "webp" : "jpg";
  const optimized = new File([bestBlob], withExtension(file.name, extension), {
    type: mimeType,
    lastModified: Date.now(),
  });

  return {
    file: optimized,
    width,
    height,
    originalSize: file.size,
    compressedSize: optimized.size,
    mimeType,
  };
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}

export function fileToDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Не удалось прочитать изображение."));
    reader.readAsDataURL(file);
  });
}

function fitWithin(width: number, height: number, maxWidth: number, maxHeight: number) {
  const scale = Math.min(1, maxWidth / width, maxHeight / height);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Не удалось открыть изображение."));
    };
    image.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) reject(new Error("Не удалось сжать изображение."));
        else resolve(blob);
      },
      mimeType,
      quality,
    );
  });
}

async function supportsWebp(canvas: HTMLCanvasElement) {
  try {
    const blob = await canvasToBlob(canvas, "image/webp", 0.8);
    return blob.type === "image/webp";
  } catch {
    return false;
  }
}

function withExtension(name: string, extension: string) {
  const base = name.replace(/\.[^.]+$/, "") || "food-photo";
  return `${base}.${extension}`;
}
