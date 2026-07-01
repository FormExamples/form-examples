# Cardiology Request — front-end-with-svelte/

SvelteKit single continuous single-page wizard for the cardiology referral /
consult request, with the eight referral sections and the four-axis vetting
grade (appropriateness, safety / red-flag, request completeness, triage
priority) plus an overall recommendation. Lily Design System Svelte conventions;
rule IDs match the back-end. A dashboard at `/dashboard` lists sample referrals
with their computed triage tier and recommendation, reusing the same engine. See
the form root [`../AGENTS.md`](../AGENTS.md) and [`../spec/`](../spec).
