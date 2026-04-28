#!/bin/sh
set -euf

createuser --host=localhost --port=5432 --username=postgres --login --createdb loco || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco outpatient_outcome_report_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco outpatient_outcome_report_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco outpatient_outcome_report_production || :
loco new --name outpatient-outcome-report --db postgres --bg async --assets serverside
