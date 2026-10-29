import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { events } from "@/data/content";

type Filter = "All work" | "Photography" | "Film";
const filters: Filter[] = ["All work", "Photography", "Film"];

export default function EventGrid() {
  const [filter, setFilter] = useState<Filter>("All work");
  const visible = events.filter((event) => filter === "All work" || event.items.some((item) => item.type === (filter === "Film" ? "video" : "photo")));
  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-5">
        <div className="flex items-baseline gap-3"><h2 className="text-3xl font-medium tracking-tight sm:text-4xl">Featured events</h2><span className="ui text-muted">({String(events.length).padStart(2, "0")})</span></div>
        <div role="group" aria-label="Filter events" className="flex flex-wrap gap-1 rounded-full border border-pane p-1">
          {filters.map((label) => <button key={label} aria-pressed={filter === label} onClick={() => setFilter(label)} className={`filter-button ${filter === label ? "is-active" : ""}`}>{label}</button>)}
        </div>
      </div>
      <p role="status" className="sr-only">Showing {visible.length} event galleries</p>
      <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((event, index) => {
          const cover = event.cover;
          return (
            <li key={event.slug} className="work-card !mb-0">
              <Link to={`/events/${event.slug}`} className="group block" aria-label={`View ${event.name} gallery, ${event.items.length} media ${event.items.length === 1 ? "item" : "items"}`}>
                <div className="frame relative aspect-[4/5]">
                  {cover.type === "photo" || cover.poster ? <img src={cover.type === "photo" ? cover.src : cover.poster} alt={cover.alt} loading={index < 3 ? "eager" : "lazy"} className="h-full w-full object-cover" /> : <video muted playsInline preload="metadata" aria-label={cover.alt} className="h-full w-full object-cover"><source src={cover.src} type="video/mp4" /></video>}
                  <span aria-hidden="true" className="photo-open"><ArrowUpRight size={20} /></span>
                </div>
                <div className="mt-4 flex items-start justify-between gap-3"><h3 className="ui font-medium leading-relaxed tracking-normal">{event.name}</h3><span className="media-label shrink-0 pt-1">{event.items.length} {event.items.length === 1 ? "piece" : "pieces"}</span></div>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
