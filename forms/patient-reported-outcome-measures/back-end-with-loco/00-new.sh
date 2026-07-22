#!/bin/sh
set -euf

createuser --host=localhost --port=5432 --username=postgres --login --createdb loco || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco patient_reported_outcome_measures_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco patient_reported_outcome_measures_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco patient_reported_outcome_measures_production || :
loco new --name patient-reported-outcome-measures --db postgres --bg pg --assets none
