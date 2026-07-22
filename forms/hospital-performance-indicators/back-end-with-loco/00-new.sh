#!/bin/sh
set -euf

createuser --host=localhost --port=5432 --username=postgres --login --createdb loco || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco hospital_performance_indicators_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco hospital_performance_indicators_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco hospital_performance_indicators_production || :
loco new --name hospital-performance-indicators --db postgres --bg pg --assets none
