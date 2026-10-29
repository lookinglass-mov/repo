import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/BookingDetails";
import { inputClass } from "@/components/Form";
import { useAuth } from "@/lib/auth";
import { statusLabel, supabase, timeLabel, type Booking, type BookingStatus } from "@/lib/supabase";

const statuses = Object.keys(statusLabel) as BookingStatus[];

// datetime-local wants "YYYY-MM-DDTHH:mm" in local time.
const toLocalInput = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

function BookingEditor({ booking, onChange }: { booking: Booking; onChange: () => void }) {
  const [status, setStatus] = useState(booking.status);
  const [scheduled, setScheduled] = useState(toLocalInput(booking.scheduled_at));
  const [note, setNote] = useState(booking.admin_note ?? "");
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const save = async () => {
    const { error } = await supabase
      .from("bookings")
      .update({
        status,
        scheduled_at: scheduled ? new Date(scheduled).toISOString() : null,
        admin_note: note.trim() || null,
      })
      .eq("id", booking.id);
    setMsg(error ? error.message : "Saved.");
    if (!error) onChange();
  };

  const addDeliverable = async (e: FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !/^https?:\/\//.test(url)) return setMsg("Add a label and a link starting with https://");
    const { error } = await supabase.from("deliverables").insert({ booking_id: booking.id, label: label.trim(), url: url.trim() });
    if (error) return setMsg(error.message);
    setLabel("");
    setUrl("");
    setMsg("Link added.");
    onChange();
  };

  const removeDeliverable = async (id: string) => {
    const { error } = await supabase.from("deliverables").delete().eq("id", id);
    if (error) setMsg(error.message);
    else onChange();
  };

  const b = booking;
  return (
    <li className="rounded-md border border-pane p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-2xl font-extrabold">{b.name}</h3>
          <p className="ui mt-1">
            <a className="link" href={`mailto:${b.email}`}>{b.email}</a>
            {b.phone && <> · <a className="link" href={`tel:${b.phone}`}>{b.phone}</a></>}
          </p>
        </div>
        <StatusBadge status={b.status} />
      </div>
      <p className="ui mt-3 text-muted">
        {b.services?.name ?? "Not sure yet"} · prefers {b.preferred_date ?? "any date"}
        {b.preferred_time && `, ${timeLabel[b.preferred_time].toLowerCase()}`} · requested{" "}
        {new Date(b.created_at).toLocaleDateString()}
        {!b.user_id && " · guest request"}
      </p>
      {b.notes && <p className="mt-3 whitespace-pre-line">{b.notes}</p>}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="ui font-semibold">
          Status
          <select className={`${inputClass} mt-1`} value={status} onChange={(e) => setStatus(e.target.value as BookingStatus)}>
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="ui font-semibold">
          Scheduled for
          <input type="datetime-local" className={`${inputClass} mt-1`} value={scheduled} onChange={(e) => setScheduled(e.target.value)} />
        </label>
        <label className="ui font-semibold sm:col-span-2">
          Note to the client
          <textarea rows={2} className={`${inputClass} mt-1`} value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
      </div>
      <button onClick={save} className="btn mt-4">Save</button>

      <div className="mt-6 border-t border-pane pt-4">
        <p className="ui font-semibold">Deliverable links</p>
        <ul className="mt-2 space-y-1">
          {b.deliverables?.map((d) => (
            <li key={d.id} className="ui flex items-center gap-2">
              <a href={d.url} target="_blank" rel="noreferrer" className="link">{d.label}</a>
              <button onClick={() => removeDeliverable(d.id)} aria-label={`Remove ${d.label}`} className="rounded-full p-1 hover:bg-pane">
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
        <form onSubmit={addDeliverable} className="mt-3 flex flex-wrap gap-2">
          <input aria-label="Link label" placeholder="Label, e.g. Final gallery" className={`${inputClass} sm:w-56`} value={label} onChange={(e) => setLabel(e.target.value)} />
          <input aria-label="Link URL" placeholder="https://" className={`${inputClass} flex-1`} value={url} onChange={(e) => setUrl(e.target.value)} />
          <button type="submit" className="btn">Add link</button>
        </form>
      </div>
      {msg && <p role="status" className="ui mt-3 text-violet">{msg}</p>}
    </li>
  );
}

export default function Admin() {
  const { session, isAdmin, loading } = useAuth();
  const [tab, setTab] = useState<"bookings" | "newsletter">("bookings");
  const [filter, setFilter] = useState<BookingStatus | "all">("requested");
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [subscribers, setSubscribers] = useState<{ email: string; created_at: string }[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isAdmin) return;
    let q = supabase.from("bookings").select("*, services(name), deliverables(*)").order("created_at", { ascending: false });
    if (filter !== "all") q = q.eq("status", filter);
    const [b, s] = await Promise.all([
      q,
      supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false }),
    ]);
    if (b.error || s.error) setError((b.error ?? s.error)!.message);
    setBookings(b.data as Booking[]);
    setSubscribers(s.data);
  }, [isAdmin, filter]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <p className="page ui py-24 text-muted">Loading…</p>;
  if (!session) return <Navigate to="/signin" replace />;
  if (!isAdmin) return <Navigate to="/portal" replace />;

  const tabClass = (t: string) =>
    `ui py-1 font-semibold border-b-2 ${tab === t ? "border-violet" : "border-transparent hover:border-pane"}`;

  return (
    <div className="page pt-12 sm:pt-16">
      <h1 className="text-5xl font-extrabold sm:text-6xl">Admin</h1>
      <div role="tablist" className="mt-8 flex gap-8 border-b border-pane">
        <button role="tab" aria-selected={tab === "bookings"} className={tabClass("bookings")} onClick={() => setTab("bookings")}>
          Bookings
        </button>
        <button role="tab" aria-selected={tab === "newsletter"} className={tabClass("newsletter")} onClick={() => setTab("newsletter")}>
          Newsletter ({subscribers?.length ?? "…"})
        </button>
      </div>
      {error && <p className="ui mt-6 text-violet">{error}</p>}

      {tab === "bookings" ? (
        <>
          <div className="mt-6 flex flex-wrap gap-2">
            {(["all", ...statuses] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`ui rounded-full px-4 py-1.5 font-semibold ${filter === s ? "bg-ink text-paper" : "border border-ink/25 hover:border-violet"}`}
              >
                {s}
              </button>
            ))}
          </div>
          {bookings?.length === 0 && <p className="mt-8 text-muted">No {filter === "all" ? "" : filter} bookings.</p>}
          <ul className="mt-8 space-y-6">
            {bookings?.map((b) => (
              // key includes updated fields so the editor resets after a save or filter change
              <BookingEditor key={`${b.id}-${b.status}-${b.scheduled_at}-${b.admin_note}`} booking={b} onChange={load} />
            ))}
          </ul>
        </>
      ) : (
        <div className="mt-6">
          {!!subscribers?.length && (
            <button
              className="btn"
              onClick={() => navigator.clipboard.writeText(subscribers.map((s) => s.email).join("\n"))}
            >
              Copy all addresses
            </button>
          )}
          <ul className="ui mt-6 divide-y divide-pane">
            {subscribers?.map((s) => (
              <li key={s.email} className="flex justify-between py-2">
                <span>{s.email}</span>
                <span className="text-muted">{new Date(s.created_at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
