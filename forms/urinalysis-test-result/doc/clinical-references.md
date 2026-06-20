# Urinalysis Test Result — clinical references

Grounded reference material for the structured interpretation and reporting of
urinalysis (urine dipstick, microscopy, and culture). These sources anchor the
four-axis interpretation grade, the bacteriuria-significance categories, and the
critical-result alerting rules used by this form.

## Investigation and reporting standards

### UK SMI B41 — Investigation of urine (UKHSA)

The UK Standards for Microbiology Investigations (UK SMI) B41 *Investigation of
urine*, issued by the UKHSA / Public Health England Standards Unit, defines how
urine specimens are processed and how results are interpreted and reported.

Key principles relevant to this form:

- **Significance of bacteriuria** — a single organism at a sufficient colony
  count (classically ≥10⁵ cfu/mL, with lower thresholds interpreted in clinical
  context) indicates significant bacteriuria, mapping to the form's
  `culture_result = significant-growth`, `organism_isolated`, and
  `colony_count_cfu_ml` fields and Axis B severity.
- **Mixed growth / contamination** — mixed growth of multiple organisms, or
  raised epithelial-cell counts on microscopy, suggests a contaminated specimen
  rather than true infection; this maps to `culture_result =
  mixed-growth-likely-contaminant`, `specimen_condition = contaminated`, and the
  `inadequate-technique` safety flag.
- **Microscopy** — red cells, white cells (pyuria), casts, organisms, and
  crystals support interpretation; these map to the microscopy fields.

Sources:

- UK SMI B41 *Investigation of urine* (UKHSA), via RCPath resource library.
  <https://www.rcpath.org/resourceLibrary/uk-smi-b-41i8-7-investigation-of-urine-january-2019-pdf.html>
- Standards for Microbiology Investigations (SMI) collection.
  <https://www.gov.uk/government/collections/standards-for-microbiology-investigations-smi>

### RCPath — Communication of critical and unexpected pathology results

The Royal College of Pathologists (RCPath) best-practice guidance defines a
**critical result** as one likely to affect patient management within 24 hours of
the specimen being taken, or where prompt further action by the clinical team is
likely to be helpful. This underpins the `critical_result_communicated` /
`reported_to` fields and the `critical-result-alert` safety flag, and the Axis D
auto-escalation to *critical-alert*.

- RCPath *The communication of critical and unexpected pathology results*.
  <https://www.rcpath.org/profession/guidelines/the-communication-of-critical-and-unexpected-pathology-results.html>

## Clinical context

### NICE NG109 — Lower urinary tract infection

NICE NG109 recommends sending a midstream urine sample for culture and
sensitivity for pregnant women and men, and highlights that bacteriuria in
pregnancy (including asymptomatic bacteriuria) warrants treatment. This grounds
the *significant growth in pregnancy → critical* escalation and the
`asymptomatic bacteriuria in pregnancy` `reporting_category` label.

- NICE NG109 *Urinary tract infection (lower): antimicrobial prescribing*.
  <https://www.nice.org.uk/guidance/ng109/chapter/recommendations>

### NICE NG12 — Suspected cancer (visible haematuria)

NICE NG12 sets the visible-haematuria suspected-cancer referral pathway context,
relevant where dipstick blood, microscopy red cells, or reported visible
haematuria appear; this can drive the `urgent-referral` flag and Axis D
escalation.

- NICE NG12 *Suspected cancer: recognition and referral*.
  <https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer>

## How the references map to the schema

| Reference | Schema element |
| --- | --- |
| UK SMI B41 colony-count significance | `culture_result`, `organism_isolated`, `colony_count_cfu_ml`, Axis B severity |
| UK SMI B41 mixed growth / contamination | `culture_result = mixed-growth-likely-contaminant`, `specimen_condition`, `inadequate-technique` flag |
| UK SMI B41 microscopy | `red_cell_count`, `white_cell_count`, `epithelial_cells`, `casts`, `organisms_seen`, `crystals` |
| RCPath critical-results communication | `critical_result_communicated`, `reported_to`, `critical-result-alert` flag, Axis D |
| NICE NG109 bacteriuria in pregnancy | `overall_result_status = critical`, `reporting_category`, Axis D escalation |
| NICE NG12 visible haematuria | `blood`, `red_cell_count`, `urgent-referral` flag |
