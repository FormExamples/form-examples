#!/bin/sh
set -euf

createuser --host=localhost --port=5432 --username=postgres --login --createdb loco || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco medical_device_assessment_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco medical_device_assessment_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco medical_device_assessment_production || :
loco new --name medical-device-assessment --db postgres --bg pg --assets none
