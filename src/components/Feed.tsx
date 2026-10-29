import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Lightbox from "@/components/Lightbox";
import type { Item } from "@/data/content";

type Filter = "All work" | "Photography" | "Film";
const filters: Filter[] = ["All work", "Photography", "Film"];

export default function Feed({ items }: { items: Item[] }) {
  const photos = items.filter((item) => item.type === "photo");
  const hasMixedMedia = photos.length > 0 && items.some((item) => item.type === "video");
  const [open, setOpen] = useState<number | null>(null);
  const [filter, setFilter] = useState<Filter>("All work");
  const galleryRef = useRef<HTMLUListElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const visible = items.filter((item) => filter === "All work" || item.type === (filter === "Film" ? "video" : "photo"));

  useEffect(() => {
    const cards = galleryRef.current?.querySelectorAll<HTMLElement>(".work-card");
    if (!cards || !window.IntersectionObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("reveal-pending");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    cards.forEach((card) => {
      if (card.getBoundingClientRect().top > window.innerHeight) card.classList.add("reveal-pending");
      observer.observe(card);
    });
    return () => { observer.disconnect(); cards.forEach((card) => card.classList.remove("reveal-pending")); };
  }, [filter, items]);

  const close = () => { setOpen(null); triggerRef.current?.focus(); };

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-5">
        <div className="flex items-baseline gap-3"><h2 className="text-3xl font-medium tracking-tight sm:text-4xl">Gallery</h2><span className="ui text-muted">({String(items.length).padStart(2, "0")})</span></div>
        {hasMixedMedia && <div role="group" aria-label="Filter work" className="flex flex-wrap gap-1 rounded-full border border-pane p-1">
          {filters.map((label) => <button key={label} aria-pressed={filter === label} onClick={() => setFilter(label)} className={`filter-button ${filter === label ? "is-active" : ""}`}>{label}</button>)}
        </div>}
      </div>
      <p role="status" className="sr-only">Showing {visible.length} {filter.toLowerCase()} items</p>
      <ul ref={galleryRef} className={`work-grid ${filter === "Film" ? "film-grid" : ""}`}>
        {visible.map((item, index) => (
          <li className="work-card" key={item.id}>
            {item.type === "video" ? (
              <video controls preload="metadata" poster={item.poster} aria-label={item.alt} className="aspect-video w-full rounded-lg bg-black"><source src={item.src} type="video/mp4" /></video>
            ) : (
              <button onClick={(event) => { triggerRef.current = event.currentTarget; setOpen(photos.indexOf(item)); }} aria-label={`Open photograph: ${item.alt}`} className="frame group relative block w-full">
                <img src={item.src} width={item.width} height={item.height} alt="" loading={index < 3 ? "eager" : "lazy"} decoding="async" className="w-full" />
                <span aria-hidden="true" className="photo-open"><ArrowUpRight size={20} /></span>
              </button>
            )}
            <div className="mt-3 flex items-baseline justify-between gap-3"><p className="ui font-medium">{item.caption ?? (item.type === "video" ? "A moment in motion" : "Personal work")}</p><span className="media-label">{item.type === "video" ? "Film" : "Photo"}</span></div>
          </li>
        ))}
      </ul>
      {open !== null && <Lightbox photos={photos} index={open} onIndex={setOpen} onClose={close} />}
    </>
  );
}
