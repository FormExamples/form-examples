CREATE TABLE IF NOT EXISTS "demographics_ethnicities" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "age" integer NULL,
    "sex" varchar NOT NULL DEFAULT '',
    "ethnicity" varchar NOT NULL DEFAULT '',
    "townsend_deprivation" double precision NULL,
    "assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-demographics_ethnicities-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE demographics_ethnicities ALTER COLUMN id SET DEFAULT gen_random_uuid();
