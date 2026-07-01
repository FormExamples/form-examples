#!/bin/sh
set -euf

createuser --host=localhost --port=5432 --username=postgres --login --createdb loco || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco return_to_work_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco return_to_work_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco return_to_work_production || :
loco new --name return-to-work --db postgres --bg async --assets none
