import { useEffect, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Field, FormError, inputClass, isEmail } from "@/components/Form";
import { useAuth } from "@/lib/auth";
import { supabase, timeLabel, type TimeOfDay } from "@/lib/supabase";
import { useServices } from "@/lib/useServices";

const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
};

export default function Book() {
  const [params] = useSearchParams();
  const { session } = useAuth();
  const { services } = useServices();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service_slug: params.get("service") ?? "",
    preferred_date: "",
    preferred_time: "" as TimeOfDay | "",
    notes: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");

  useEffect(() => {
    const email = session?.user.email;
    if (email) setForm((f) => (f.email ? f : { ...f, email }));
  }, [session]);

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Tell us your name.");
    if (!isEmail(form.email)) return setError("Enter a full email address, like you@example.com.");
    setError(null);
    setState("sending");
    // No .select(): guests can't read bookings back, only create them.
    const { error } = await supabase.from("bookings").insert({
      user_id: session?.user.id ?? null,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim() || null,
      service_slug: form.service_slug || null,
      preferred_date: form.preferred_date || null,
      preferred_time: form.preferred_time || null,
      notes: form.notes.trim() || null,
    });
    if (error) {
      setState("idle");
      return setError(`Your request didn't go through: ${error.message}`);
    }
    setState("done");
  };

  if (state === "done") {
    return (
      <div className="page py-16 sm:py-24">
        <h1 className="text-5xl font-extrabold sm:text-7xl">Request received</h1>
        <p className="mt-6 max-w-prose text-xl">
          Thank you, {form.name.split(" ")[0]}. We'll reach out personally at {form.email} to talk
          it through and confirm a time.
        </p>
        <p className="mt-4 max-w-prose text-muted">
          {session
            ? "You can follow it in your client portal."
            : `Sign in to the client portal with ${form.email} to follow your booking.`}
        </p>
        <Link to={session ? "/portal" : "/signin"} className="btn mt-8">
          {session ? "Open the portal" : "Sign in to the portal"}
        </Link>
      </div>
    );
  }

  return (
    <div className="page grid gap-12 pt-12 sm:pt-16 md:grid-cols-[1fr_1.3fr] md:gap-16">
      <div>
        <h1 className="text-5xl font-extrabold sm:text-7xl">Book a consultation</h1>
        <p className="mt-6 max-w-prose text-xl">
          Tell us about your project and when suits you. This is a request, not a fixed slot: we
          reach out personally, talk it through, then confirm.
        </p>
        <div className="frame mt-10 hidden aspect-[4/5] md:block">
          <img
            src="/media/fresh-day-02.jpg"
            alt="A barber picks a clipper guard from a table while his client waits"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field id="b-name" label="Name">
            <input id="b-name" className={inputClass} value={form.name} onChange={set("name")} autoComplete="name" required />
          </Field>
          <Field id="b-email" label="Email">
            <input id="b-email" type="email" className={inputClass} value={form.email} onChange={set("email")} autoComplete="email" required />
          </Field>
        </div>
        <Field id="b-phone" label="Phone" hint="Optional, if you'd rather we call">
          <input id="b-phone" type="tel" className={inputClass} value={form.phone} onChange={set("phone")} autoComplete="tel" />
        </Field>
        <Field id="b-service" label="What are you interested in?">
          <select id="b-service" className={inputClass} value={form.service_slug} onChange={set("service_slug")}>
            <option value="">Not sure yet</option>
            {services?.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field id="b-date" label="Preferred date" hint="For the consultation call">
            <input id="b-date" type="date" min={tomorrow()} className={inputClass} value={form.preferred_date} onChange={set("preferred_date")} />
          </Field>
          <Field id="b-time" label="Time of day" hint="Roughly">
            <select id="b-time" className={inputClass} value={form.preferred_time} onChange={set("preferred_time")}>
              <option value="">Any time</option>
              {(Object.keys(timeLabel) as TimeOfDay[]).map((t) => (
                <option key={t} value={t}>
                  {timeLabel[t]}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field id="b-notes" label="About your project" hint="What, where, roughly when, and anything else we should know">
          <textarea id="b-notes" rows={6} maxLength={4000} className={inputClass} value={form.notes} onChange={set("notes")} />
        </Field>
        {error && <FormError>{error}</FormError>}
        <button type="submit" className="btn" disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : "Send request"}
        </button>
      </form>
    </div>
  );
}
