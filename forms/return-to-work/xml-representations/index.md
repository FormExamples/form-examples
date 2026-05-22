# Return to Work — XML Representations

Archival XML representation of the Return to Work form. Each SQL
entity is emitted as one `.xml` document plus a `.dtd` schema by
`bin/xml-representations/generate-xml-representations.py`.

## File map (after generation)

| SQL table | XML file | DTD file |
| --- | --- | --- |
| `patient` | `patient.xml` | `patient.dtd` |
| `clinician` | `clinician.xml` | `clinician.dtd` |
| `employer` | `employer.xml` | `employer.dtd` |
| `return_to_work` | `return_to_work.xml` | `return_to_work.dtd` |
| `return_to_work_restriction` | `return_to_work_restriction.xml` | `return_to_work_restriction.dtd` |
| `return_to_work_grade` | `return_to_work_grade.xml` | `return_to_work_grade.dtd` |
| `return_to_work_grade_rule` | `return_to_work_grade_rule.xml` | `return_to_work_grade_rule.dtd` |
| `return_to_work_grade_flag` | `return_to_work_grade_flag.xml` | `return_to_work_grade_flag.dtd` |

## Document structure

Element names mirror the SQL column names (snake_case). Empty
strings are emitted as empty elements; SQL NULLs are emitted as
missing elements. Foreign keys are emitted as
`<xxx_id>uuid-string</xxx_id>` attributes.

## Purpose

The XML is provided as an *archival fallback* and for integration
with legacy NHS systems that consume DTD-validated documents. The
FHIR R5 Bundle remains the primary interchange format.

## Verify

```sh
bin/xml-representations/generate-xml-representations.py return-to-work
xmllint --valid --noout *.xml
```
