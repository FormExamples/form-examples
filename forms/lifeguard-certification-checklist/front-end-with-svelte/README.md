# Lifeguard Certification Checklist — examiner form (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests.

A single-page, ten-section examiner wizard that records RLSS UK NPLQ / ILSF
lifeguard competencies and grades the candidate Pass / Needs Development / Fail
(any critical-competency breach forces a Fail). RESTful routes:
`/lifeguard-certification-checklists/` (SVAR dashboard) and
`/lifeguard-certification-checklists/[id]` (wizard) plus `[id]/report` and
`[id]/report/pdf`. See parent `../index.md` for the full form specification.
