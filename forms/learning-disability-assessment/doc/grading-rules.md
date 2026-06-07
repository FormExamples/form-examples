# Learning Disability — Grading Rules

This form implements a severity classification for intellectual
developmental disorder (the international term for what the UK NHS calls
"learning disability"), based on the DSM-5-TR severity levels and the
ICD-11 6A00 sub-codes. Severity is determined primarily by adaptive
functioning across conceptual, social, and practical domains, rather than
by IQ alone.

## Severity bands

Aligned to DSM-5-TR and ICD-11:

| Band      | Adaptive function summary                            | IQ range (approx) | ICD-11 sub-code |
| --------- | ---------------------------------------------------- | ----------------- | --------------- |
| Mild      | Independent with support for complex tasks; can hold a job with reasonable adjustments; reading and arithmetic typically at primary-school level | 50–69 | 6A00.0 |
| Moderate  | Needs significant support for daily living; basic communication; can perform routine work with supervision | 35–49 | 6A00.1 |
| Severe    | Substantial support required; limited communication; needs help with most daily activities | 20–34 | 6A00.2 |
| Profound  | Intensive support across all settings; very limited communication; dependent on others for daily care | < 20 | 6A00.3 |

DSM-5-TR explicitly emphasises that severity is determined by adaptive
functioning (conceptual, social, practical) — **not by IQ** — because
adaptive functioning determines the level of supports required.

## Adaptive functioning domains

Captured in the Adaptive Functioning step:

| Domain     | Skills assessed                                                       |
| ---------- | --------------------------------------------------------------------- |
| Conceptual | Language, reading, writing, arithmetic, memory, problem-solving       |
| Social     | Empathy, interpersonal communication, friendships, social judgement, self-regulation |
| Practical  | Self-care, occupational skills, money management, recreation, organising school/work tasks |

## NHS England Annual Health Check alignment

NHS England commissions an annual health check for adults and young people
on the GP Learning Disability Register. This form's structure aligns with
the AHC template:

| AHC element                                  | Captured in step                                |
| -------------------------------------------- | ----------------------------------------------- |
| Patient details and carer information        | Demographics, Carer & Support Network           |
| Communication needs                          | Communication Needs                             |
| Mental health, epilepsy and medications      | Medical Review                                  |
| Physical observations and examination        | Physical Examination & Observations             |
| Behavioural changes / distress               | Behavioural Concerns & Triggers                 |
| Mental capacity                              | Mental Capacity & Consent                       |
| Reasonable adjustments                       | Reasonable Adjustments Required                 |
| Personalised Health Action Plan              | Health Action Plan                              |

## Output

The grading engine produces:

- `severityBand` — `mild` / `moderate` / `severe` / `profound`.
- `conceptualScore`, `socialScore`, `practicalScore` — qualitative
  ratings per domain.
- Flagged issues: STOMP/STAMP medication-overuse concerns,
  epilepsy review overdue, missing mental capacity assessment,
  communication needs unmet, behavioural distress not investigated.

## Important limitations

- Diagnosis of intellectual developmental disorder requires assessment
  by an appropriate specialist (Consultant in Learning Disability
  Psychiatry, Clinical Psychologist, or Community LD Team). This form
  supports recording of the severity classification, not its initial
  determination.
- Onset must have been in the **developmental period**. Cognitive
  decline starting in adulthood is dementia or another neurocognitive
  disorder, not intellectual disability.
- The severity band must be reviewed periodically because adaptive
  functioning can change with intervention, illness, ageing, or
  environmental change.
