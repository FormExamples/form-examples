ALTER TABLE "architecture_decision_records" DROP CONSTRAINT IF EXISTS "architecture_decision_records_decision_group_check";
ALTER TABLE "architecture_decision_records" DROP CONSTRAINT IF EXISTS "architecture_decision_records_status_check";
ALTER TABLE "authors" DROP CONSTRAINT IF EXISTS "authors_role_check";
