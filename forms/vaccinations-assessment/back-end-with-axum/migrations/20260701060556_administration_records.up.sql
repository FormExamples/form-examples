CREATE TABLE IF NOT EXISTS "administration_records" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "vaccine_name" varchar NOT NULL DEFAULT '',
    "batch_number" varchar NOT NULL DEFAULT '',
    "expiry_date" date NULL,
    "administration_site" varchar NOT NULL DEFAULT '',
    "administration_route" varchar NOT NULL DEFAULT '',
    "dose_number" varchar NOT NULL DEFAULT '',
    "administered_by" varchar NOT NULL DEFAULT '',
    "administration_date" date NULL,
    "assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-administration_records-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE administration_records ALTER COLUMN id SET DEFAULT gen_random_uuid();
