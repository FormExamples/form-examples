#!/bin/sh
set -euf

createdb --host=localhost --port=5432 --username=postgres --owner=postgres inpatient_clinical_note_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres inpatient_clinical_note_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres inpatient_clinical_note_production || :
