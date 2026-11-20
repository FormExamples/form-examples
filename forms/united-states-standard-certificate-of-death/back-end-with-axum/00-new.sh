#!/bin/sh
set -euf

createdb --host=localhost --port=5432 --username=postgres --owner=postgres united_states_standard_certificate_of_death_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres united_states_standard_certificate_of_death_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres united_states_standard_certificate_of_death_production || :
