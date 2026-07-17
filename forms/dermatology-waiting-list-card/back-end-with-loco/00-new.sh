#!/bin/sh
set -euf

createuser --host=localhost --port=5432 --username=postgres --login --createdb loco || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco dermatology_waiting_list_card_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco dermatology_waiting_list_card_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco dermatology_waiting_list_card_production || :
loco new --name dermatology-waiting-list-card --db postgres --bg async --assets none
