# who-surgical-safety-checklist — XML representations

One XML file plus its DTD is generated per SQL table by
`bin/xml-representations/generate-xml-representations.py`. Do not hand-edit —
regenerate from the form's `../sql-migrations/` directory instead.

## Files

| File | Source table |
| --- | --- |
| `patient.xml`, `patient.dtd` | `patient` |
| `clinician.xml`, `clinician.dtd` | `clinician` |
| `who_surgical_safety_checklist.xml`, `who_surgical_safety_checklist.dtd` | `who_surgical_safety_checklist` |
| `team_member.xml`, `team_member.dtd` | `team_member` |
