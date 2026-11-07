CREATE TABLE IF NOT EXISTS "assessment_other_medications" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "current_management_id" uuid NOT NULL,
    "medication_name" varchar NOT NULL DEFAULT '',
    "dose" varchar NOT NULL DEFAULT '',
    "frequency" varchar NOT NULL DEFAULT '',
    "sort_order" integer NOT NULL DEFAULT 0,
    CONSTRAINT "fk-assessment_other_medications-current_management_id-to-assessment_current_managements" FOREIGN KEY ("current_management_id") REFERENCES "assessment_current_managements" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessment_other_medications ALTER COLUMN id SET DEFAULT gen_random_uuid();
