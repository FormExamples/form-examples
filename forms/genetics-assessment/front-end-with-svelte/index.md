# Genetics Assessment — consolidated front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests.

Single-page nine-step wizard for a clinical genetics risk assessment: proband
demographics, presenting concern, personal medical history, a three-generation
family pedigree, consanguinity and ancestry, targeted risk scoring (Manchester
score for BRCA1/2, Revised Bethesda criteria for Lynch syndrome, Tyrer-Cuzick
and PREMM5), prior genetic testing, patient understanding, and the clinician's
recommendation and referral plan. The shared pure engine grades overall genetic
risk (Low / Moderate / High) and flags issues for the clinical geneticist. A
SVAR DataGrid dashboard lists assessed patients with their engine-derived
scores.
