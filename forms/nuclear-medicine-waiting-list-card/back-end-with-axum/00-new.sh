#!/bin/sh
set -euf

createdb --host=localhost --port=5432 --username=postgres --owner=postgres nuclear_med_waiting_list_card_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres nuclear_med_waiting_list_card_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres nuclear_med_waiting_list_card_production || :
