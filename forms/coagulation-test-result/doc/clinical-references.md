# Coagulation Test Result — clinical references

Grounded reference material for the structured interpretation and reporting of
coagulation / haemostasis test results. These sources anchor the four-axis
interpretation grade, the structured-reporting categories, the critical-value
thresholds, and the critical-result alerting rules used by this form.

## Reporting and critical-result communication

### RCPath — The communication of critical and unexpected pathology results

The Royal College of Pathologists (RCPath) guideline sets out how laboratories
should communicate critical, urgent, and unexpected significant results. Methods
of communication should be established to suit each referring team; laboratories
can use their Laboratory Information Management System (LIMS) to generate
automated electronic alerts, and should regularly audit critical-result
communication.

Key principles relevant to this form:

- **Critical (panic) values must be actively communicated** to the requester and
  the communication documented. This maps to `critical_value_present`,
  `critical_value_detail`, `critical_result_communicated`, and `reported_to`, and
  drives the `critical-result-alert` safety flag and the Axis D *critical-alert*
  escalation.
- **Structured, actionable reporting** — a report should address the clinical
  question, state the result values, and offer guidance on management. This maps
  to `impression`, `recommended_follow_up`, and the follow-up-urgency axis.

Source:

- The communication of critical and unexpected pathology results, RCPath.
  <https://www.rcpath.org/static/bb86b370-1545-4c5a-b5826a2c431934f5/The-communication-of-critical-and-unexpected-pathology-results.pdf>

## Critical-value thresholds

### INR > 8 — oral-anticoagulation reversal (BSH)

British Society for Haematology (BSH) oral-anticoagulation guidance treats a
markedly raised INR as a bleeding-risk emergency: an INR > 8 (even without
bleeding) warrants action and is a recognized reversal threshold (withhold
warfarin; consider oral vitamin K). Serious / major bleeding at any INR is
reversed urgently with intravenous vitamin K plus prothrombin complex
concentrate (PCC). This anchors the INR critical rule (`inr` > 8 →
`critical_value_present` → Axis A *critical* + Axis D *critical-alert* +
`critical-result-alert` flag).

### Fibrinogen < 1.0 g/L and the DIC picture (BSH)

A Clauss fibrinogen below ~1.0 g/L is a major-haemorrhage / consumptive marker.
A **DIC picture** — low fibrinogen with a raised D-dimer and prolonged PT/APTT —
is a consumptive coagulopathy requiring immediate communication and treatment of
the underlying cause. These anchor the fibrinogen and DIC critical rules.

Sources:

- BSH guidelines index (oral anticoagulation with warfarin; DIC diagnosis and
  management). <https://b-s-h.org.uk/guidelines/>

## Test interpretation context

### D-dimer (NICE NG158)

D-dimer is a fibrin-degradation marker used to help rule out venous
thromboembolism at low / unlikely pre-test probability, and is raised in DIC.
DOACs and recent surgery / pregnancy / inflammation can elevate it. This context
informs the `d_dimer` interpretation and the `reporting_category` label.

- NICE NG158 *Venous thromboembolic diseases: diagnosis, management and
  thrombophilia testing*. <https://www.nice.org.uk/guidance/ng158>

### Anticoagulant effect on PT / APTT

Warfarin prolongs PT/INR; unfractionated heparin prolongs APTT and TT; direct
oral anticoagulants (DOACs) variably affect PT/APTT/TT and elevate D-dimer.
`on_anticoagulant` and `anticoagulant_agent` qualify the interpretation so an
expected anticoagulant effect is not over-classified as a critical abnormality.

## How the references map to the schema

| Reference | Schema element |
| --- | --- |
| RCPath critical-result communication | `critical_value_present`, `critical_value_detail`, `critical_result_communicated`, `reported_to`, `critical-result-alert` flag |
| RCPath actionable reporting | `impression`, `recommended_follow_up`, follow-up-urgency axis |
| RCPath mandatory report sections | report-completeness axis (`report_completeness_percent`) |
| BSH INR > 8 reversal threshold | `inr`, critical-value rule, Axis A / Axis D escalation |
| BSH fibrinogen / DIC | `fibrinogen_g_l`, `d_dimer`, `reporting_category` (DIC-picture) |
| NICE NG158 D-dimer | `d_dimer`, `reporting_category` |
| Anticoagulant effect | `on_anticoagulant`, `anticoagulant_agent` |
