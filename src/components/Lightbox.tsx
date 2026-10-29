import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Item as Photo } from "@/data/content";

interface Props {
  photos: Photo[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}

export default function Lightbox({ photos, index, onIndex, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const prev = () => onIndex((index - 1 + photos.length) % photos.length);
  const next = () => onIndex((index + 1) % photos.length);

  useEffect(() => {
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  const photo = photos[index];
  const btn = "rounded-full bg-white/10 p-3 text-white hover:bg-white/25";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photograph ${index + 1} of ${photos.length}`}
      className="fixed inset-0 z-50 flex flex-col bg-black/95"
      onClick={onClose}
    >
      <div className="flex items-center justify-between p-4 text-white">
        <p className="ui">
          {index + 1} of {photos.length}
        </p>
        <button ref={closeRef} onClick={onClose} aria-label="Close photograph" className={btn}>
          <X size={18} />
        </button>
      </div>
      <div
        className="flex min-h-0 flex-1 items-center justify-center gap-2 px-2 sm:gap-4 sm:px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={prev} aria-label="Previous photograph" className={btn}>
          <ChevronLeft size={20} />
        </button>
        <img src={photo.src} alt={photo.alt} className="max-h-full min-w-0 max-w-full flex-1 object-contain" />
        <button onClick={next} aria-label="Next photograph" className={btn}>
          <ChevronRight size={20} />
        </button>
      </div>
      <p className="p-4 text-center italic text-white/80">{photo.caption ?? "\u00a0"}</p>
    </div>
  );
}
