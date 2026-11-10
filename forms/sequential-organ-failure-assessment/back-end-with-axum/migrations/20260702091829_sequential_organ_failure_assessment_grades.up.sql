CREATE TABLE IF NOT EXISTS "sequential_organ_failure_assessment_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "respiration_score" integer NULL,
    "coagulation_score" integer NULL,
    "liver_score" integer NULL,
    "cardiovascular_score" integer NULL,
    "cns_score" integer NULL,
    "renal_score" integer NULL,
    "total_score" integer NULL,
    "delta_sofa" integer NULL,
    "mortality_band" varchar NOT NULL DEFAULT '',
    "sepsis3" boolean NOT NULL DEFAULT false,
    "graded_at" timestamp with time zone NOT NULL,
    "sequential_organ_failure_assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-sequential_organ_failure_assessment_grades-sequential_organ_failure_assessment_id-to-sequential_organ_failure_assessments" FOREIGN KEY ("sequential_organ_failure_assessment_id") REFERENCES "sequential_organ_failure_assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE sequential_organ_failure_assessment_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
