import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

if (!url || !key) {
  throw new Error("Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env (see .env.example).");
}

export const supabase = createClient(url, key);

export type BookingStatus = "requested" | "confirmed" | "completed" | "cancelled" | "declined";
export type TimeOfDay = "morning" | "afternoon" | "evening";

export interface Service {
  slug: string;
  name: string;
  summary: string;
  includes: string[];
  sort: number;
  active: boolean;
}

export interface Deliverable {
  id: string;
  booking_id: string;
  label: string;
  url: string;
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  service_slug: string | null;
  preferred_date: string | null;
  preferred_time: TimeOfDay | null;
  notes: string | null;
  status: BookingStatus;
  scheduled_at: string | null;
  admin_note: string | null;
  created_at: string;
  deliverables?: Deliverable[];
  services?: { name: string } | null;
}

export const statusLabel: Record<BookingStatus, string> = {
  requested: "Requested, we'll be in touch",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  declined: "Declined",
};

export const timeLabel: Record<TimeOfDay, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};
