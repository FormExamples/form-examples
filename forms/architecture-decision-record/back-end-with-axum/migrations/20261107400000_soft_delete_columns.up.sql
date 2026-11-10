ALTER TABLE "authors" ADD COLUMN "deleted_at" timestamp with time zone NULL;
ALTER TABLE "organizations" ADD COLUMN "deleted_at" timestamp with time zone NULL;
ALTER TABLE "architecture_decision_records" ADD COLUMN "deleted_at" timestamp with time zone NULL;
ALTER TABLE "architecture_decision_record_positions" ADD COLUMN "deleted_at" timestamp with time zone NULL;
ALTER TABLE "architecture_decision_record_notes" ADD COLUMN "deleted_at" timestamp with time zone NULL;
