#!/bin/sh
set -euf

createdb --host=localhost --port=5432 --username=postgres --owner=postgres hospital_performance_indicators_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres hospital_performance_indicators_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres hospital_performance_indicators_production || :
