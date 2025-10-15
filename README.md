# Event Countdown (Static)

A single-file static countdown page you can host anywhere. Configure it by editing `index.html` — no build tools required.

## Quick Start

- Open `static-site/index.html` in any browser.
- Edit the `<body>` element’s data attributes to configure your countdown.

```html
<body
  data-deadline="2024-12-31T23:59:59Z"
  data-title="Event Countdown"
  data-subtitle="Counting down to the big moment"
  data-done="It's Time!"
  data-confetti="true"
  data-accent="#2563eb"
  data-bg="./bg.jpg"
></body>
```

## Configuration (via data attributes)

- `data-deadline` (required)
  - Recommended: ISO 8601 with timezone, e.g. `2025-05-01T09:00:00Z` or `2025-05-01T09:00:00+05:00`.
  - Also supported: `YYYYMMDDHHmmss` (interpreted as local time in the viewer’s timezone), e.g. `20250501090000`.
- `data-title`: Large heading text at the top.
- `data-subtitle`: Small subheading under the title.
- `data-done`: Message shown when countdown reaches zero (replaces the timer grid).
- `data-confetti`: Set to `true` to fire a one-time confetti celebration when the countdown completes.
- `data-accent`: A CSS color string to theme the timer (e.g. `#16a34a`, `rgb(37,99,235)`, or `hsl(220 90% 56%)`).
- `data-bg`: URL/path to a background image. The path is resolved relative to `index.html`.

No changes to `main.js` are needed for typical customization — it reads these attributes automatically.

## Optional: Target Date Display

There is an optional visual display of the target date in the markup:

```html
<div class="date">
  Target: <span id="date-text">Dec 31, 2024, 23:59</span>
  <!-- You can comment this whole block out if you don't want to show it. -->
  <!-- The countdown still works without it. -->
  <!-- If shown, the script updates #date-text automatically from data-deadline. -->
</div>
```

- You can safely comment this block out (or remove it) if you don’t want to show the target date. The countdown still works.
- If present, the script will overwrite `#date-text` with a formatted version of `data-deadline` at runtime.

## Deadline Format Tips

- Prefer ISO with timezone to avoid confusion (`Z` = UTC). Examples:
  - `2025-01-15T18:30:00Z` (UTC)
  - `2025-01-15T18:30:00+05:00` (UTC+5)
- If you use `YYYYMMDDHHmmss`, it is treated as a local time on the viewer’s machine.

## Styling

- Accent color: change `data-accent` or update the CSS variable `--accent` inside `styles.css`.
- Background: set `data-bg` to a file you host alongside `index.html` (e.g., `./my-bg.jpg`).
- Fonts: the page uses the Inter font via Google Fonts; you can remove or replace it in the `<head>`.

## Confetti

- Toggle with `data-confetti`. When enabled, a short celebration is triggered once when the timer hits zero.
- Uses `canvas-confetti` via an inline CDN script tag in `index.html`.

## Hosting

- Copy the entire `static-site` folder to any static host (GitHub Pages, Netlify, Vercel static, S3/CloudFront, Azure Static Web Apps, etc.).
- Or open `index.html` directly from your filesystem for local viewing.

## Troubleshooting

- Timer shows `--`: the deadline is invalid; check the `data-deadline` format.
- Wrong time shown: use an ISO string with explicit timezone (e.g., `...+05:00`) instead of local format.
- Background not visible: make sure the path in `data-bg` is correct relative to `index.html`.
- No confetti: ensure `data-confetti="true"` and the CDN script loads (some offline environments may block it).

---

Files:

- `index.html` — HTML + configuration via body data attributes
- `styles.css` — basic styles and responsive layout
- `main.js` — countdown logic; reads attributes and updates the UI
