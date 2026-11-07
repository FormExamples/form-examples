CREATE TABLE IF NOT EXISTS "grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "assessment_id" uuid NOT NULL UNIQUE,
    "cfs_score" integer NOT NULL DEFAULT 1,
    "cfs_category" varchar NOT NULL DEFAULT '',
    "functional_domain_score" integer NULL,
    "cognitive_domain_score" integer NULL,
    "mobility_domain_score" integer NULL,
    "nutrition_domain_score" integer NULL,
    "polypharmacy_domain_score" integer NULL,
    "graded_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk-grades-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
