#!/bin/sh
set -euf

createuser --host=localhost --port=5432 --username=postgres --login --createdb loco || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco gen_practice_waiting_list_card_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco gen_practice_waiting_list_card_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco gen_practice_waiting_list_card_production || :
loco new --name general-practice-waiting-list-card --db postgres --bg async --assets none
