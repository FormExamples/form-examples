#!/bin/sh
set -euf

createuser --host=localhost --port=5432 --username=postgres --login --createdb loco || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco inpatient_clinical_note_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco inpatient_clinical_note_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco inpatient_clinical_note_production || :
loco new --name inpatient-clinical-note --db postgres --bg pg --assets none
