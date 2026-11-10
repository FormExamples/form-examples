CREATE TABLE IF NOT EXISTS "hip_replacement_surgery_evaluation_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "ohs_total" integer NULL,
    "ohs_category" varchar NOT NULL DEFAULT '',
    "computed_candidacy" varchar NOT NULL DEFAULT '',
    "final_candidacy" varchar NOT NULL DEFAULT '',
    "override_reason" varchar NOT NULL DEFAULT '',
    "clinician_notes" text NOT NULL DEFAULT '',
    "signed_by_name" varchar NOT NULL DEFAULT '',
    "signed_at" timestamp with time zone NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "hip_replacement_surgery_evaluation_id" uuid NOT NULL,
    CONSTRAINT "fk-hip_replacement_surgery_evaluation_grades-hip_replacement_surgery_evaluation_id-to-hip_replacement_surgery_evaluations" FOREIGN KEY ("hip_replacement_surgery_evaluation_id") REFERENCES "hip_replacement_surgery_evaluations" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE hip_replacement_surgery_evaluation_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
