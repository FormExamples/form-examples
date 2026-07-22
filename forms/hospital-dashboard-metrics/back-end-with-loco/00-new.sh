#!/bin/sh
set -euf

createuser --host=localhost --port=5432 --username=postgres --login --createdb loco || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco hospital_dashboard_metrics_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco hospital_dashboard_metrics_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=loco hospital_dashboard_metrics_production || :
loco new --name hospital-dashboard-metrics --db postgres --bg pg --assets none
