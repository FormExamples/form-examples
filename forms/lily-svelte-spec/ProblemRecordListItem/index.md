# ProblemRecordListItem

One problem or condition in a problem record list, with its clinical and verification status, severity, onset and resolution.

A Svelte 5 component that renders `<li>`.

See `components/problem-record-list-item/index.md` for the canonical documentation, and [spec/healthcare-ui](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/healthcare-ui/index.md) for the rules.

## Props

- `condition`: string (required) — the problem or condition; never truncated
- `clinicalStatus`: "active" | "recurrence" | "relapse" | "inactive" | "remission" | "resolved" (optional) — FHIR Condition clinicalStatus; rendered as `data-clinical-status`
- `clinicalStatusLabel`: string (optional; required when `clinicalStatus` is set) — the clinicalStatus in words
- `verificationStatus`: "unconfirmed" | "provisional" | "differential" | "confirmed" | "refuted" | "entered-in-error" (optional) — FHIR Condition verificationStatus; a refuted or entered-in-error record must never read as a confirmed one; rendered as `data-verification-status`
- `verificationStatusLabel`: string (optional; required when `verificationStatus` is set) — the verificationStatus in words
- `severityLabel`: string (optional) — the severity in words
- `onset`: string (optional) — when it began, for <time datetime>
- `onsetLabel`: string (optional) — that date as the consumer writes it; the `<time>` shows only when set
- `abatement`: string (optional) — when it resolved, for <time datetime>
- `abatementLabel`: string (optional) — that date as the consumer writes it; the `<time>` shows only when set
- `children`: slot (optional) — anything else, such as a link to the full record

---

Lily™ and Lily Design System™ are trademarks.
