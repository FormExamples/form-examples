#!/bin/sh
set -euf

createdb --host=localhost --port=5432 --username=postgres --owner=postgres united_kingdom_council_tax_discount_application_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres united_kingdom_council_tax_discount_application_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres united_kingdom_council_tax_discount_application_production || :
