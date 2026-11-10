#!/bin/sh
set -euf

createdb --host=localhost --port=5432 --username=postgres --owner=postgres hip_replacement_surgery_evaluation_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres hip_replacement_surgery_evaluation_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres hip_replacement_surgery_evaluation_production || :
