#!/bin/sh
set -euf

createdb --host=localhost --port=5432 --username=postgres --owner=postgres cataract_diagnostic_evaluation_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres cataract_diagnostic_evaluation_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres cataract_diagnostic_evaluation_production || :
