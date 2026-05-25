# ☐ Habit Tracker

A lightweight, browser-based habit tracker with a weekly grid view, streak tracking, and full keyboard accessibility — no build tools, no installs, no backend required.

---

## Features

- **Weekly grid** — view and check off habits across Mon–Sun
- **Week navigation** — browse past and future weeks with prev/next controls
- **Streak badges** — see your current streak beside each habit, with color milestones at 3 and 7+ days
- **Inline rename** — click any habit name to edit it in place
- **Persistent storage** — all data is saved to `localStorage` automatically
- **Keyboard accessible** — tab through cells and toggle with Space or Enter
- **Zero dependencies** — pure HTML, CSS, and vanilla JavaScript

---

## Getting Started

No installation or build step needed. Just open the file:

```bash
# Option 1 — open directly in your browser
double-click index.html

# Option 2 — serve locally (avoids any browser file:// restrictions)
cd habit-tracker
npx serve .
# then open http://localhost:3000

# Option 3 — Python built-in server
python3 -m http.server 8000
# then open http://localhost:8000
```

---

## Project Structure

```
habit-tracker/
├── index.html   # App shell and markup
├── style.css    # All styles, including grid layout and responsive rules
├── app.js       # App logic: data, rendering, events
└── README.md    # This file
```

---

## Stack & Design Decisions

### Vanilla HTML/CSS/JS

The app centers on CRUD operations, weekly grid rendering, and localStorage persistence. A framework like React would add unnecessary overhead for something this lightweight. Vanilla JS keeps the app fast, offline-friendly, and trivial to run on any machine.

### CSS Grid Layout

The tracker uses CSS Grid with a fixed first column for habit names and `1fr` columns for each of the seven days. This keeps every day cell visually balanced regardless of how long a habit name is. On mobile, the grid becomes horizontally scrollable while the habit column shrinks gracefully.

### Inline Streak Badges

The streak counter sits directly beside the habit name rather than in a separate column. This lets users scan habit + progress in a single glance. Color changes at streak milestones (3 days → warm, 7+ days → fire) make progress feel rewarding without cluttering the interface.

---

## Responsive Behaviour

| Screen size | Behaviour |
|---|---|
| 1440px laptop | Full grid visible, comfortable spacing, app centered |
| 360px mobile | Habit column shrinks, long names truncate with ellipsis, grid scrolls horizontally |

Controls and week navigation remain fixed and accessible at all sizes.

---

## Accessibility

Each day cell is implemented as a keyboard-navigable checkbox:

- `role="checkbox"` — announces state to screen readers
- `aria-checked` — reflects current checked/unchecked state
- `tabindex="0"` — included in the tab order
- **Space / Enter** — toggles the cell

**Known gap:** There is no `aria-live` region for screen reader announcements on state change. Full re-renders replace the DOM on every toggle, which would interrupt live announcements. A future improvement would introduce granular DOM updates with proper live region support.

---

## Data & Storage

All data is stored in `localStorage` under the key `habit_tracker_data` as a JSON object:

```json
{
  "habits": [{ "id": "abc123", "name": "Read 30 min" }],
  "checkmarks": {
    "abc123": { "2026-05-21": true, "2026-05-22": true }
  }
}
```

No data is ever sent to a server.

---

## Known Limitations

- **Streaks are relative to today.** When viewing past weeks, the displayed streak reflects the current streak, not the streak as it was during that week.
- **No data export.** There is currently no way to back up or export your habit data outside of localStorage.

### Planned improvements (given more time)

- Week-relative streak calculations
- Historical streak snapshots for past-week views
- Data export / import (JSON)
- `aria-live` announcements for screen reader users

---

## License

MIT — free to use, modify, and distribute.
