import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import EventGrid from "@/components/EventGrid";
import LiquidWordmark from "@/components/LiquidWordmark";

export default function Home() {
  return (
    <>
      <div className="page pb-2 pt-10 sm:pt-14">
        <h1 className="mx-auto w-full max-w-lg">
          <LiquidWordmark />
        </h1>
      </div>
      <section className="page pt-10 sm:pt-14" aria-label="Photographs and video">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-pane pb-6">
          <p className="eyebrow flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-violet" />Independent media studio</p>
          <p className="ui text-muted">Photography <span className="mx-2 text-violet">/</span> Film <span className="mx-2 text-violet">/</span> People</p>
        </div>
        <EventGrid />
      </section>
      <section className="page mt-20 sm:mt-28" aria-labelledby="work-with-us">
        <div className="studio-callout grid items-end gap-10 rounded-2xl border border-pane bg-pane/25 p-7 sm:p-12 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="eyebrow mb-6 text-muted">A good story starts with a conversation</p>
            <h2 id="work-with-us" className="max-w-xl text-4xl font-medium sm:text-6xl">Let’s make something<br /><span className="font-serif italic">worth keeping.</span></h2>
            <p className="mt-6 max-w-md text-base text-muted">Portraits, brand photography, and short films. Thoughtfully made, personally quoted.</p>
          </div>
          <div className="flex flex-col items-start gap-5 md:items-end">
            <Link to="/book" className="btn">Start a conversation <ArrowUpRight size={18} aria-hidden="true" /></Link>
            <Link to="/services" className="ui link inline-flex min-h-11 items-center">Explore our services</Link>
          </div>
        </div>
      </section>
    </>
  );
}
