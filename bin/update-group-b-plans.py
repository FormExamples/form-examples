#!/usr/bin/env python3
"""Update plan.md for the 11 Group B forms whose front-end-form-with-svelte
was just implemented. Replace stub status with accurate "implemented"
status for the SvelteKit patient form, and note the dashboard + Rust
backend remaining.
"""

from __future__ import annotations

import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
FORMS_DIR = REPO_ROOT / "forms"

GROUP_B = {
    "psychology-assessment": (
        "Psychology Assessment",
        "DASS-21 patient form (8-step wizard, 3 subscales, severity per subscale, "
        "suicidal-ideation safety flag).",
    ),
    "united-kingdom-driver-and-vehicle-licensing-agency-b1-form": (
        "UK DVLA B1 Form",
        "DVLA B1 confidential medical information (neurological) — 13-step wizard, "
        "41 validation rules, conditional epilepsy declaration, clinically-flagged "
        "issues for missing declaration / drowsy meds / uncontrolled diplopia.",
    ),
    "united-kingdom-driver-and-vehicle-licensing-agency-m1-form": (
        "UK DVLA M1 Form",
        "DVLA M1 confidential medical information (mental health) — 6-step wizard "
        "with Q1=No early-stop branch, 16 validation rules, suicidal-thoughts and "
        "schizophrenia/psychosis escalation.",
    ),
    "united-kingdom-driver-and-vehicle-licensing-agency-v1-form": (
        "UK DVLA V1 Form",
        "DVLA V1 general confidential medical information (vision) — 14-step wizard, "
        "40 validation rules, Snellen 6/12 standard, monocular / glaucoma / retinitis "
        "pigmentosa / blepharospasm / diplopia branches.",
    ),
    "united-kingdom-maternity-certificate-mat-b1": (
        "UK MAT B1 Maternity Certificate",
        "DWP MAT B1 maternity certificate — 4-step wizard, doctor-stamp vs midwife "
        "NMC-PIN issuer branch, pre-confinement vs post-confinement certificate "
        "branch, >20-weeks-pre-EWC and expired-NMC flags.",
    ),
    "who-acute-referral-form": (
        "WHO Acute Referral Form",
        "WHO standardised acute referral (SBAR) — 8-step wizard, two-party "
        "completion (initiating facility steps 1–7, receiving facility step 8), "
        "28 validation rules, clinical flags for SpO2<90, GCS≤8, hypotension, "
        "hypertension, infectious-disease precaution.",
    ),
    "who-counter-referral-form": (
        "WHO Counter-Referral Form",
        "WHO standardised counter-referral (SBAR) — 7-step wizard, follow-up "
        "timeframe (urgent <24h to >2 weeks), status flags (cognitive impairment, "
        "carer-dependent, palliative care), conditional informed-explanation, 28 tests.",
    ),
    "who-emergency-first-aid-form": (
        "WHO Emergency First Aid Form",
        "WHO emergency first aid for community first-aid responders (CABCDE) — "
        "12-step wizard, 30 validation rules, 14 clinical flags including major "
        "bleeding without intervention and tourniquet-without-time escalation.",
    ),
    "who-emergency-unit-general-form": (
        "WHO Emergency Unit Form: General",
        "WHO emergency unit general (non-trauma) clinical documentation — 16-step "
        "wizard with ABCD primary survey, ROS over 14 systems, PE over 11 systems, "
        "diagnostics, interventions, reassessment, disposition; 27 tests.",
    ),
    "who-emergency-unit-trauma-form": (
        "WHO Emergency Unit Form: Trauma",
        "WHO emergency unit trauma documentation — 17-step wizard with triage-driven "
        "required fields (RED ratchet), dead-on-arrival path, FAST/E exam, 35 rules, "
        "25+ clinical flags; 41 tests.",
    ),
    "who-prehospital-form": (
        "WHO Prehospital Form",
        "WHO prehospital EMS clinical documentation — 16-step wizard, reassessments "
        "modeled as array (0–3) with add/remove, SAMPLE history, injury-flag-gated "
        "mechanism/intent, 33 tests.",
    ),
}


PLAN_TEMPLATE = """# Plan: {title}

## Current status

SvelteKit patient front-end implemented. {summary}

Remaining work:

- Build front-end-dashboard-with-svelte (SVAR DataGrid)
- Build back-end-with-loco Rust JSON API back-end (axum + Loco; JSON only)
- PDF report generation via SvelteKit server endpoint
- End-to-end Playwright tests
- Clinical safety case documentation

See [AGENTS.md](AGENTS.md) for the form's design spec and step list.

## Future enhancements

- Add input validation with Zod schemas
- Add accessibility audit (axe-core)
- Add form autosave to localStorage
- Add internationalisation (i18n) support
- User acceptance testing with domain stakeholders
"""


def main() -> int:
    rewritten = 0
    skipped = 0
    for slug, (title, summary) in GROUP_B.items():
        plan_path = FORMS_DIR / slug / "plan.md"
        if not plan_path.is_file():
            print(f"missing: {plan_path}", file=sys.stderr)
            skipped += 1
            continue
        plan_path.write_text(PLAN_TEMPLATE.format(title=title, summary=summary))
        rewritten += 1
        print(f"rewrote {plan_path.relative_to(REPO_ROOT)}")
    print(f"\nDone. rewritten={rewritten} skipped={skipped}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
