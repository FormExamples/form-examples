# Blood Cross-Match Test Result — clinical references

Grounded reference material for the structured interpretation and reporting of
pre-transfusion compatibility testing. These sources anchor the four-axis
interpretation grade, the structured-reporting categories, and the
critical-result alerting rules used by this form.

## Reporting and compatibility standards

### BSH — Guidelines for pre-transfusion compatibility procedures in blood transfusion laboratories

The British Society for Haematology (BSH; formerly BCSH) guideline (Milkins et
al.) defines the laboratory processes and procedures for pre-transfusion testing
so that satisfactory standards are maintained. It notes that technical errors,
clerical errors, use of non-validated techniques or equipment, and
non-compliance with established procedures may result in **missed
incompatibilities** and immediate or delayed haemolytic transfusion reactions.

Key elements relevant to this form:

- **ABO & D grouping** — the determined `abo_group` and `rhd_group`, and
  detection of an **ABO discrepancy** against the patient historical group
  (`historical_group_concordant`).
- **Antibody screening & identification** — `antibody_screen_result` and the
  free-text `antibodies_identified`; clinically-significant alloantibodies
  require antigen-negative units and extend turnaround.
- **Crossmatch and electronic issue** — `crossmatch_result`
  (compatible / incompatible / electronic-issue / not-performed) and the
  `units_crossmatched` / `units_available` counts.
- **Sample validity** — supports the report-completeness axis and the
  identity-safety flags.

Sources:

- Guidelines for pre-transfusion compatibility procedures in blood transfusion
  laboratories, BSH.
  <https://b-s-h.org.uk/guidelines/guidelines/guidelines-for-pre-transfusion-compatibility-procedures-in-blood-transfusion-laboratories>
- Milkins C, et al. Guidelines for pre-transfusion compatibility procedures in
  blood transfusion laboratories. *Transfusion Medicine*, 2013.
  <https://onlinelibrary.wiley.com/doi/full/10.1111/j.1365-3148.2012.01199.x>

### BSH — Administration of blood components (two-sample / group-check rule)

The BSH *Administration of blood components* guideline (Robinson et al., 2018)
requires **positive patient identification** and a **two-sample (group-check)
rule**: a patient's ABO/RhD group must be confirmed on two samples from two
separate venepuncture events before group-specific (non-O) red cells are issued.
This drives the form's `two_sample_rule_met` field and the identity-safety
escalation. An unmet two-sample rule is a critical result that auto-escalates the
follow-up urgency.

- The administration of blood components: a British Society for Haematology
  Guideline (Robinson et al., 2018), *Transfusion Medicine*.
  <https://onlinelibrary.wiley.com/doi/full/10.1111/tme.12481>

## Critical results and never-events

### SHOT — ABO-incompatible transfusion and Wrong Blood in Tube (WBIT)

Serious Hazards of Transfusion (SHOT) annual reports document that
**ABO-incompatible red cell transfusion** can lead to severe haemolysis and
death, and is recognised as a **never event**. **Wrong Blood in Tube (WBIT)** —
where the blood in the tube is not that of the patient identified on the label —
is a leading cause; near-miss reporting has demonstrated hundreds of WBIT
instances that could have caused ABO-incompatible transfusion. SHOT identifies
that ABO-incompatible events caused by WBIT occurred where the **two-sample
policy was not adhered to**.

This underpins the form's `critical-result-alert` and `discrepancy-with-request`
flags and the auto-escalation logic for ABO discrepancy and unmet two-sample
rule.

- Serious Hazards of Transfusion (SHOT) annual reports.
  <https://www.shotuk.org/>
- Quantifying Harms Associated With Red Cell ABO Incompatible Blood Transfusion:
  A Systematic Review of the UK SHOT Literature.
  <https://www.sciencedirect.com/science/article/pii/S0887796325000318>

## Appropriateness and threshold context (carried from the request)

- NICE NG24 *Blood transfusion* — restrictive red-cell thresholds and
  component-specific guidance, carried over to interpret the clinical history.
  <https://www.nice.org.uk/guidance/ng24>

## How the references map to the schema

| Reference | Schema element |
| --- | --- |
| BSH ABO/D grouping | `abo_group`, `rhd_group`, `historical_group_concordant` |
| BSH antibody screening & identification | `antibody_screen_result`, `antibodies_identified`, `reporting_category` (Axis B) |
| BSH crossmatch / electronic issue | `crossmatch_result`, `units_crossmatched`, `units_available` |
| BSH two-sample (group-check) rule | `two_sample_rule_met`, `critical-result-alert` / `discrepancy-with-request` flags |
| SHOT ABO-incompatible / WBIT | `overall_result_status`, `critical_result_communicated`, `reported_to`, escalation invariant |
| BSH report sections | report-completeness axis (`report_completeness_percent`) |
| BSH special requirements | `special_requirements` |
| NICE NG24 thresholds | `clinical_history` interpretation |
