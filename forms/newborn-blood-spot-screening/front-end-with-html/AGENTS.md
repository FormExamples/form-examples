# Newborn Blood Spot Screening — HTML front-end (form + dashboard)

Agent instructions for this directory. See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md). Lily Design System headless conventions: [`../../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md).

Classification (not scoring): `js/{types,rules,flags,grader}.js` implement the pure `gradeBloodspot(data)` engine — per-condition result normalization, urgent referrals for suspected conditions, overall-outcome precedence (`referral-required` > `repeat-required` > `incomplete` > `declined-only-outstanding` > `all-not-suspected`), referral status, sample quality (day 5–8 window, adequacy, avoidable repeat), and flagged issues. `carrier` is valid for SCD only.
