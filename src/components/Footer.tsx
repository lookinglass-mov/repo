import { Link } from "react-router-dom";
import Logo from "./Logo";
import Newsletter from "./Newsletter";
import { site } from "@/data/site";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-pane bg-pane/20">
      <div className="page grid gap-12 py-14 md:grid-cols-[1.2fr_1fr]">
        <div>
          <h2 className="text-3xl font-extrabold sm:text-4xl">New work, by email</h2>
          <p className="mt-3 max-w-md text-muted">
            One email when we add something new.
          </p>
          <div className="mt-6">
            <Newsletter />
          </div>
        </div>
        <div className="flex flex-col justify-between gap-8 md:items-end md:text-right">
          <nav aria-label="Footer" className="ui flex gap-6 font-semibold">
            <Link className="link" to="/services">Services</Link>
            <Link className="link" to="/about">About</Link>
            <Link className="link" to="/portal">Client portal</Link>
          </nav>
          <div>
            <p className="ui mb-4 text-muted">
              <a className="link" href={`mailto:${site.email}`}>{site.email}</a>
              {site.phone && <> · {site.phone}</>}
              {site.location && <> · {site.location}</>}
              {site.social.map((s) => (
                <span key={s.href}> · <a className="link" href={s.href}>{s.label}</a></span>
              ))}
            </p>
            <div className="flex items-center gap-3 md:justify-end">
              <Logo className="h-14 w-14" />
            </div>
            <p className="ui mt-1 text-muted">© {new Date().getFullYear()} Lookinglass</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
