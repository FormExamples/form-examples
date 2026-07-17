# Otorhinolaryngology Waiting List Card — FHIR R5

Generated HL7 FHIR R5 JSON resources, one file per SQL table in
[`../sql/`](../sql/). Regenerate with
[`bin/fhir-r5/generate-fhir-r5-representations.py`](../../../bin/fhir-r5/generate-fhir-r5-representations.py)
after schema changes.

The card is intended to be exchanged as a FHIR R5 Bundle containing:

- `Patient` — from `patient`
- `Practitioner` — from `practitioner`
- `ServiceRequest` — from `ent_waiting_list_card`
- `Appointment` — from `ent_waiting_list_card_appointment`
- `Observation` — for the computed Waiting Time Status grade

This directory only holds the per-table representations; Bundle assembly
happens at runtime in the backend.
