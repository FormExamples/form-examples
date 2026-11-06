CREATE TABLE IF NOT EXISTS "assessment_current_medications" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "takes_regular_medications" varchar NOT NULL DEFAULT '',
    "takes_over_the_counter" varchar NOT NULL DEFAULT '',
    "takes_herbal_supplements" varchar NOT NULL DEFAULT '',
    "herbal_supplement_details" text NOT NULL DEFAULT '',
    "hormone_therapy" varchar NOT NULL DEFAULT '',
    "hormone_therapy_details" text NOT NULL DEFAULT '',
    "medication_notes" text NOT NULL DEFAULT '',
    "assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-assessment_current_medications-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessment_current_medications ALTER COLUMN id SET DEFAULT gen_random_uuid();
