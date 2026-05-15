# Meeting — Front-end Dashboard (HTML) Agent Instructions

Static HTML review dashboard for the meeting form. One `index.html` plus
sibling CSS and JavaScript. No build step, no package manager.

## Tools

- Plain HTML, CSS, vanilla JavaScript (ES2022).
- Any static file server (`python3 -m http.server`).

## File naming convention

- `index.html` — the dashboard page.
- `styles.css` — Tailwind-flavoured utility CSS, hand-authored.
- `app.js` — table rendering, sorting, filtering, sample-data fallback.
- `sample.json` — sample list of meetings.

## Contents

- `./index.md` — overview
- `./AGENTS.md` — this file
- `./CLAUDE.md` — Claude Code project instructions (defers to `AGENTS.md`)
- `./plan.md` — implementation roadmap
- `./tasks.md` — task tracking

## Columns

| Column | Source |
| --- | --- |
| Title | `meeting.title` |
| Category | `meeting.category` |
| Status | `meeting.status` |
| Scheduled start | `meeting.scheduled_start_at` |
| Participants | `count(participant)` |
| Fired rules | `count(meeting_grade_rule)` |
| Result | `meeting_grade.overall_result` |

## Filters

- Status dropdown (`draft`, `scheduled`, `in-progress`, `completed`,
  `cancelled`, `no-show`).
- Category dropdown (full enum from the SQL `meeting.category` check).
- Result dropdown (`productive`, `partial`, `unproductive`, `cancelled`).
- Free-text search over title.

## Verify

```sh
bin/test-form meeting
```
