#!/bin/sh
set -euf

createuser --host=localhost --port=5432 --username=postgres --login --createdb loco || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco perioperative_optimization_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco perioperative_optimization_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco perioperative_optimization_production || :
loco new --name perioperative-optimization --db postgres --bg pg --assets none
