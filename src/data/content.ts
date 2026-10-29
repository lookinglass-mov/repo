// Everything on the home page lives here: photographs and videos, each with a
// short caption. Add a new piece by adding one line to the top of `content`
// (newest first) and dropping the file into public/media/.

export interface Item {
  id: string;
  type: "photo" | "video";
  src: string;
  alt: string; // describes the picture for screen readers
  caption?: string; // the event name, e.g. "So Fresh City"; leave out if unknown
  portrait?: boolean;
  width?: number;
  height?: number;
  poster?: string; // videos only
}

const m = (file: string) => `/media/${file}`;
const fair = "Haight Ashbury Street Fair";
const fresh = "So Fresh City";

export const content: Item[] = [
  {
    id: "haight-skate-rail",
    type: "photo",
    src: m("haight-skate-rail.jpg"),
    width: 1351,
    height: 2400,
    alt: "A skateboarder in mid-air above a metal barrier while a crowd watches from the street",
    caption: fair,
    portrait: true,
  },
  {
    id: "haight-band-street",
    type: "photo",
    src: m("haight-band-street.jpg"),
    width: 2400,
    height: 1350,
    alt: "A five-piece band plays on a low wooden stage in front of Victorian houses, with a QR code sign in front",
    caption: fair,
  },
  {
    id: "haight-band-stage",
    type: "photo",
    src: m("haight-band-stage.jpg"),
    width: 2400,
    height: 1350,
    alt: "A singer, guitarist, bassist, drummer and keyboard player on a street stage beside a graffiti banner",
    caption: fair,
  },
  {
    id: "haight-main-stage",
    type: "photo",
    src: m("haight-main-stage.jpg"),
    width: 2400,
    height: 1350,
    alt: "Two musicians in white jumpsuits play keys and sing on a stage built from a truck, with speaker stacks beside them",
    caption: fair,
  },
  {
    id: "fresh-day-05",
    type: "photo",
    src: m("fresh-day-05.jpg"),
    width: 2304,
    height: 1296,
    alt: "A barber trims a seated man's hair under a white canopy while families gather at craft tables behind them",
    caption: fresh,
  },
  {
    id: "fresh-day-02",
    type: "photo",
    src: m("fresh-day-02.jpg"),
    width: 2304,
    height: 1296,
    alt: "A barber in a black tank top picks a guard from a table of clippers while his client waits in a cape",
    caption: fresh,
  },
  {
    id: "fresh-day-06",
    type: "photo",
    src: m("fresh-day-06.jpg"),
    width: 2304,
    height: 1296,
    alt: "A singer with a microphone in front of a drummer, a guitarist and a percussionist",
    caption: fresh,
  },
  {
    id: "backstage-embrace",
    type: "photo",
    src: m("backstage-embrace.jpg"),
    width: 1080,
    height: 1350,
    alt: "Two people hug in a backstage corridor, one in a purple jumpsuit, the other smiling with eyes closed",
    caption: "Kamaiyah x A$AP Ferg",
    portrait: true,
  },
  {
    id: "fresh-day-01",
    type: "photo",
    src: m("fresh-day-01.jpg"),
    width: 2304,
    height: 1296,
    alt: "A stylist curls a young girl's fringe with a curling iron",
    caption: fresh,
  },
  {
    id: "film-reel",
    type: "video",
    src: m("film-reel.mp4"),
    poster: m("film-reel-poster.jpg"),
    alt: "A dim bar top with glasses of whiskey being poured",
  },
  {
    id: "river-poppies",
    type: "photo",
    src: m("river-poppies.jpg"),
    width: 1440,
    height: 1800,
    alt: "Seen from behind, a person in a cap sits on a rock above a rushing river, poppies printed on the back of their shirt",
    portrait: true,
  },
  {
    id: "fresh-day-03",
    type: "photo",
    src: m("fresh-day-03.jpg"),
    width: 2304,
    height: 1296,
    alt: "Two stylists work side by side, one on a boy in a red cape and one on a seated woman",
    caption: fresh,
  },
  {
    id: "fresh-day-04",
    type: "photo",
    src: m("fresh-day-04.jpg"),
    width: 2304,
    height: 1296,
    alt: "Two adults stand watching as a stylist combs a girl's hair",
    caption: fresh,
  },
];

export const photos = content.filter((i) => i.type === "photo");

export interface MediaEvent {
  slug: string;
  name: string;
  items: Item[];
  cover: Item;
}

// Matching captions share one event. Uncaptioned pieces retain their own gallery.
const grouped = new Map<string, MediaEvent>();
const usedSlugs = new Set<string>();
for (const item of content) {
  const name = item.caption?.trim() || (item.type === "video" ? "A moment in motion" : "Personal work");
  const key = item.caption?.trim() ? `event:${name}` : `piece:${item.id}`;
  const existing = grouped.get(key);
  if (existing) {
    existing.items.push(item);
  } else {
    const base = name.toLowerCase().replace(/\$/g, "s").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    let slug = base || item.id;
    if (usedSlugs.has(slug)) slug = `${slug}-${item.id}`;
    usedSlugs.add(slug);
    grouped.set(key, { slug, name, items: [item], cover: item });
  }
}
// Explicit covers stay stable when the gallery order changes.
const eventCovers: Record<string, string> = { "so-fresh-city": "fresh-day-04" };
export const events: MediaEvent[] = Array.from(grouped.values()).map((event) => ({
  ...event,
  cover: event.items.find((item) => item.id === eventCovers[event.slug]) ?? event.cover,
}));
