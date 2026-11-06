CREATE TABLE IF NOT EXISTS "assessment_current_medications" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "taking_psychotropic_medication" varchar NOT NULL DEFAULT '',
    "medication_adherence" varchar NOT NULL DEFAULT '',
    "side_effects" varchar NOT NULL DEFAULT '',
    "side_effects_details" text NOT NULL DEFAULT '',
    "over_the_counter_medications" text NOT NULL DEFAULT '',
    "supplements" text NOT NULL DEFAULT '',
    "medication_notes" text NOT NULL DEFAULT '',
    "assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-assessment_current_medications-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessment_current_medications ALTER COLUMN id SET DEFAULT gen_random_uuid();
