# Medical Information Form for Air Travel — XML representations

XML and DTD representations, one pair per SQL table in `../sql-migrations/`.
The XML form is the archival export used to email an airline medical desk
that cannot accept FHIR R5 JSON.

## Files

```
patient.xml                                                              patient.dtd
clinician.xml                                                            clinician.dtd
medical_information_form_for_air_travel.xml                              medical_information_form_for_air_travel.dtd
medical_information_form_for_air_travel_grade.xml                        medical_information_form_for_air_travel_grade.dtd
medical_information_form_for_air_travel_grade_rule.xml                   medical_information_form_for_air_travel_grade_rule.dtd
medical_information_form_for_air_travel_grade_flag.xml                   medical_information_form_for_air_travel_grade_flag.dtd
```

## Conventions

- Element names use the SQL column name (snake_case) verbatim.
- Root element name is the SQL table name.
- Child element order matches the SQL column order in the migration file.
- Each XML example references its DTD via `<!DOCTYPE ... SYSTEM "<table>.dtd">`.
- Empty elements (`<column_name></column_name>`) for NULL or empty-string
  values, to preserve column-order positions.
- Dates are ISO 8601 (`YYYY-MM-DD`); timestamps are ISO 8601 with `Z`.
- Example values are consistent with the FHIR R5 example scenario in
  `../fhir-r5/` (passenger on supplemental oxygen flying Emirates EK002
  LHR–DXB on 2026-06-12).

## Verify

```sh
bin/test-form medical-information-form-for-air-travel
xmllint --noout --dtdvalid xml-representations/patient.dtd xml-representations/patient.xml
```
