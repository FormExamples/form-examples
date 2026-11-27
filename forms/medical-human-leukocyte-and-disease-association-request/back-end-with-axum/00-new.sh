#!/bin/sh
set -euf

createdb --host=localhost --port=5432 --username=postgres --owner=postgres medical_human_leukocyte_and_disease_association_request_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres medical_human_leukocyte_and_disease_association_request_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres medical_human_leukocyte_and_disease_association_request_production || :
