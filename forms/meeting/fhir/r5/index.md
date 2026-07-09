# Meeting — FHIR HL7 R5 Representations

Generated FHIR HL7 R5 JSON resources, one file per SQL table. Produced by
`bin/fhir-r5/generate-fhir-r5-representations.py` from the migrations in
[`../sql/`](../sql/).

The mapping is one resource per top-level entity: `meeting` is the
*Appointment* (or *Encounter* in the clinical MDT case), `participant`
rolls up into `Appointment.participant`, `agenda_item` into a contained
`PlanDefinition` action list, and the result-side collections
(`action_item`, `meeting_output`, `meeting_outcome`) into linked
*Task* / *DocumentReference* / *Observation* resources. The recurrence
row mirrors the RFC 5545 `RRULE` and is exported via
*Appointment.recurrenceTemplate*.

See the sibling [`AGENTS.md`](./AGENTS.md) for agent instructions.
