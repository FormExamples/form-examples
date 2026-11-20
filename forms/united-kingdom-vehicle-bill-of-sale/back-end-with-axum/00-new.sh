#!/bin/sh
set -euf

createdb --host=localhost --port=5432 --username=postgres --owner=postgres united_kingdom_vehicle_bill_of_sale_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres united_kingdom_vehicle_bill_of_sale_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres united_kingdom_vehicle_bill_of_sale_production || :
