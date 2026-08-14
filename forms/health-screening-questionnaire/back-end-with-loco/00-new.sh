#!/bin/sh
set -euf

createuser --host=localhost --port=5432 --username=postgres --login --createdb loco || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco health_screening_questionnaire_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco health_screening_questionnaire_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco health_screening_questionnaire_production || :
loco new --name health-screening-questionnaire --db postgres --bg pg --assets none
