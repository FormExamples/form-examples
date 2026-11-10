CREATE TABLE IF NOT EXISTS "consent_informations" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "information_provided" integer NULL,
    "risks_explained" integer NULL,
    "benefits_explained" integer NULL,
    "questions_answered" integer NULL,
    "consent_given" varchar NOT NULL DEFAULT '',
    "consent_date" date NULL,
    "guardian_consent" varchar NOT NULL DEFAULT '',
    "assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-consent_informations-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE consent_informations ALTER COLUMN id SET DEFAULT gen_random_uuid();
