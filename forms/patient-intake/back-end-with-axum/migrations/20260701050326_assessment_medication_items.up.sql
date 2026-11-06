CREATE TABLE IF NOT EXISTS "assessment_medication_items" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "medication_name" varchar NOT NULL DEFAULT '',
    "dose" varchar NOT NULL DEFAULT '',
    "frequency" varchar NOT NULL DEFAULT '',
    "route" varchar NOT NULL DEFAULT '',
    "prescriber" varchar NOT NULL DEFAULT '',
    "reason" varchar NOT NULL DEFAULT '',
    "start_date" date NULL,
    "sort_order" integer NOT NULL DEFAULT 0,
    "assessment_medication_id" uuid NOT NULL,
    CONSTRAINT "fk-assessment_medication_items-assessment_medication_id-to-assessment_medications" FOREIGN KEY ("assessment_medication_id") REFERENCES "assessment_medications" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessment_medication_items ALTER COLUMN id SET DEFAULT gen_random_uuid();
