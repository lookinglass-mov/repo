import { ExternalLink } from "lucide-react";
import { statusLabel, timeLabel, type Booking } from "@/lib/supabase";

const dateFmt = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });
const dateTimeFmt = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });

// preferred_date is a plain date; parse it as local so it doesn't shift a day.
const localDate = (d: string) => dateFmt.format(new Date(`${d}T00:00`));

const tone: Record<Booking["status"], string> = {
  requested: "bg-poppy/20",
  confirmed: "bg-violet text-white",
  completed: "bg-pane",
  cancelled: "bg-pane text-muted",
  declined: "bg-pane text-muted",
};

export function StatusBadge({ status }: { status: Booking["status"] }) {
  return <span className={`ui rounded-full px-3 py-1 font-semibold ${tone[status]}`}>{statusLabel[status]}</span>;
}

export default function BookingDetails({ booking: b }: { booking: Booking }) {
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-2xl font-extrabold">{b.services?.name ?? "Consultation"}</h3>
        <StatusBadge status={b.status} />
      </div>
      <dl className="ui mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-[auto_1fr]">
        {b.scheduled_at && (
          <>
            <dt className="text-muted">Scheduled</dt>
            <dd className="font-semibold">{dateTimeFmt.format(new Date(b.scheduled_at))}</dd>
          </>
        )}
        {(b.preferred_date || b.preferred_time) && (
          <>
            <dt className="text-muted">You asked for</dt>
            <dd>
              {b.preferred_date ? localDate(b.preferred_date) : "Any date"}
              {b.preferred_time && `, ${timeLabel[b.preferred_time].toLowerCase()}`}
            </dd>
          </>
        )}
        <dt className="text-muted">Requested</dt>
        <dd>{dateFmt.format(new Date(b.created_at))}</dd>
      </dl>
      {b.notes && <p className="mt-4 whitespace-pre-line text-muted">{b.notes}</p>}
      {b.admin_note && (
        <p className="mt-4 rounded-md border-l-4 border-violet bg-pane/50 px-4 py-3">
          <span className="ui block font-semibold">From Lookinglass</span>
          {b.admin_note}
        </p>
      )}
      {!!b.deliverables?.length && (
        <div className="mt-5">
          <p className="ui font-semibold">Your files</p>
          <ul className="mt-2 space-y-1">
            {b.deliverables.map((d) => (
              <li key={d.id}>
                <a href={d.url} target="_blank" rel="noreferrer" className="link inline-flex items-center gap-1.5">
                  {d.label} <ExternalLink size={14} aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
