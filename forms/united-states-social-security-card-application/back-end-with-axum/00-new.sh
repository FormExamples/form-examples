#!/bin/sh
set -euf

createdb --host=localhost --port=5432 --username=postgres --owner=postgres united_states_social_security_card_application_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres united_states_social_security_card_application_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres united_states_social_security_card_application_production || :
