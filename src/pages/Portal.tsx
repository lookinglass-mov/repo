import { useCallback, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import BookingDetails from "@/components/BookingDetails";
import { signOut, useAuth } from "@/lib/auth";
import { supabase, type Booking } from "@/lib/supabase";

export default function Portal() {
  const { session, isAdmin, loading } = useAuth();
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const email = session?.user.email?.toLowerCase();
    if (!session || !email) return;
    // RLS would let an admin see everyone's bookings, so filter to this client explicitly.
    const { data, error } = await supabase
      .from("bookings")
      .select("*, services(name), deliverables(*)")
      .or(`user_id.eq.${session.user.id},email.eq."${email}"`)
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setBookings(data as Booking[]);
  }, [session]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <p className="page ui py-24 text-muted">Loading…</p>;
  if (!session) return <Navigate to="/signin" replace />;

  const cancel = async (id: string) => {
    if (!window.confirm("Cancel this request?")) return;
    const { error } = await supabase.rpc("cancel_booking", { booking_id: id });
    if (error) setError(error.message);
    else load();
  };

  return (
    <div className="page pt-12 sm:pt-16">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-pane pb-6">
        <div>
          <h1 className="text-5xl font-extrabold sm:text-6xl">Your bookings</h1>
          <p className="ui mt-3 text-muted">Signed in as {session.user.email}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {isAdmin && (
            <Link to="/admin" className="btn">
              Admin
            </Link>
          )}
          <Link to="/book" className="btn">
            New request
          </Link>
          <button onClick={() => signOut()} className="ui rounded-full border border-ink/25 px-5 py-2.5 font-semibold hover:border-violet">
            Sign out
          </button>
        </div>
      </div>

      {error && <p className="ui mt-6 text-violet">{error}</p>}
      {!bookings && !error && <p className="ui mt-10 text-muted">Loading bookings…</p>}
      {bookings?.length === 0 && (
        <div className="mt-10">
          <p className="text-xl">No bookings under {session.user.email} yet.</p>
          <Link to="/book" className="btn mt-6">
            Book a consultation
          </Link>
        </div>
      )}

      <ul className="mt-10 space-y-6">
        {bookings?.map((b) => (
          <li key={b.id} className="rounded-md border border-pane p-6">
            <BookingDetails booking={b} />
            {b.status === "requested" && (
              <button onClick={() => cancel(b.id)} className="ui link mt-5 font-semibold">
                Cancel request
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
