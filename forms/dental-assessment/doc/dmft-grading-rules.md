# DMFT Grading Rules

The DMFT index (Decayed, Missing due to caries, Filled Teeth) is the
oldest and most widely used quantitative measure of dental caries
experience in permanent dentition. It is the WHO-recommended index for
oral health surveys.

- Original publication: Klein H, Palmer CE, Knutson JW. *Studies on
  dental caries: I. Dental status and dental needs of elementary
  school children.* Public Health Reports 1938; 53(19): 751-765.
- WHO *Oral Health Surveys: Basic Methods*, 5th edition, 2013.
  https://www.who.int/publications/i/item/9789241548649

## Definitions

For each permanent tooth (32 teeth including third molars; many
surveys use 28 by excluding third molars), score one of:

| Code | Meaning |
| --- | --- |
| D | Decayed — clinically detectable caries (cavitated lesion) |
| M | Missing due to caries |
| F | Filled with no current caries |
| Sound | None of the above; tooth present, no caries history |
| Excluded | Missing for non-caries reason (orthodontic, trauma, periodontal) — not counted in M |

DMFT = D + M + F. Range typically 0-28 (permanent dentition, third
molars excluded) or 0-32 (with third molars).

For deciduous dentition the analogous index is **dmft** (lower case):
counted over 20 primary teeth.

## DMFS (informative)

A surface-level variant exists — DMFS — which counts decayed, missing
and filled tooth **surfaces** (5 per posterior tooth, 4 per anterior
tooth, total 128 surfaces). This engine records DMFT only.

## WHO severity bands for child mean DMFT at age 12

WHO uses mean DMFT at age 12 as a population-level indicator. Levels
are defined as:

| Level | Mean DMFT |
| --- | --- |
| Very low | < 1.2 |
| Low | 1.2 - 2.6 |
| Moderate | 2.7 - 4.4 |
| High | 4.5 - 6.5 |
| Very high | > 6.5 |

Source: World Health Organization Oral Health Country/Area Profile
Programme (CAPP). https://capp.mau.se

For individual-patient banding the WHO does not publish equivalent
cut-offs; the engine reports DMFT verbatim and uses the WHO levels for
informative context only.

## Periodontal assessment — BPE

Step 5 captures the **Basic Periodontal Examination (BPE)**, the
UK-standard periodontal screening index defined by the British Society
of Periodontology and the British Society of Periodontology and Implant
Dentistry (BSP):

- BSP. *BSP Implementation of European S3 Level Treatment Guidelines:
  BPE Implementation 2019*.
  https://www.bsperio.org.uk/professionals/bpe.html

BPE sextant codes:

| Code | Finding |
| --- | --- |
| 0 | No pockets > 3.5 mm, no calculus / overhangs, no bleeding on probing |
| 1 | No pockets > 3.5 mm, no calculus / overhangs, bleeding on probing |
| 2 | No pockets > 3.5 mm, but supra/subgingival calculus or overhangs |
| 3 | Probing depth 3.5-5.5 mm |
| 4 | Probing depth > 5.5 mm |
| * | Furcation involvement |

## 2018 staging and grading of periodontitis (informative)

Step 5 also captures the AAP / EFP 2018 stage (I-IV) and grade (A, B, C)
where applicable. Source:

- Tonetti MS, Greenwell H, Kornman KS. *Staging and grading of
  periodontitis: Framework and proposal of a new classification and
  case definition.* Journal of Periodontology 2018; 89 Suppl 1: S159-S172.
  PMID: 29926952. DOI: 10.1002/JPER.18-0006.

The engine does not auto-derive the stage/grade — these are recorded
verbatim from the dentist.

## Implementation rules

| Rule ID | Behaviour |
| --- | --- |
| R-DMFT-MISS | Missing tooth-level assessment → DMFT = null. |
| R-DMFT-RANGE | DMFT validated within 0-32 (or 0-28 if third molars excluded). |
| R-BPE-3-4 | Any sextant with BPE 3 or 4 raises a periodontal-treatment flag. |
| R-BPE-* | Any sextant marked * (furcation) raises an urgent periodontal flag. |
| R-ORAL-CANCER | Any suspicious lesion (lump, non-healing ulcer > 3 weeks, red/white patch) raises 2-week-wait flag per NICE NG12 head-and-neck section. |
