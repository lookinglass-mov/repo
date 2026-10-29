-- Lookinglass: services, consultation requests, deliverables, newsletter.
-- Bookings are requests; the team reaches out personally, then confirms.

-- Admins are listed by email so the list can be set before they sign in.
create table public.admins (
  email text primary key check (email = lower(email))
);
alter table public.admins enable row level security;
-- No policies: only is_admin() (security definer) reads it.

insert into public.admins (email) values ('info.pandosolutions@gmail.com');

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- Services are quote-only: no prices.
create table public.services (
  slug text primary key,
  name text not null,
  summary text not null,
  includes text[] not null default '{}',
  sort int not null default 0,
  active boolean not null default true
);
alter table public.services enable row level security;

create policy "Anyone can read active services" on public.services
  for select to anon, authenticated using (active or (select public.is_admin()));
create policy "Admins manage services" on public.services
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

insert into public.services (slug, name, summary, includes, sort) values
  ('portraits-brand', 'Portraits & brand photos',
   'People, teams, products and the places they work, photographed as they are.',
   array['A planning call before the shoot', 'On location or in a space you choose',
         'An edited set of high-resolution images', 'Licensed for web, print and social'],
   1),
  ('short-films', 'Short films',
   'Films for brands, venues and community groups, from a single afternoon''s shoot to a series.',
   array['Concept and shot planning', 'Filming with sound', 'Edit, colour and music',
         'Cuts sized for web and social'],
   2);

create type public.booking_status as enum ('requested', 'confirmed', 'completed', 'cancelled', 'declined');
create type public.time_of_day as enum ('morning', 'afternoon', 'evening');

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  name text not null check (length(name) between 1 and 200),
  email text not null check (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone text check (length(phone) <= 50),
  service_slug text references public.services (slug),
  preferred_date date,
  preferred_time public.time_of_day,
  notes text check (length(notes) <= 4000),
  status public.booking_status not null default 'requested',
  scheduled_at timestamptz,          -- set by the team once agreed with the client
  admin_note text,                   -- shown to the client
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index bookings_user_id_idx on public.bookings (user_id);
create index bookings_email_idx on public.bookings (lower(email));
create index bookings_service_slug_idx on public.bookings (service_slug);
alter table public.bookings enable row level security;

-- Guests and signed-in clients can request; they cannot pick status or schedule.
create policy "Anyone can request a consultation" on public.bookings
  for insert to anon, authenticated
  with check (
    status = 'requested' and scheduled_at is null and admin_note is null
    and (user_id is null or user_id = (select auth.uid()))
  );
-- Clients see bookings made under their account or their email address.
create policy "Clients see their bookings" on public.bookings
  for select to authenticated
  using (
    user_id = (select auth.uid())
    or lower(email) = lower(coalesce((select auth.jwt() ->> 'email'), ''))
    or (select public.is_admin())
  );
create policy "Admins update bookings" on public.bookings
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create trigger bookings_touch before update on public.bookings
  for each row execute function public.touch_updated_at();

-- Clients may cancel their own booking while it is still a request.
create or replace function public.cancel_booking(booking_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.bookings b set status = 'cancelled'
  where b.id = booking_id
    and b.status = 'requested'
    and (b.user_id = auth.uid()
         or lower(b.email) = lower(coalesce(auth.jwt() ->> 'email', '')));
  if not found then
    raise exception 'Booking not found or can no longer be cancelled';
  end if;
end;
$$;
revoke execute on function public.cancel_booking(uuid) from public, anon;
grant execute on function public.cancel_booking(uuid) to authenticated;

-- Links to finished work (galleries, film downloads), attached by the team.
create table public.deliverables (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete cascade,
  label text not null check (length(label) between 1 and 200),
  url text not null check (url ~ '^https?://'),
  created_at timestamptz not null default now()
);
create index deliverables_booking_id_idx on public.deliverables (booking_id);
alter table public.deliverables enable row level security;

create policy "Clients see deliverables for their bookings" on public.deliverables
  for select to authenticated
  using (exists (select 1 from public.bookings b where b.id = booking_id));  -- bookings RLS applies
create policy "Admins manage deliverables" on public.deliverables
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create table public.newsletter_subscribers (
  email text primary key check (email = lower(email) and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  created_at timestamptz not null default now()
);
alter table public.newsletter_subscribers enable row level security;

create policy "Anyone can subscribe" on public.newsletter_subscribers
  for insert to anon, authenticated with check (true);
create policy "Admins read subscribers" on public.newsletter_subscribers
  for select to authenticated using ((select public.is_admin()));
