#!/bin/sh
set -euf

createdb --host=localhost --port=5432 --username=postgres --owner=postgres uk_nhs_digital_technology_assessment_criteria_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres uk_nhs_digital_technology_assessment_criteria_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres uk_nhs_digital_technology_assessment_criteria_production || :
