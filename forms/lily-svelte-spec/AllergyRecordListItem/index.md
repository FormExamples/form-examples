# AllergyRecordListItem

One allergy or intolerance in an allergy record list, with substance, reaction, severity, criticality and status.

A Svelte 5 component that renders `<li>`.

See `components/allergy-record-list-item/index.md` for the canonical documentation, and [spec/healthcare-ui](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/healthcare-ui/index.md) for the rules.

## Props

- `substance`: string (required) — what the patient reacts to; never truncated
- `reaction`: string (optional) — the manifestation
- `severity`: "mild" | "moderate" | "severe" (optional) — the reaction's severity (FHIR reaction.severity); rendered as `data-severity`
- `severityLabel`: string (optional; required when `severity` is set) — the severity in words
- `criticality`: "low" | "high" | "unable-to-assess" (optional) — the risk of a future reaction (FHIR criticality), not the severity of a past one; rendered as `data-criticality`
- `criticalityLabel`: string (optional; required when `criticality` is set) — the criticality in words
- `clinicalStatus`: "active" | "inactive" | "resolved" (optional) — FHIR clinicalStatus; rendered as `data-clinical-status`
- `clinicalStatusLabel`: string (optional; required when `clinicalStatus` is set) — the clinicalStatus in words
- `verificationStatus`: "unconfirmed" | "presumed" | "confirmed" | "refuted" | "entered-in-error" (optional) — FHIR verificationStatus; a refuted or entered-in-error record must never read as a confirmed one; rendered as `data-verification-status`
- `verificationStatusLabel`: string (optional; required when `verificationStatus` is set) — the verificationStatus in words
- `typeLabel`: string (optional) — allergy or intolerance, in words (FHIR type)
- `categoryLabel`: string (optional) — food, medication, environment or biologic, in words (FHIR category)
- `updated`: string (optional) — when the record was last updated
- `updatedLabel`: string (optional) — that date as the consumer writes it; the `<time>` shows only when set
- `children`: slot (optional) — anything else, such as a link to the full record

---

Lily™ and Lily Design System™ are trademarks.
