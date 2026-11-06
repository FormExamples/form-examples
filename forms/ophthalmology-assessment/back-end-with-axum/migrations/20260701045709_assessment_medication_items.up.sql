CREATE TABLE IF NOT EXISTS "assessment_medication_items" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "medication_name" varchar NOT NULL DEFAULT '',
    "dose" varchar NOT NULL DEFAULT '',
    "frequency" varchar NOT NULL DEFAULT '',
    "route" varchar NOT NULL DEFAULT '',
    "eye" varchar NOT NULL DEFAULT '',
    "indication" varchar NOT NULL DEFAULT '',
    "sort_order" integer NOT NULL DEFAULT 0,
    "current_medications_id" uuid NOT NULL,
    CONSTRAINT "fk-assessment_medication_items-current_medications_id-to-assessment_current_medications" FOREIGN KEY ("current_medications_id") REFERENCES "assessment_current_medications" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessment_medication_items ALTER COLUMN id SET DEFAULT gen_random_uuid();
