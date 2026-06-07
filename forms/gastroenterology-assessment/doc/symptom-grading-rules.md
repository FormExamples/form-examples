# GI Symptom Grading Rules

The gastroenterology assessment captures upper-GI, lower-GI, hepatic and
pancreatic symptoms, together with explicit "alarm" features known in
the UK gastroenterology literature as the **ALARMS** mnemonic. The
engine produces a composite severity (Low / Moderate / High / Critical)
driven by the worst-finding rule and emits red-flag alerts on the
summary step.

There is **no canonical single composite "GI symptom severity score"**
in the same way the DLQI or ECOG exist. Specific scored instruments are
available for individual conditions (IBS-SSS for irritable bowel
syndrome, GerdQ for reflux, HBI for Crohn's, SCCAI for ulcerative
colitis, Rome IV criteria for functional GI disorders). Those are not
reproduced in this assessment; the engine instead aggregates symptom
frequency, intensity, and alarm-feature presence into a clinician-
friendly severity band.

## ALARMS red-flag features

Source: NICE NG12 *Suspected cancer: recognition and referral* — upper
and lower GI sections (https://www.nice.org.uk/guidance/ng12) and the
British Society of Gastroenterology (BSG) dyspepsia guidance.

| Letter | Feature | Rule fired |
| --- | --- | --- |
| A | Anaemia (iron deficiency) | Red-flag — suspected upper GI / colorectal pathology |
| L | Loss of weight (unintentional) | Red-flag — suspected malignancy |
| A | Anorexia | Red-flag |
| R | Recent onset progressive symptoms | Red-flag |
| M | Melaena or haematemesis | Critical — urgent endoscopy / admission |
| S | Swallowing difficulty (dysphagia) | Critical — 2-week-wait upper GI referral |

Any single critical feature sets the composite severity to **Critical**.
Any combination of two or more "red-flag" features sets the composite to
**High**.

## Lower GI red flags

Source: NICE NG12 Section 1.3 (Lower GI tract cancers).

| Feature | Rule fired |
| --- | --- |
| Rectal bleeding (visible blood) without anal symptoms in adults ≥ 50 | Red-flag — colorectal 2-week-wait |
| Change in bowel habit > 6 weeks in adults ≥ 60 | Red-flag |
| Iron-deficiency anaemia in any adult | Red-flag |
| Palpable abdominal or rectal mass | Critical |
| FIT (faecal immunochemical test) > 10 µg Hb/g | Red-flag |

The FIT threshold is from NICE DG30 *Quantitative faecal immunochemical
tests to guide referral for colorectal cancer in primary care*
(https://www.nice.org.uk/guidance/dg30).

## Severity bands

The composite mapping is **max-grade** (worst finding wins):

| Band | Trigger |
| --- | --- |
| Low | No alarm features; mild, infrequent symptoms |
| Moderate | Persistent symptoms ≥ 4 weeks without alarm features |
| High | Any single red-flag feature, or 2+ persistent symptoms |
| Critical | Any critical feature (dysphagia, haematemesis, melaena, mass) |

## Implementation rules

| Rule ID | Behaviour |
| --- | --- |
| R-GI-MISS | If alarm checklist not completed, composite is "Incomplete" — no severity inference. |
| R-GI-DYSPH | Dysphagia sets composite = Critical. |
| R-GI-MELAENA | Melaena or haematemesis sets composite = Critical. |
| R-GI-MASS | Abdominal or rectal mass sets composite = Critical. |
| R-GI-WLOSS | Unintentional weight loss ≥ 5 % over 3 months sets composite ≥ High. |
| R-GI-FIT | FIT positive (per NICE DG30) sets composite ≥ High. |
| R-GI-PROGRESSIVE | Recent-onset progressive symptoms sets composite ≥ High. |
