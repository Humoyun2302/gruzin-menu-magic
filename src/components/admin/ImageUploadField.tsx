import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { ImageIcon, LinkIcon, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  compressImage,
  fileToDataUrl,
  formatBytes,
  type CompressResult,
} from "@/lib/imageCompression";
import { isSupabaseConfigured, uploadFoodImage } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ACCEPT_ATTRIBUTE = ACCEPTED_IMAGE_TYPES.join(",");

export function ImageUploadField({
  value,
  onChange,
  onRemove,
  onBusyChange,
  label,
  placeholder = "Фото блюда появится здесь",
}: {
  value?: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  onBusyChange?: (busy: boolean) => void;
  label: string;
  placeholder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [urlValue, setUrlValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [lastCompression, setLastCompression] = useState<CompressResult | null>(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    setError(null);
    setUrlValue("");
    setLastCompression(null);
  }, [value]);

  useEffect(() => {
    onBusyChange?.(uploading);
  }, [onBusyChange, uploading]);

  useEffect(() => {
    return () => clearPreviewUrl();
  }, []);

  const setLocalPreview = (url: string | null) => {
    clearPreviewUrl();
    previewUrlRef.current = url;
    setPreviewUrl(url);
  };

  const clearPreviewUrl = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setUploading(true);
    setStatusText("Оптимизация фото...");
    setLastCompression(null);
    setLocalPreview(URL.createObjectURL(file));

    try {
      const optimized = await compressImage(file);
      setLastCompression(optimized);
      setStatusText("Загружаем фото...");
      setLocalPreview(URL.createObjectURL(optimized.file));

      const savedValue = isSupabaseConfigured
        ? await uploadFoodImage(optimized.file)
        : await fileToDataUrl(optimized.file);
      onChange(savedValue);
      setLocalPreview(null);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Не удалось загрузить изображение. Попробуйте другой файл.",
      );
      setLocalPreview(null);
    } finally {
      setUploading(false);
      setStatusText("");
    }
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (file) await uploadFile(file);
  };

  const applyUrl = () => {
    const next = urlValue.trim();
    if (!next) return;
    if (!/^https?:\/\//i.test(next) && !next.startsWith("data:image/")) {
      setError("Введите корректную ссылку на изображение.");
      return;
    }
    setError(null);
    onChange(next);
    setUrlValue("");
  };

  const removeImage = () => {
    if (!value && !previewUrl) return;
    const confirmed = window.confirm("Удалить фото блюда?");
    if (!confirmed) return;
    setLocalPreview(null);
    onRemove();
  };

  const imageSrc = previewUrl || value;

  return (
    <div className="grid gap-2">
      <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>

      <div className="grid gap-3 sm:grid-cols-[220px_minmax(0,1fr)]">
        <div
          className={cn(
            "relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-[color:var(--cream-deep)] transition",
            dragActive && "border-foreground bg-secondary",
          )}
          onDragOver={(event) => {
            event.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          {imageSrc ? (
            <img src={imageSrc} alt="Предпросмотр блюда" className="h-full w-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 px-4 text-center text-muted-foreground">
              <ImageIcon className="h-8 w-8" strokeWidth={1.4} />
              <span className="text-xs">{placeholder}</span>
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/75 text-sm font-medium text-foreground backdrop-blur-sm">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {statusText || "Загружаем..."}
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
            <Button type="button" disabled={uploading} onClick={() => inputRef.current?.click()}>
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {value ? "Сменить фото" : "Загрузить фото"}
            </Button>
            {(value || previewUrl) && (
              <Button type="button" variant="outline" disabled={uploading} onClick={removeImage}>
                <X className="h-4 w-4" />
                Удалить фото
              </Button>
            )}
          </div>

          <p className="text-xs leading-5 text-muted-foreground">
            PNG, JPG или WEBP до 10 МБ. Фото автоматически сжимается перед сохранением.
          </p>

          {lastCompression && (
            <p className="text-xs leading-5 text-muted-foreground">
              Оптимизировано: {formatBytes(lastCompression.originalSize)} →{" "}
              {formatBytes(lastCompression.compressedSize)}
            </p>
          )}

          <div className="grid gap-2 rounded-lg border border-border bg-secondary/35 p-2">
            <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Или вставьте URL изображения
            </Label>
            <div className="flex gap-2">
              <Input
                value={urlValue}
                onChange={(event) => setUrlValue(event.target.value)}
                placeholder="https://..."
                disabled={uploading}
              />
              <Button
                type="button"
                variant="outline"
                disabled={uploading || !urlValue.trim()}
                onClick={applyUrl}
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {error && <p className="text-xs font-medium text-destructive">{error}</p>}
        </div>
      </div>
    </div>
  );
}

function validateFile(file: File) {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return "Можно загрузить только PNG, JPG или WEBP.";
  if (file.size > MAX_IMAGE_SIZE) return "Файл слишком большой. Максимальный размер — 10 МБ.";
  return "";
}
