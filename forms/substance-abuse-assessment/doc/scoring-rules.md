# AUDIT + DAST-10 — Scoring Rules

This form combines two screening instruments:

- **AUDIT — Alcohol Use Disorders Identification Test**, developed by the
  World Health Organization (Saunders et al., 1993). The WHO holds the
  copyright but the instrument is freely available for non-commercial
  clinical use.
- **DAST-10 — Drug Abuse Screening Test (10-item version)**, developed
  by Skinner (1982). DAST-10 is in the public domain for clinical use.

## AUDIT — 10 items

| Item | Domain                                                | Score range |
| ---- | ----------------------------------------------------- | -----------:|
| 1    | Frequency of drinking                                 | 0–4         |
| 2    | Typical quantity (drinks per day when drinking)       | 0–4         |
| 3    | Frequency of heavy drinking (≥6 drinks)               | 0–4         |
| 4    | Impaired control over drinking                        | 0–4         |
| 5    | Drinking interfering with normal expectations         | 0–4         |
| 6    | Morning drinking                                      | 0–4         |
| 7    | Guilt after drinking                                  | 0–4         |
| 8    | Blackouts                                             | 0–4         |
| 9    | Alcohol-related injuries                              | 0, 2, 4     |
| 10   | Others concerned about your drinking                  | 0, 2, 4     |

**Total range**: 0–40.

| Score   | Band                  | Recommended response                                |
| ------- | --------------------- | --------------------------------------------------- |
| 0–7     | Low risk              | Education on safer drinking                         |
| 8–15    | Hazardous drinking    | Brief intervention (simple structured advice)       |
| 16–19   | Harmful drinking      | Brief intervention + continued monitoring; consider counselling |
| 20–40   | Dependence likely     | Referral to specialist substance use service        |

Cut-offs follow the WHO AUDIT manual (Babor et al., 2001, second
edition). Some literature uses a lower cut-off (≥ 5 or ≥ 7) for women;
this is a clinical override, not a structural change to the AUDIT.

### AUDIT-C (alternative short form)

Items 1–3 of AUDIT form the AUDIT-C, a brief 3-item screen with
total range 0–12. Cut-offs: ≥ 4 (men) and ≥ 3 (women) indicate
hazardous drinking. This form implements the full AUDIT; AUDIT-C is
provided in some clinical settings as a triage tool.

## DAST-10 — 10 items

| Item | Domain                                                              |
| ---- | ------------------------------------------------------------------- |
| 1    | Use of drugs other than required for medical reasons                |
| 2    | Abuse of more than one drug at a time                               |
| 3    | Inability to stop                                                   |
| 4    | Blackouts or flashbacks                                             |
| 5    | Feeling guilty about drug use                                       |
| 6    | Spouse / parents complain                                           |
| 7    | Neglect of family because of drug use                               |
| 8    | Engagement in illegal activities to obtain drugs                    |
| 9    | Experience of withdrawal                                            |
| 10   | Medical problems as a result of drug use                            |

Each item is yes/no; "yes" scores 1, "no" scores 0 (item 3 scoring is
reversed: "no" = 1, "yes" = 0 — the original wording is
"Are you always able to stop using drugs when you want to?").

**Total range**: 0–10.

| Score   | Band            | Recommended response                                       |
| ------- | --------------- | ---------------------------------------------------------- |
| 0       | No problems     | No intervention required                                   |
| 1–2     | Low level       | Monitor and reassess                                       |
| 3–5     | Moderate level  | Further investigation and brief intervention               |
| 6–8     | Substantial     | Intensive assessment and treatment                         |
| 9–10    | Severe          | Intensive assessment and treatment; specialist referral    |

## Combined severity

The form derives a combined severity from AUDIT and DAST-10:

| Combined band | Trigger                                                       |
| ------------- | ------------------------------------------------------------- |
| Low           | AUDIT 0–7 AND DAST-10 0–2                                     |
| Moderate      | AUDIT 8–15 OR DAST-10 3–5                                     |
| High          | AUDIT 16–19 OR DAST-10 6–8                                    |
| Critical      | AUDIT ≥ 20, DAST-10 ≥ 9, current withdrawal, or overdose risk |

The Critical band always triggers same-day specialist input.

## Recommended output

The grading engine produces:

- `auditTotal`, `auditBand`.
- `dast10Total`, `dast10Band`.
- `combinedSeverity` — `low` / `moderate` / `high` / `critical`.
- `withdrawalRisk` — derived from the Withdrawal Assessment step.
- `overdoseRisk` — derived from substance class, quantities, route, and
  combinations.

## Important limitations

- AUDIT and DAST-10 are **screeners**, not diagnostic instruments.
  Diagnosis of substance use disorder requires clinical interview against
  DSM-5-TR or ICD-11 criteria.
- AUDIT measures the past 12 months; severity may misrepresent current
  use after a period of abstinence.
- DAST-10 measures the past 12 months and excludes alcohol and tobacco.
- These instruments do not differentiate between drugs of misuse;
  clinical history determines the substance(s) involved.
- Stigma and legal risk may reduce honest disclosure; the clinician
  should explain confidentiality limits.
