CREATE TABLE IF NOT EXISTS "assessment_medication_items" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "medication_name" varchar NOT NULL DEFAULT '',
    "dose" varchar NOT NULL DEFAULT '',
    "frequency" varchar NOT NULL DEFAULT '',
    "route" varchar NOT NULL DEFAULT '',
    "indication" text NOT NULL DEFAULT '',
    "prescribing_clinician" varchar NOT NULL DEFAULT '',
    "sort_order" integer NOT NULL DEFAULT 0,
    "assessment_current_medication_id" uuid NOT NULL,
    CONSTRAINT "fk-assessment_medication_items-assessment_current_medication_id-to-assessment_current_medications" FOREIGN KEY ("assessment_current_medication_id") REFERENCES "assessment_current_medications" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessment_medication_items ALTER COLUMN id SET DEFAULT gen_random_uuid();
