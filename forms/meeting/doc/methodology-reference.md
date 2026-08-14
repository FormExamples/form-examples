# Methodology reference — meeting record

A meeting record captures the agenda, attendees, decisions, and action
items of a single meeting. This implementation draws on long-standing
parliamentary and corporate-secretarial practice (Robert's Rules of
Order, the Companies Act minutes regime) and modern agile-team
practices (Scrum events, retrospectives).

## Robert's Rules of Order

*Robert's Rules of Order Newly Revised* (12th edition, 2020) is the
dominant English-language manual of parliamentary procedure. It
provides standard motion, debate, and minute-taking conventions.

- Official site: <https://robertsrules.com/>

Minutes per Robert's Rules typically contain:

- Name of the organization.
- Kind of meeting (regular, special, adjourned).
- Date, time, and place.
- Presence and absence of the regular presiding officer and secretary.
- Whether the previous minutes were approved.
- Each motion, who made it, who seconded, and the disposition.
- Time of adjournment.
- Signature of the secretary.

## Companies Act 2006 (UK)

Section 248 of the Companies Act 2006 requires every company to keep
minutes of all proceedings at meetings of its directors for at least
10 years.

- Companies Act 2006, s.248.
  <https://www.legislation.gov.uk/ukpga/2006/46/section/248>

Section 355 imposes a similar requirement for general meeting minutes
(also 10 years).

## Scrum events

The Scrum Guide (November 2020, by Ken Schwaber and Jeff Sutherland)
defines five formal Scrum events:

1. The Sprint (a container).
2. Sprint Planning (max 8 hours for a one-month sprint).
3. Daily Scrum (15 minutes).
4. Sprint Review (max 4 hours for a one-month sprint).
5. Sprint Retrospective (max 3 hours for a one-month sprint).

Each event has a documented Purpose, Attendees, Inputs, Activities,
and Outputs. The implementation provides a `kind` enumeration aligned
with the Scrum events plus general-purpose categories (1:1,
standing committee, ad hoc, board, AGM, EGM).

- The Scrum Guide:
  <https://scrumguides.org/scrum-guide.html>

## Retrospective methods

Retrospective format options:

- **What went well / what didn't go well / what to try next** —
  Esther Derby & Diana Larsen, *Agile Retrospectives* (Pragmatic
  Bookshelf, 2006).
- **Start / stop / continue** — common variant.
- **Mad / sad / glad** — emotion-led variant.
- **5 whys** — root-cause method (Taiichi Ohno, Toyota).

The implementation captures the format chosen and records the items
generated.

## Decision log

Each decision recorded has:

- Statement.
- Decision date.
- Decision maker(s).
- Optional link to ADR (where the decision is architecturally
  significant; see `architecture-decision-record` form).
- Optional link to OKR (where the decision affects an objective; see
  `objectives-and-key-results-tracker` form).

## Action items

Action items are tracked as linked Issues in the issue-tracker model:

- Owner.
- Due-by date.
- Source meeting.
- Status (open / in-progress / done / dropped).

## References

- Robert, H. M. III, et al. (2020). *Robert's Rules of Order Newly
  Revised*, 12th ed. PublicAffairs.
- Companies Act 2006, ss.248 and 355.
  <https://www.legislation.gov.uk/ukpga/2006/46/contents>
- Schwaber, K. & Sutherland, J. (2020). The Scrum Guide.
  <https://scrumguides.org/scrum-guide.html>
- Derby, E. & Larsen, D. (2006). *Agile Retrospectives*. Pragmatic
  Bookshelf. ISBN 978-0977616640.
