#!/bin/sh
set -euf

createdb --host=localhost --port=5432 --username=postgres --owner=postgres perioperative_optimization_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres perioperative_optimization_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres perioperative_optimization_production || :
