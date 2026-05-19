# WHO Surgical Safety Checklist — review dashboard (static HTML)

Static HTML dashboard listing completed WHO Surgical Safety Checklist cases
for a peri-operative governance review. Read-only review of case
identification, the three checklist phases (Sign In, Time Out, Sign Out),
the operating-team roster, and computed safety flags.

Vanilla JavaScript, no framework, no build step. Open `index.html` directly
or serve with `python3 -m http.server 8080`.

## Columns

- Case date
- Patient name
- Site (facility) and theatre / operating room
- Lead surgeon, anaesthetist
- Urgency (elective / urgent / emergency / immediate)
- Surgical specialty
- Status (lifecycle: not-started -> completed / abandoned)
- Safety-flag count

## Filters

- Free-text search (patient, procedure, surgeon, anaesthetist, site)
- Status dropdown
- Urgency dropdown
- Surgical specialty dropdown
- Safety-flag presence (any / with flags / no flags)

## Detail panel

Clicking a row opens a modal showing all three phases for that case plus
the operating-team roster and any abandoned reason.
