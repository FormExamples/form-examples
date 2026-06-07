# Safety case notes — psychology assessment

DASS-21 is a screening instrument intended for triage and severity
monitoring in routine psychological services. The following safety
considerations apply.

## Risk-screen item escalation

A positive response on the supplementary risk-screen item ("Over the
past 2 weeks have you had thoughts of harming yourself or being better
off dead?") triggers same-day clinician review regardless of subscale
totals. The escalation logic is encoded in `flagged-issues.ts`.

## Subscale-driven escalations

| Trigger                                       | Action                                  |
| --------------------------------------------- | --------------------------------------- |
| Depression subscale Extremely Severe (≥28)    | Urgent clinician review; same-week PHQ-9 / GAD-7 follow-up |
| Anxiety subscale Extremely Severe (≥20)       | Urgent review; consider panic / PTSD differential |
| Stress subscale Extremely Severe (≥34)        | Review for adjustment disorder and chronic stressors |
| Risk-screen positive                          | Same-day clinical risk assessment       |
| Two or more subscales Severe or Extremely Severe | Comprehensive psychiatric assessment recommended |
| Reported inability to perform daily roles     | Functional support plan                 |

## Crisis pathway

When risk emerges during screening:

1. Stay with the patient (or remain on the line in remote settings).
2. Conduct a focused risk assessment.
3. Where intent and means are present, escalate to:
   - Local Crisis Resolution Home Treatment Team.
   - NHS 111 option 2 (where available) or 999 in acute risk.
   - Same-day GP appointment or A&E.
4. Provide and document a safety plan (Stanley-Brown framework).
5. Provide crisis-line numbers: Samaritans 116 123 (UK/Ireland);
   988 Suicide & Crisis Lifeline (US).

## Capacity, consent and confidentiality

- DASS-21 is self-report; informed consent for screening should be
  recorded.
- Confidentiality limits should be explained before screening — in
  particular the duty to act on disclosure of imminent harm to self or
  others (GMC *Confidentiality* guidance).
- Where the patient lacks capacity (e.g. acute psychosis, severe
  intoxication, delirium), the DASS-21 result is uninterpretable and
  should not be relied upon.

## Limitations as a safety instrument

- DASS-21 does not measure suicidality directly. A normal DASS-21 does
  not exclude suicide risk.
- The Stress subscale measures persistent tension, not acute stress
  reaction or trauma. Use PCL-5 / acute stress assessment where trauma
  exposure is the relevant clinical concern.
- DASS-21 measures the past week; symptoms may have changed since
  completion. The clinician should ask about current state explicitly.

## Re-screening cadence

- Routine treatment monitoring: every 2–4 weeks during active treatment.
- Symptom monitoring post-discharge: monthly for 3 months.
- Re-screen earlier if any indication of decline.

## Safeguarding

The clinician records concerns under:

- Adult safeguarding — Care Act 2014 duty (England) or equivalent.
- Child safeguarding — Working Together to Safeguard Children.
- Domestic abuse — direct enquiry and signposting.
- Modern slavery / trafficking — National Referral Mechanism.

## Data handling

DASS-21 scores are mental-health data subject to GDPR / UK Data
Protection Act 2018. Storage and access controls must comply with the
clinical service's data protection impact assessment. Patients have the
right to access their scores under subject-access provisions.
