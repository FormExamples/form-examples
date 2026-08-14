#!/bin/sh
set -euf

createuser --host=localhost --port=5432 --username=postgres --login --createdb loco || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco hip_replacement_surgery_evaluation_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco hip_replacement_surgery_evaluation_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco hip_replacement_surgery_evaluation_production || :
loco new --name hip-replacement-surgery-evaluation --db postgres --bg pg --assets none
