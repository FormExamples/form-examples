CREATE TABLE IF NOT EXISTS "grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "mec_category_coc" varchar NOT NULL DEFAULT '',
    "mec_category_pop" varchar NOT NULL DEFAULT '',
    "mec_category_implant" varchar NOT NULL DEFAULT '',
    "mec_category_injection" varchar NOT NULL DEFAULT '',
    "mec_category_iud" varchar NOT NULL DEFAULT '',
    "mec_category_ius" varchar NOT NULL DEFAULT '',
    "overall_risk_level" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-grades-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
