#!/bin/sh
set -euf

createuser --host=localhost --port=5432 --username=postgres --login --createdb loco || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco hospital_daily_monitoring_checklist_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco hospital_daily_monitoring_checklist_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco hospital_daily_monitoring_checklist_production || :
loco new --name hospital-daily-monitoring-checklist --db postgres --bg pg --assets none
