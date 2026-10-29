# Lookinglass

Site for Lookinglass, a media services company: photographs and films,
quote-only services, consultation requests and a client portal.
Modelled on Lovable's Voyager blog template (React, TypeScript, Tailwind,
Lucide icons, dark mode, photo lightbox), with Supabase
for the database, sign-in, bookings and the newsletter.

## Run it

```sh
cp .env.example .env   # public Supabase URL and publishable key
npm install
npm run dev      # http://localhost:8080
npm run build    # type-checks, then builds to dist/
```

## Where things live

| Path | What it is |
| --- | --- |
| `public/media/` | Photographs, videos and the logo |
| `src/data/site.ts` | Contact email, phone, location, social links (placeholders) |
| `src/data/content.ts` | Every photograph and video on the home page, each with a short caption |
| `src/index.css` | Colour tokens (light and dark) and the wordmark reflection |
| `tailwind.config.ts` | Fonts and colour names |
| `src/components/` | Header, footer, wordmark, logo, feed, lightbox, newsletter, forms |
| `src/pages/` | Home, Services, Book, SignIn, Portal, Admin, About, NotFound |
| `src/lib/` | Supabase client and types, auth context, services hook |
| `supabase/migrations/` | Database schema and row-level security. Changes go here |

## How it works

- **Services** (`/services`) are read from the `services` table. They are
  quote-only: no prices. Edit names, summaries and "includes" in the table.
- **Book** (`/book`) saves a consultation request to `bookings` with status
  `requested`. Guests can request; nobody can set the status or schedule.
  The team reaches out personally, then confirms in the admin view.
- **Client portal** (`/portal`) uses an emailed magic link. Clients see every
  booking made under their account or their email address (so guest requests
  show up once they sign in), its status, any note from the team, and
  deliverable links. They can cancel a booking while it is still a request.
- **Admin** (`/admin`) is for emails listed in the `admins` table. It lists all
  bookings by status, sets status, scheduled time and a note to the client,
  adds or removes deliverable links, and lists newsletter subscribers.
- **Newsletter** addresses go to `newsletter_subscribers`.

Supabase project: `lookinglass` (`vcasrnnmcabqbrrenmdp`, us-west-1) in
"lookinglass-mov's Org". The publishable key is safe in the browser; never put
the service-role key in this repo.

## Before you publish

- In Supabase **Authentication → URL Configuration**, set the Site URL to the
  live domain and add `http://localhost:8080/**` and the live domain to the
  redirect URLs, or magic links send people to the wrong place.
- Supabase's built-in mailer only sends to the org's team members and is
  rate-limited. Add custom SMTP (for example Resend) under
  **Authentication → Emails** before clients sign in.
- There are no email notifications for new bookings yet; check `/admin`.
- Replace the placeholders in `src/data/site.ts`.
- The captions in `src/data/content.ts` are draft. Replace names, places and details with the real ones.
- Confirm you have the rights and releases for every photo and video,
  especially the pictures that include children.

## Hosting

Any static host works. Add a rewrite of all routes to `/index.html`, and set
`VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` at build time.

## 21st.dev CLI

Install once with `npm i -g @21st-dev/cli`, then run `21st login` on your
local machine. Check the saved session with `21st whoami`.

From this project, forward CLI commands with `npm run 21st -- <command>`.
For example: `npm run 21st -- search "photo gallery"`.

In CI, install the CLI and supply `API_KEY_21ST` through the CI secret store
as an environment variable; skip interactive login. The CLI reads this variable
automatically. You can also pass it explicitly:

```sh
21st whoami --api-key "$API_KEY_21ST"
```

PowerShell equivalent: `21st whoami --api-key "$env:API_KEY_21ST"`.
Never commit the key or prefix it with `VITE_` (which exposes values in the browser).