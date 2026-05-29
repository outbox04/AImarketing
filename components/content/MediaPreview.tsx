import Image from "next/image";
import { ImageIcon } from "lucide-react";

type MediaPreviewProps = {
  src?: string;
  alt: string;
};

export function MediaPreview({ src, alt }: MediaPreviewProps) {
  if (!src) {
    return (
      <div className="grid aspect-[16/10] place-items-center rounded-2xl border border-dashed border-border bg-surface-soft text-text-muted">
        <div className="text-center">
          <ImageIcon className="mx-auto mb-2" size={24} />
          <p className="text-sm font-semibold">Chưa có media</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-surface-soft">
      <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 420px" />
    </div>
  );
}
