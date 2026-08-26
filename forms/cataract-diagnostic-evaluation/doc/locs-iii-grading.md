# LOCS III grading and the surgical-candidacy computation

## The instrument

The Lens Opacities Classification System III (LOCS III) is a clinical
grading system published by Chylack LT Jr, Wolfe JK, Singer DM, et al. in
*The Lens Opacities Classification System III*, Arch Ophthalmol.
1993;111(6):831–6. It grades a cataract at the slit lamp against a set of
standard reference photographs on four continuous subscales, each read to
one decimal place:

| Subscale | Abbreviation | Range | What it grades |
| --- | --- | --- | --- |
| Nuclear Opalescence | NO | 0.1–6.9 | density of the nuclear opacity |
| Nuclear Colour | NC | 0.1–6.9 | yellow/brunescent colouration of the nucleus |
| Cortical cataract | C | 0.1–5.9 | extent of cortical spoking/opacity |
| Posterior Subcapsular cataract | P | 0.1–5.9 | extent of posterior subcapsular plaque |

LOCS III is read and recorded **per eye**. It does not itself define a
severity band, a treatment threshold, or a surgical indication — it is a
continuous descriptive scale intended for standardized documentation and
research comparability.

## This form's severity-band simplification

This form derives a three-level severity band per eye from the four LOCS III
subscores, for the sole purpose of driving this form's own
surgical-candidacy triage. **This banding is this form's own operational
simplification and is not part of the original LOCS III publication:**

```
severity = 'severe'   if any of NO, NC, C, P >= 5.0
severity = 'moderate' if not severe and any of NO, NC, C, P is 3.0-4.9
severity = 'mild'     if all four (recorded) subscores are below 3.0
```

Rationale for a max-across-subscales rule rather than an average: a single
dense component (for example an advanced posterior subcapsular plaque with
an otherwise unremarkable nucleus) can dominate the functional and surgical
picture even while the average subscore looks mild — so the worst subscore,
not the mean, sets the band.

Because C and P are capped at 5.9 while NO and NC extend to 6.9, the "severe"
window for C and P (5.0–5.9) is narrower than for NO and NC (5.0–6.9); this
is a direct consequence of LOCS III's own published subscale ranges, not an
adjustment made by this form.

## Surgical-candidacy computation

The computed recommendation (`computedSurgicalCandidacy`) combines the
severity band, best-corrected visual acuity, and glare testing, evaluated as
a max-grade accumulation — later, worse findings always override earlier,
milder ones:

1. Start at `not-indicated`.
2. Moderate severity in either eye, or best-corrected acuity worse than 6/12
   (LogMAR > 0.30) in either eye → at least `consider`.
3. Severe severity in either eye, or best-corrected acuity worse than 6/18
   (LogMAR ≥ 0.48) in either eye, or a severe glare-testing functional
   impact → at least `indicated`.
4. Any fired safety/referral flag (see below) → `urgent-referral`,
   unconditionally.

A clinician may override the **final** recommendation with a mandatory
reason (step 15); the computed value is always retained and printed
alongside the final value, and safety flags are never suppressed by the
override.

## Safety / referral flags

See [`../spec/index.md`](../spec/index.md) §4 for the full table. Flags are
computed independently of the surgical-candidacy computation and always
override it to `urgent-referral` when any flag has fired, because a
competing pathology, a raised pressure, an unassessed fundus, unusually
rapid progression, or incomplete surgical planning are each, on their own,
reasons to escalate rather than to file a routine recommendation.

## Functional / quality-of-life score

A simple, non-validated 0–4 self-report composite (0–12 total) covering
difficulty with reading, driving, and daily activities (step 13). It
contextualizes the clinical picture — a patient with only a moderate LOCS
III grade but severe functional difficulty is still a patient in distress —
but it does not itself gate the computed surgical-candidacy recommendation,
because it is not a validated instrument.
