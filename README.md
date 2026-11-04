# Girgit Studios website

The website for Girgit Studios, a photo and film studio in Sector 49, Noida. Visitors browse the studio sets and book through WhatsApp.

Built with Next.js 16, React 19 and Tailwind CSS 4. Every page is pre-built at build time. The only server code is a small endpoint that copies inquiries to a Google Sheet, and it's optional.

## Run it locally

Needs Node.js 20.9 or newer.

```bash
npm install
npm run dev        # http://localhost:3000, reloads as you edit
npm run build      # production build
npm run start      # serve the production build
```

## Change content

All text and numbers that change live in a few data files. Edit them, and every page that shows them updates.

| What | Where |
|---|---|
| Sets: names, descriptions, specs, photo count | `src/data/sets.ts` |
| Contact details, social links, amenities, booking options and terms, policies | `src/data/studio.ts` |
| Founders on the Our Story page | `src/data/founders.ts` |
| Selected work (Instagram and YouTube links) on the Our Story page | `src/data/work.ts` |

The site shows no prices; visitors ask for rates on WhatsApp.

### Add or update a set

1. Put the photos in `public/images/sets/{slug}/` named `{slug}-01.webp`, `{slug}-02.webp`, … (WebP, about 2400px on the long side). `{slug}` is the set's URL name, for example `green-wall`.
2. Add a 1200×630 JPEG of the cover as `public/images/share/{slug}.jpg`, under 300 KB. It's the photo people see when the link is shared on WhatsApp.
3. Add the set to `src/data/sets.ts`. Set `photos` to the number of photos. Add `cover` if the first photo to show isn't photo 1.

The page `/sets/{slug}`, its gallery, the home-page card, the sitemap and the share preview are all generated from that entry.

### Founders (Our Story page)

The founders on `/our-story` come from `src/data/founders.ts`.

1. Put each portrait in `public/images/founders/` (portrait 4:5, about 1600px tall, WebP) and set `photo`, e.g. `"/images/founders/riya.webp"`. Without a photo, their initials show.
2. Fill in `name`, `role`, the `bio` paragraphs and an optional `quote`.
3. The founders show side by side (stacked on phones), the first on the left. Add or remove founders by adding or removing entries.

### Selected work (Our Story page)

The "Selected work" row on `/our-story` comes from `src/data/work.ts`: one tab per category, with a few links in each. The cards are Instagram's and YouTube's own embeds, so visitors can play a reel or video right on the page.

1. Copy the link: on Instagram, **Share → Copy link** on a post or reel; on YouTube, **Share → Copy**.
2. Paste it into the `links` of a category. Up to 4 per category reads best. Add, remove or reorder categories freely; the first one shows when the page opens.

Only Instagram and YouTube links can be embedded. X (Twitter) and other links won't show, and the tests flag them. Reels set to licensed music (a commercial song) don't play on other websites, so Instagram shows a still with "Watch on Instagram". Pick reels with original audio.

If a post is later deleted, made private, or blocked by the visitor's browser, its card shows a "View on Instagram" link instead, so the page doesn't break. Check the row now and then and swap out dead links.

### Social links

Add them to `socials` in `src/data/studio.ts`. They then appear in the contact section and in Google's business data.

## Inquiries

The contact form opens WhatsApp with the visitor's name, email, shoot date, set, booking length, crew size and notes already typed out.

### Save every inquiry to a Google Sheet (optional)

Each inquiry can also be added as a row to a Google Sheet, so there's a list of leads even if a WhatsApp chat is lost. Set it up once:

1. Create a Google Sheet. In row 1, add the headings: `Received`, `Name`, `Email`, `Shoot date`, `Set`, `Booking`, `Crew`, `Details`.
2. Open **Extensions → Apps Script**, replace the code with the script below and save.
3. Click **Deploy → New deployment**, choose **Web app**, set **Execute as: Me** and **Who has access: Anyone**, then **Deploy**. Copy the web app URL.
4. On the host, set the environment variable `INQUIRY_SHEET_URL` to that URL and redeploy.

Keep the URL private: anyone who has it can add rows. The website only sends it from the server, so visitors never see it.

```js
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  // A leading ' stops Sheets running text that starts like a formula
  const text = (value) => (/^[=+\-@]/.test(value) ? "'" + value : value);
  SpreadsheetApp.getActiveSpreadsheet()
    .getSheets()[0]
    .appendRow([
      new Date(),
      ...["name", "email", "date", "set", "duration", "crew", "details"].map((key) => text(data[key] || "")),
    ]);
  return ContentService.createTextOutput("ok");
}
```

Without `INQUIRY_SHEET_URL`, nothing is saved, and inquiries still go to WhatsApp as normal.

## Deploy

The site is a standard Next.js app with no host-specific features, so it runs on Vercel or on any host that runs `npm run build` and `npm run start`.

- Optionally set `INQUIRY_SHEET_URL` to save inquiries to a Google Sheet (see [Inquiries](#inquiries)).
- Set the environment variable `NEXT_PUBLIC_SITE_URL` to the live address, for example `https://girgitstudios.com`. Share previews, the sitemap and Google's business data use it. On Vercel it falls back to the project's production domain.
- On Vercel, a commercial site needs the Pro plan; the free Hobby plan is for non-commercial use.
- Image resizing (`next/image`) runs on the Next.js server. Vercel and any Node host handle it as is. Some other platforms need their own image service configured.

## Tests

End-to-end tests in `e2e/` check every page in Chrome, Firefox and WebKit (Safari's engine), at desktop, tablet and phone sizes.

```bash
npx playwright install firefox webkit   # once; Chrome is used from your system
npm run test:e2e                        # builds the site, then runs every test
npx playwright show-report              # open the last report
```

## Browser support

The site works in current versions of Chrome, Edge, Safari (iOS 16.4+) and Firefox. Motion effects are optional extras:

- **Scroll fade-ins** use CSS scroll-driven animations. In browsers without them, content simply appears.
- **The photo morph** between a set card and its page uses View Transitions. In browsers without them, the page changes normally.
- **Reduced motion:** visitors who turn on "reduce motion" get no intro, autoplay or animations.
