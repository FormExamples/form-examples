#!/bin/sh
set -euf

createdb --host=localhost --port=5432 --username=postgres --owner=postgres expense_reimbursement_development || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres expense_reimbursement_test || :
createdb --host=localhost --port=5432 --username=postgres --owner=postgres expense_reimbursement_production || :
