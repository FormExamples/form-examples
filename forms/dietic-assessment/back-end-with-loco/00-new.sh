#!/bin/sh
set -euf

createuser --host=localhost --port=5432 --username=postgres --login --createdb loco || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco dietic_assessment_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco dietic_assessment_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco dietic_assessment_production || :
loco new --name dietic-assessment --db postgres --bg pg --assets none
