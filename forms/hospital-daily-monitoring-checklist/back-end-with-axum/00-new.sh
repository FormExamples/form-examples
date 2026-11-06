#!/bin/sh
set -euf

createdb --host=localhost --port=5432 --username=postgres --owner=postgres hospital_daily_monitoring_checklist_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres hospital_daily_monitoring_checklist_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres hospital_daily_monitoring_checklist_production || :
