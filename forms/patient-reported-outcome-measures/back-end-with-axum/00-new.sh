#!/bin/sh
set -euf

createdb --host=localhost --port=5432 --username=postgres --owner=postgres patient_reported_outcome_measures_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres patient_reported_outcome_measures_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres patient_reported_outcome_measures_production || :
