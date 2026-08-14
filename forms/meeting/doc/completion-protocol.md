# Completion protocol — meeting record

## Lifecycle

1. **Schedule** — meeting created with title, kind, date/time, owner,
   invitees, agenda, location/video link.
2. **Distribute agenda** — at least 24 hours before for non-urgent
   meetings; immediately for ad-hoc.
3. **Hold meeting** — minute-taker captures attendance, decisions,
   action items in real time.
4. **Publish minutes** — within 24 hours.
5. **Approve minutes** — at the next meeting of the same series (per
   Robert's Rules).
6. **Archive** — minutes retained per organizational policy and, for
   companies, Companies Act 2006 s.248 (minimum 10 years).

## Fields

| Field | Required | Notes |
| --- | --- | --- |
| Title | yes | one-line noun phrase |
| Kind | yes | sprint-planning \| daily-scrum \| sprint-review \| sprint-retrospective \| 1:1 \| board \| committee \| ad-hoc \| AGM \| EGM \| other |
| Series | optional | name of the recurring meeting series |
| Date / start time / end time | yes | ISO 8601 with timezone |
| Location / video link | yes | physical or virtual |
| Chair | yes | who presides |
| Minute-taker / secretary | yes | who records |
| Invitees | yes | list with role |
| Attendees | yes | actual presence; auto-defaults from invitees |
| Apologies | yes | named absences |
| Agenda items | yes | ordered list |
| Decisions | per decision | statement, decision-maker, optional ADR / OKR link |
| Action items | per action | owner, due-by, status |
| Next meeting | optional | when continuation |
| Attachments | optional | slides, pre-reads |
| Approval | yes | once minutes approved at next meeting |

## Agenda item format

Each agenda item carries:

- topic;
- presenter;
- expected duration;
- decision required (y/n);
- pre-read links.

## Confidentiality

The implementation distinguishes:

- **Public** — open to anyone in the organization.
- **Internal** — to participants and named distribution list.
- **Confidential** — to participants only; encrypted at rest with a
  separate key.

Board minutes are conventionally Confidential.

## Statutory minute requirements (UK companies)

For board meetings of UK companies:

- Must record presence / absence of each director.
- Must record decisions (resolutions) and how they were carried.
- Must be retained for 10 years (Companies Act 2006 s.248).
- Must be available for inspection by directors.

For general meetings of UK companies:

- Must record decisions taken (Companies Act 2006 s.355).
- Must be retained for 10 years.
- Members have an inspection right.

## Scrum event guard-rails

When kind ∈ {sprint-planning, daily-scrum, sprint-review,
sprint-retrospective}, the implementation enforces the Scrum Guide
time-box for a one-month sprint, scaled linearly for shorter sprints:

- Sprint Planning: ≤ 8 hours.
- Daily Scrum: ≤ 15 minutes.
- Sprint Review: ≤ 4 hours.
- Sprint Retrospective: ≤ 3 hours.

(Time-box enforcement is a warning, not a hard block.)

## Decision and action-item integration

- Decisions can be linked to an ADR record (when architecturally
  significant).
- Decisions can be linked to an OKR record (when they affect a
  current OKR).
- Action items are persisted as issues in the issue-tracker model with
  source-meeting linkage.

## Anti-patterns

- Editing minutes after approval without a new "amendment" minute.
- Recording attendance as "all" — Companies Act requires named
  directors.
- Holding board-level decisions outside a minuted meeting (use a
  written resolution under CA 2006 s.288 instead).
