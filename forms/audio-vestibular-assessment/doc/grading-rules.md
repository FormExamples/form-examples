# Audio-vestibular grading rules

This form uses two validated instruments:

1. **Pure-tone audiometry → WHO hearing loss grades** for hearing function.
2. **Dizziness Handicap Inventory (DHI)** for vestibular handicap.

## WHO hearing loss grades (2021 revision)

The World Health Organization revised its hearing-loss grading in the
2021 *World Report on Hearing*. The unaided pure-tone average (PTA) in
the **better ear at 0.5, 1, 2, 4 kHz** assigns a grade:

| WHO grade | PTA dB HL (better ear) |
| --- | --- |
| No hearing loss | < 20 |
| Mild | 20-34 |
| Moderate | 35-49 |
| Moderately severe | 50-64 |
| Severe | 65-79 |
| Profound | 80-94 |
| Complete or total | ≥ 95 |
| Unilateral hearing loss | better ear <20; other ear ≥35 |

- World Health Organization. *World Report on Hearing*. Geneva: WHO, 2021.
  <https://www.who.int/publications/i/item/9789240020481>
- World Health Organization. *Hearing loss grades and the International
  Classification of Functioning, Disability and Health*. Bull World Health
  Organ 2019;97:725-728. PMID: 31656339. DOI: 10.2471/BLT.19.230367

## Pre-2021 WHO grades

For backward compatibility with NICE clinical guidance, the form also
stores the legacy WHO 1980 grading (slight 26-40, moderate 41-60, severe
61-80, profound > 80 dB HL).

## Dizziness Handicap Inventory (DHI)

The **Dizziness Handicap Inventory** is a 25-item self-report instrument
developed by Jacobson and Newman (1990) to quantify perceived handicap from
vestibular symptoms.

- Jacobson GP, Newman CW. *The development of the Dizziness Handicap
  Inventory*. Archives of Otolaryngology — Head & Neck Surgery 1990;116:
  424-427. PMID: 2317323. DOI: 10.1001/archotol.1990.01870040046011

### Scoring

25 items across three subscales:
- Physical (P) — 7 items
- Emotional (E) — 9 items
- Functional (F) — 9 items

Each item scored: **Yes = 4, Sometimes = 2, No = 0**.

Total range **0-100**.

### Severity bands (Whitney et al. 2004)

| DHI total | Severity | Action |
| --- | --- | --- |
| 0-16 | No to mild handicap | Reassurance, observe |
| 18-36 | Mild handicap | Vestibular rehabilitation |
| 38-52 | Moderate handicap | Vestibular rehab + specialist referral |
| 54-100 | Severe handicap | Neurotology referral |

- Whitney SL, Wrisley DM, Brown KE, Furman JM. *Is perception of handicap
  related to functional performance in persons with vestibular dysfunction?*
  Otol Neurotol 2004;25:139-43. PMID: 15021772
- MCID for DHI ≈ 18 points (Jacobson 1990 follow-up).

## Vestibular screening tests

The form records:

- **Head Impulse Test (HIT)** — Halmagyi & Curthoys 1988.
- **Dix-Hallpike** — for posterior canal benign paroxysmal positional
  vertigo (BPPV).
- **Supine roll test** — for horizontal canal BPPV.
- **Romberg / sharpened Romberg** — postural control.
- **HINTS (Head Impulse, Nystagmus, Test of Skew)** battery — for acute
  vestibular syndrome and stroke discrimination per Kattah JC et al. 2009.

- Kattah JC, Talkad AV, Wang DZ, Hsieh YH, Newman-Toker DE. *HINTS to
  diagnose stroke in the acute vestibular syndrome: three-step bedside
  oculomotor examination more sensitive than early MRI diffusion-weighted
  imaging*. Stroke 2009;40:3504-10. PMID: 19762709

## Tympanometry classification (Jerger 1970)

| Type | Description |
| --- | --- |
| A | Normal middle-ear pressure and compliance |
| As | Normal pressure, low compliance (otosclerosis, ossicular fixation) |
| Ad | Normal pressure, high compliance (ossicular discontinuity) |
| B | Flat tracing (effusion, perforation) |
| C | Negative middle-ear pressure (Eustachian dysfunction) |

- Jerger J. *Clinical experience with impedance audiometry*. Arch
  Otolaryngol 1970;92:311-24. PMID: 5455571

## Flagged-issue triggers

- WHO grade severe or profound in either ear → referral for hearing aid /
  cochlear implant assessment per NICE TA566.
- Sudden sensorineural hearing loss (≥30 dB in 3 contiguous frequencies in
  ≤3 days) → emergency same-week ENT referral and consideration of oral
  corticosteroids per AAO-HNS clinical practice guideline.
- HINTS findings suggesting central (skew deviation, direction-changing
  nystagmus, normal head impulse) → immediate stroke pathway.
- DHI ≥ 54 → neurotology referral and falls-risk cross-link.

## See also

- [clinical-guideline-alignment.md](clinical-guideline-alignment.md)
- [safety-case-notes.md](safety-case-notes.md)
- [references.md](references.md)
