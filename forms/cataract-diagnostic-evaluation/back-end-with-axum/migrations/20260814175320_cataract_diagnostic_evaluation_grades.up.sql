CREATE TABLE IF NOT EXISTS "cataract_diagnostic_evaluation_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "computed_locs_iii_severity_right" varchar NOT NULL DEFAULT '',
    "computed_locs_iii_severity_left" varchar NOT NULL DEFAULT '',
    "computed_surgical_candidacy" varchar NOT NULL DEFAULT '',
    "final_surgical_candidacy" varchar NOT NULL DEFAULT '',
    "override_reason" varchar NOT NULL DEFAULT '',
    "functional_impact_score" integer NULL,
    "clinician_notes" text NOT NULL DEFAULT '',
    "signed_by_name" varchar NOT NULL DEFAULT '',
    "signed_at" timestamp with time zone NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "cataract_diagnostic_evaluation_id" uuid NOT NULL,
    CONSTRAINT "fk-cataract_diagnostic_evaluation_grades-cataract_diagnostic_evaluation_id-to-cataract_diagnostic_evaluations" FOREIGN KEY ("cataract_diagnostic_evaluation_id") REFERENCES "cataract_diagnostic_evaluations" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE cataract_diagnostic_evaluation_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
