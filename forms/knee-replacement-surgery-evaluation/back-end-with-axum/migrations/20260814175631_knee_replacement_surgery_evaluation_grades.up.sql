CREATE TABLE IF NOT EXISTS "knee_replacement_surgery_evaluation_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "oks_total" integer NULL,
    "computed_oks_category" varchar NOT NULL DEFAULT '',
    "final_oks_category" varchar NOT NULL DEFAULT '',
    "max_kellgren_lawrence_grade" integer NULL,
    "computed_candidacy" varchar NOT NULL DEFAULT '',
    "final_candidacy" varchar NOT NULL DEFAULT '',
    "override_reason" varchar NOT NULL DEFAULT '',
    "clinician_notes" text NOT NULL DEFAULT '',
    "signed_by_name" varchar NOT NULL DEFAULT '',
    "signed_at" timestamp with time zone NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "knee_replacement_surgery_evaluation_id" uuid NOT NULL,
    CONSTRAINT "fk-knee_replacement_surgery_evaluation_grades-knee_replacement_surgery_evaluation_id-to-knee_replacement_surgery_evaluations" FOREIGN KEY ("knee_replacement_surgery_evaluation_id") REFERENCES "knee_replacement_surgery_evaluations" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE knee_replacement_surgery_evaluation_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
