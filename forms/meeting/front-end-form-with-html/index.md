# Meeting — Front-end Form (HTML)

A single static HTML file that renders the 10-step single-page wizard
for the meeting form. No build step, no framework — `index.html` plus
hand-authored CSS and vanilla JavaScript. The wizard mirrors the steps
listed in the top-level [`index.md`](../index.md): organiser metadata,
title and purpose, invitation, agenda, participants, resources,
recurrence, summary, action items / outputs / outcomes, and sign-off.

The page runs the shared `validateMeeting()` engine on every change and
surfaces the fired rules and flags inline. PDF output is produced
client-side via `pdfmake` loaded from a CDN.

See the sibling [`AGENTS.md`](./AGENTS.md) for agent instructions and
[`plan.md`](./plan.md) for the implementation roadmap.
