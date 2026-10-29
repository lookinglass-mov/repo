import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { useServices } from "@/lib/useServices";

const images: Record<string, { src: string; alt: string }> = {
  "portraits-brand": {
    src: "/media/backstage-embrace.jpg",
    alt: "Two friends embrace in a backstage corridor",
  },
  "short-films": {
    src: "/media/film-reel-poster.jpg",
    alt: "A still from a Lookinglass film reel",
  },
};

export default function Services() {
  const { services, error } = useServices();

  return (
    <div className="page pt-12 sm:pt-16">
      <h1 className="max-w-4xl text-5xl font-extrabold sm:text-7xl">Work with us</h1>
      <p className="mt-6 max-w-prose text-xl">
        Every job is a little different, so we quote each one. Tell us what you have in
        mind and we will reach out personally to talk it through.
      </p>

      {error && <p className="ui mt-10 text-violet">Services could not load: {error}</p>}
      {!services && !error && <p className="ui mt-10 text-muted">Loading services…</p>}

      <div className="mt-14 space-y-20">
        {services?.map((s, i) => (
          <section
            key={s.slug}
            aria-labelledby={`svc-${s.slug}`}
            className="grid items-center gap-8 md:grid-cols-2 md:gap-16"
          >
            {images[s.slug] && (
              <div className={`frame aspect-[4/3] ${i % 2 ? "md:order-2" : ""}`}>
                <img src={images[s.slug].src} alt={images[s.slug].alt} className="h-full w-full object-cover" />
              </div>
            )}
            <div>
              <h2 id={`svc-${s.slug}`} className="text-4xl font-extrabold sm:text-5xl">
                {s.name}
              </h2>
              <p className="mt-4 text-lg">{s.summary}</p>
              <ul className="mt-6 space-y-2">
                {s.includes.map((item) => (
                  <li key={item} className="flex gap-3">
                    <Check size={20} className="mt-1 shrink-0 text-violet" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="ui mt-6 text-muted">Priced by quote</p>
              <Link to={`/book?service=${s.slug}`} className="btn mt-3">
                Request a quote
              </Link>
            </div>
          </section>
        ))}
      </div>

      <section className="mt-24 border-t border-pane pt-10">
        <h2 className="text-3xl font-extrabold sm:text-4xl">How it works</h2>
        <ol className="mt-8 grid gap-10 md:grid-cols-3">
          {[
            ["Request", "Send a consultation request with a rough date and what you're after."],
            ["We reach out", "We call or email you to talk it through, then send a quote."],
            ["Confirmed", "Once agreed, your booking is confirmed and shows in your client portal."],
          ].map(([t, d], n) => (
            <li key={t}>
              <p className="ui font-semibold text-violet">0{n + 1}</p>
              <p className="mt-1 font-display text-2xl font-extrabold">{t}</p>
              <p className="mt-2 text-muted">{d}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
