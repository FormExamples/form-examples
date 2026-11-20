#!/bin/sh
set -euf

createdb --host=localhost --port=5432 --username=postgres --owner=postgres united_kingdom_vehicle_registration_application_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres united_kingdom_vehicle_registration_application_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres united_kingdom_vehicle_registration_application_production || :
