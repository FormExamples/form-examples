# XML Representations — UK Statement of Fitness for Work

XML + DTD representations of every SQL table in
`../sql-migrations/`. Used for archival and import into legacy
occupational-health systems.

## Files

| Entity | XML | DTD |
| --- | --- | --- |
| patient | `patient.xml` | `patient.dtd` |
| clinician | `clinician.xml` | `clinician.dtd` |
| medical_practice | `medical_practice.xml` | `medical_practice.dtd` |
| fit_note | `united_kingdom_statement_of_fitness_for_work.xml` | `united_kingdom_statement_of_fitness_for_work.dtd` |
| grade | `united_kingdom_statement_of_fitness_for_work_grade.xml` | `..._grade.dtd` |
| grade_rule | `united_kingdom_statement_of_fitness_for_work_grade_rule.xml` | `..._grade_rule.dtd` |
| grade_flag | `united_kingdom_statement_of_fitness_for_work_grade_flag.xml` | `..._grade_flag.dtd` |

## Regeneration

```sh
bin/xml-representations/generate-xml-representations.py united-kingdom-statement-of-fitness-for-work
```

Do not edit XML files by hand — they are generated from the SQL migrations.
