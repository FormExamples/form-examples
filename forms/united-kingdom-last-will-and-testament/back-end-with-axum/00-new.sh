#!/bin/sh
set -euf

createdb --host=localhost --port=5432 --username=postgres --owner=postgres united_kingdom_last_will_and_testament_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres united_kingdom_last_will_and_testament_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres united_kingdom_last_will_and_testament_production || :
