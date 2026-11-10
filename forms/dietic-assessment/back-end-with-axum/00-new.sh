#!/bin/sh
set -euf

createdb --host=localhost --port=5432 --username=postgres --owner=postgres dietic_assessment_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres dietic_assessment_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres dietic_assessment_production || :
