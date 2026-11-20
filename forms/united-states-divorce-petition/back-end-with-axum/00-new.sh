#!/bin/sh
set -euf

createdb --host=localhost --port=5432 --username=postgres --owner=postgres united_states_divorce_petition_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres united_states_divorce_petition_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres united_states_divorce_petition_production || :
