#!/bin/sh
set -euf

createdb --host=localhost --port=5432 --username=postgres --owner=postgres united_states_health_care_power_of_attorney_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres united_states_health_care_power_of_attorney_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres united_states_health_care_power_of_attorney_production || :
