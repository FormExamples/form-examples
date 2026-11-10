CREATE TABLE IF NOT EXISTS "immunization_histories" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "has_vaccination_record" varchar NOT NULL DEFAULT '',
    "record_source" varchar NOT NULL DEFAULT '',
    "last_review_date" date NULL,
    "previous_adverse_reactions" varchar NOT NULL DEFAULT '',
    "adverse_reaction_details" text NOT NULL DEFAULT '',
    "immunocompromised" varchar NOT NULL DEFAULT '',
    "immunocompromised_details" text NOT NULL DEFAULT '',
    "assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-immunization_histories-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE immunization_histories ALTER COLUMN id SET DEFAULT gen_random_uuid();
