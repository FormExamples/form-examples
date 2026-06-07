# Pittsburgh Sleep Quality Index (PSQI) scoring rules

## Instrument

The **Pittsburgh Sleep Quality Index (PSQI)** is a 19-item self-rated
questionnaire that quantifies sleep quality and disturbances over the past
month. It was developed at the University of Pittsburgh by Buysse et al.
(1989) and remains one of the most widely cited sleep instruments worldwide.

- Buysse DJ, Reynolds CF, Monk TH, Berman SR, Kupfer DJ. *The Pittsburgh
  Sleep Quality Index: a new instrument for psychiatric practice and
  research*. Psychiatry Research 1989;28:193-213. PMID: 2748771.
  DOI: 10.1016/0165-1781(89)90047-4

## Components

The 19 self-rated items aggregate into **seven component scores**, each
0-3. The seven component scores sum to a **global PSQI score 0-21**.

| # | Component | Source items (Buysse 1989) |
| --- | --- | --- |
| C1 | Subjective sleep quality | Item 9 |
| C2 | Sleep latency | Items 2 + 5a |
| C3 | Sleep duration | Item 4 |
| C4 | Habitual sleep efficiency | Items 1, 3, 4 (time-in-bed vs time asleep) |
| C5 | Sleep disturbances | Items 5b-5j |
| C6 | Use of sleeping medication | Item 6 |
| C7 | Daytime dysfunction | Items 7 + 8 |

Each component is scored 0 (no difficulty) to 3 (severe difficulty).

## Component formulas

### C1 — Subjective sleep quality (item 9)
Very good = 0, Fairly good = 1, Fairly bad = 2, Very bad = 3.

### C2 — Sleep latency (item 2 + 5a)
- Item 2 minutes to fall asleep: ≤15 = 0, 16-30 = 1, 31-60 = 2, >60 = 3.
- Item 5a (trouble falling asleep within 30 min): not in past month = 0,
  <1×/wk = 1, 1-2×/wk = 2, ≥3×/wk = 3.
- Sum and re-map: 0 = 0, 1-2 = 1, 3-4 = 2, 5-6 = 3.

### C3 — Sleep duration (item 4)
>7h = 0, 6-7h = 1, 5-6h = 2, <5h = 3.

### C4 — Habitual sleep efficiency
Efficiency = (hours asleep / hours in bed) × 100.
>85% = 0, 75-84% = 1, 65-74% = 2, <65% = 3.

### C5 — Sleep disturbances
Sum items 5b through 5j (each 0-3), re-map: 0 = 0, 1-9 = 1, 10-18 = 2,
19-27 = 3.

### C6 — Sleeping medication use (item 6)
Not in past month = 0, <1×/wk = 1, 1-2×/wk = 2, ≥3×/wk = 3.

### C7 — Daytime dysfunction
Sum items 7 + 8, re-map: 0 = 0, 1-2 = 1, 3-4 = 2, 5-6 = 3.

## Global score and cut-points

Global PSQI = C1 + C2 + C3 + C4 + C5 + C6 + C7. Range 0-21.

| Score | Category | Notes |
| --- | --- | --- |
| 0-5 | Good sleep quality | The original Buysse 1989 study reported ≤5 = "good sleeper" with sensitivity 89.6% and specificity 86.5% |
| 6-10 | Poor sleep quality | Common in clinical populations; consider sleep hygiene and CBT-I |
| 11-21 | Very poor sleep quality | Likely chronic insomnia or untreated sleep disorder; specialist referral |

The widely accepted clinical cut-point is **PSQI > 5 = poor sleeper**.
Categorical stratification within "poor" is operational, not from the
original paper.

## Bed-partner items (items 10a-10e)

If the patient has a roommate or bed partner, item 10 records bed-partner
observations (snoring, breathing pauses, leg twitches, episodes of
disorientation, other disturbances). These items do not contribute to the
global score but are used to flag possible **obstructive sleep apnoea (OSA)**
or **restless legs syndrome (RLS)**.

## Insomnia Severity Index (cross-reference)

Step 9 cross-references the Insomnia Severity Index (ISI) for the chronic
insomnia subset.

- Bastien CH, Vallières A, Morin CM. *Validation of the Insomnia Severity
  Index as an outcome measure for insomnia research*. Sleep Med 2001;2:297-307.
  PMID: 11438246
- ISI cut-points: 0-7 no insomnia, 8-14 subthreshold, 15-21 moderate, 22-28
  severe.

## Flagged-issue triggers

- Global PSQI > 5 → "Poor sleep quality" — sleep hygiene and CBT-I per NICE
  CKS Insomnia.
- C6 ≥ 2 (regular hypnotic use ≥1-2×/wk) → review hypnotic prescription per
  NICE TA77 / BNF guidance on z-drugs (zopiclone, zolpidem, zaleplon).
- Bed-partner item snoring + breathing pauses + daytime sleepiness →
  STOP-BANG screen and refer for polysomnography per NICE NG202 Obstructive
  Sleep Apnoea.
- Bed-partner item leg twitches + restless legs symptoms → flag RLS.

## See also

- [clinical-guideline-alignment.md](clinical-guideline-alignment.md)
- [safety-case-notes.md](safety-case-notes.md)
- [references.md](references.md)
