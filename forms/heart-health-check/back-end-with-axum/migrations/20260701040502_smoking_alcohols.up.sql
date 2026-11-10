CREATE TABLE IF NOT EXISTS "smoking_alcohols" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "smoking_status" varchar NOT NULL DEFAULT '',
    "cigarettes_per_day" integer NULL,
    "years_since_quit" integer NULL,
    "alcohol_units_per_week" double precision NULL,
    "alcohol_frequency" varchar NOT NULL DEFAULT '',
    "assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-smoking_alcohols-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE smoking_alcohols ALTER COLUMN id SET DEFAULT gen_random_uuid();
