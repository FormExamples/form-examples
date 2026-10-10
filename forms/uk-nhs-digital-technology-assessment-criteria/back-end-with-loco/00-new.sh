#!/bin/sh
set -euf

createuser --host=localhost --port=5432 --username=postgres --login --createdb loco || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco uk_nhs_digital_technology_assessment_criteria_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco uk_nhs_digital_technology_assessment_criteria_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco uk_nhs_digital_technology_assessment_criteria_production || :
loco new --name uk-nhs-digital-technology-assessment-criteria --db postgres --bg pg --assets none
