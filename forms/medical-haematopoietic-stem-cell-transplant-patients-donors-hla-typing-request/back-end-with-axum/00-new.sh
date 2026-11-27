#!/bin/sh
set -euf

createdb --host=localhost --port=5432 --username=postgres --owner=postgres medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request_production || :
