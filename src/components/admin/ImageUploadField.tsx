import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ImageIcon, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPT_ATTRIBUTE = ACCEPTED_IMAGE_TYPES.join(",");

export function ImageUploadField({
  value,
  onChange,
  onRemove,
  label,
  placeholder = "Фото блюда появится здесь",
}: {
  value?: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  label: string;
  placeholder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
  }, [value]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError("Можно загрузить только PNG, JPG или WEBP.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError("Файл слишком большой. Максимальный размер — 5 МБ.");
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      onChange(dataUrl);
      setError(null);
    } catch {
      setError("Не удалось загрузить изображение. Попробуйте другой файл.");
    }
  };

  return (
    <div className="grid gap-2">
      <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>

      <div className="grid gap-3 sm:grid-cols-[220px_minmax(0,1fr)]">
        <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-[color:var(--cream-deep)]">
          {value ? (
            <img src={value} alt="Предпросмотр блюда" className="h-full w-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 px-4 text-center text-muted-foreground">
              <ImageIcon className="h-8 w-8" strokeWidth={1.4} />
              <span className="text-xs">{placeholder}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT_ATTRIBUTE}
            className="sr-only"
            onChange={handleFileChange}
          />

          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={() => inputRef.current?.click()}>
              <Upload className="h-4 w-4" />
              Загрузить фото
            </Button>
            {value && (
              <Button type="button" variant="outline" onClick={onRemove}>
                <X className="h-4 w-4" />
                Удалить фото
              </Button>
            )}
          </div>

          <p className="text-xs leading-5 text-muted-foreground">
            PNG, JPG или WEBP до 5 МБ. Изображение сохранится локально и сразу появится в меню.
          </p>
          {error && <p className="text-xs font-medium text-destructive">{error}</p>}
        </div>
      </div>
    </div>
  );
}

async function fileToDataUrl(file: File): Promise<string> {
  const image = await loadImage(file);
  const maxSize = 1200;
  const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available");
  ctx.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/webp", 0.84);
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
      reject(new Error("Image failed to load"));
    };
    image.src = url;
  });
}
