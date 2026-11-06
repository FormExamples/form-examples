CREATE TABLE IF NOT EXISTS "clinical_reviews" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "post_vaccination_observation" integer NULL,
    "immediate_reaction" varchar NOT NULL DEFAULT '',
    "reaction_details" text NOT NULL DEFAULT '',
    "next_dose_due" date NULL,
    "catch_up_schedule_needed" varchar NOT NULL DEFAULT '',
    "referral_needed" varchar NOT NULL DEFAULT '',
    "clinician_notes" text NOT NULL DEFAULT '',
    "reviewing_clinician" varchar NOT NULL DEFAULT '',
    "assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-clinical_reviews-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE clinical_reviews ALTER COLUMN id SET DEFAULT gen_random_uuid();
