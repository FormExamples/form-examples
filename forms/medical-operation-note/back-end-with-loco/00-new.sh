#!/bin/sh
set -euf

createuser --host=localhost --port=5432 --username=postgres --login --createdb loco || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco medical_operation_note_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco medical_operation_note_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco medical_operation_note_production || :
loco new --name medical-operation-note --db postgres --bg async --assets serverside -a
