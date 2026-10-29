import { Link } from "react-router-dom";
import { site } from "@/data/site";

const work = [
  {
    name: "Photographs",
    text: "Event, portrait and documentary coverage, delivered as an edited set you can use anywhere.",
  },
  {
    name: "Films",
    text: "Short films for brands, venues and community groups, from a single afternoon's shoot to a series.",
  },
];

export default function About() {
  return (
    <div className="page pt-12 sm:pt-16">
      <h1 className="max-w-5xl text-5xl font-extrabold sm:text-7xl">
        A looking glass shows you what is already there.
      </h1>

      <div className="mt-12 grid gap-12 md:grid-cols-[1fr_1.1fr] md:gap-16">
        <div className="frame">
          <img
            src="/media/haight-band-stage.jpg"
            alt="A band playing on a street stage at the Haight Ashbury Street Fair"
            className="aspect-[4/3] h-full w-full object-cover"
          />
        </div>
        <div className="max-w-prose space-y-5 text-lg">
          <p>
            Lookinglass is a media company. We make photographs and films, and
            we make them about people who are usually too busy doing the thing to
            document it.
          </p>
          <p>
            We work close and we work quietly. A barber mid-fade, a singer on a
            sidewalk, two friends in a corridor before a show. We would rather hold
            up a clear picture of a real afternoon than stage a better one.
          </p>
          <p>
            If your block, your band or your brand has an afternoon like that coming,{" "}
            <Link className="link" to="/book">book a consultation</Link> or{" "}
            <a className="link" href={`mailto:${site.email}`}>write to us</a>.
          </p>
        </div>
      </div>

      <section className="mt-20" aria-labelledby="work-title">
        <h2 id="work-title" className="border-b border-pane pb-4 text-3xl font-extrabold sm:text-4xl">
          What we make
        </h2>
        <dl className="grid gap-10 pt-8 md:grid-cols-3">
          {work.map((w) => (
            <div key={w.name}>
              <dt className="font-display text-2xl font-extrabold">{w.name}</dt>
              <dd className="mt-2 text-muted">{w.text}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/services" className="btn">See services</Link>
          <Link to="/" className="btn">See the work</Link>
        </div>
      </section>
    </div>
  );
}
