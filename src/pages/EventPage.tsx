import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { events } from "@/data/content";
import Feed from "@/components/Feed";
import NotFound from "./NotFound";

export default function EventPage() {
  const { slug } = useParams();
  const event = events.find((entry) => entry.slug === slug);
  useEffect(() => {
    document.title = event ? `${event.name} | Lookinglass` : "Event not found | Lookinglass";
    return () => { document.title = "Lookinglass | Photographs and film"; };
  }, [event]);
  if (!event) return <NotFound />;
  return (
    <article className="page pt-8 sm:pt-12">
      <Link to="/" className="ui mb-10 inline-flex min-h-11 items-center gap-2 text-muted hover:text-ink"><ArrowLeft size={16} aria-hidden="true" />All events</Link>
      <header className="mb-10 border-b border-pane pb-10">
        <p className="eyebrow mb-4 text-muted">An event by Lookinglass</p>
        <h1 className="max-w-4xl text-4xl font-medium sm:text-6xl">{event.name}</h1>
        <p className="ui mt-5 text-muted">{event.items.length} {event.items.length === 1 ? "piece" : "pieces"} in this collection</p>
      </header>
      <Feed key={event.slug} items={event.items} />
    </article>
  );
}
