# Issue Tracker — FHIR HL7 R5 representations

Generated FHIR R5 JSON resources, one per SQL entity. The mapping reuses the
same FHIR resources used by clinical assessments — appropriate when the
issue is a clinical safety event, semantically loose for non-clinical issues
but still valid FHIR.

| SQL table | FHIR R5 resource | Purpose |
| --- | --- | --- |
| `reporter` | Patient | Identity of the person who reported the issue |
| `participant` | Patient | Identity of any other person involved |
| `issue_tracker` | Encounter | The issue itself, with the nine SOAP-style sections as Observations |
| `issue_tracker_grade` | ClinicalImpression | Computed and signed-off grading result |
| `issue_tracker_grade_rule` | DetectedIssue (finding) | Rule that fired during grading |
| `issue_tracker_grade_flag` | DetectedIssue (flag) | Safety-critical flag |

Regenerate with `python3 bin/fhir-r5/generate-fhir-r5-representations.py`.

See [`AGENTS/fhir-r5.md`](../../../AGENTS/fhir-r5.md) for the FHIR
conventions (R5, resourceType, meta.profile, etc.).
