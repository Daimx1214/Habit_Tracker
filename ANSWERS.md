# Habit Tracker — Assessment Answers

## 1. How to run

1. Clone or download the repository.
2. Open `habit-tracker/index.html` in any modern browser like Chrome, Firefox, Safari, or Edge.
3. That’s it. No installation, build process, or backend setup is required.

If you still want to run it using a local server:

```bash
cd habit-tracker
npx serve .
# open http://localhost:8000
```

I did not deploy this project because the whole app works locally without requiring any server setup.

---

## 2. Stack & design choices

### Why I used vanilla HTML/CSS/JS

I used vanilla HTML, CSS, and JavaScript because the project mainly revolves around CRUD operations, a weekly grid, and localStorage persistence. Using React or another framework felt unnecessary for something this lightweight. Vanilla JS also keeps the app fast, offline-friendly, and extremely easy to run on any machine.

### Visual Decision 1 — Weekly Grid Layout

I used CSS Grid with a fixed first column for habit names and `1fr` columns for the seven days of the week. This keeps every day cell visually balanced regardless of how long a habit name becomes. On smaller screens, the habit column shrinks while the day columns continue sharing equal space, which keeps the tracker readable and structured instead of uneven.

### Visual Decision 2 — Inline Streak Badges

I placed the streak counter directly beside the habit name instead of creating a separate streak column. This allows users to scan progress much faster because both the habit label and its streak are visible together in a single visual area. I also added subtle color transitions at streak milestones to make progress feel rewarding without overwhelming the interface.

---

## 3. Responsive & accessibility

### 360px phone vs 1440px laptop

On large laptop screens, the app stays centered with comfortable spacing and the entire weekly grid visible without scrolling.

On smaller mobile screens:

* The habit-name column becomes smaller.
* Long habit names truncate using ellipsis.
* The week navigation wraps onto multiple lines if necessary.
* The weekly grid becomes horizontally scrollable.

Only the grid scrolls horizontally, while the controls and navigation remain easy to access.

### Accessibility consideration handled

Each day cell behaves like a keyboard-accessible checkbox using:

* `role="checkbox"`
* `aria-checked`
* `tabindex="0"`

Users can navigate using Tab and toggle checkmarks using Space or Enter.

### Accessibility consideration skipped

I did not implement a full `aria-live` announcement system for screen readers because it would require more granular DOM updates instead of full grid re-renders. With more time, I would add proper live announcements for checkmark state changes.

---

## 4. AI usage

### Places where I used AI

1. Initial streak calculation logic.
2. CSS Grid layout ideas.
3. Week navigation UX suggestions.
4. Structure reminder for `ANSWERS.md`.

### What I changed from the AI output

The AI initially suggested using a flexbox-based layout with fixed widths. I changed the structure to CSS Grid because the flex approach caused alignment issues whenever habit names had different lengths. Grid made all rows and columns align consistently across every screen size.

I also removed the spacing gaps between cells because the separated layout looked fragmented on mobile screens. Using borders instead created a cleaner and more connected visual structure.

---

## 5. Honest gap

The current streak system only reflects the streak relative to today. If a user navigates to older weeks, the streak value does not represent the streak that existed during that specific week.

With another day of work, I would:

* Add week-relative streak calculations.
* Store historical streak snapshots.
* Improve historical analytics and visual progress tracking.

That would make past-week navigation much more meaningful and informative for users.
