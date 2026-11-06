#!/bin/sh
set -euf

createdb --host=localhost --port=5432 --username=postgres --owner=postgres hospital_dashboard_metrics_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres hospital_dashboard_metrics_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres hospital_dashboard_metrics_production || :
