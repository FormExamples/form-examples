CREATE TABLE IF NOT EXISTS "hernia_diagnostic_evaluation_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "hernia_type" varchar NOT NULL DEFAULT '',
    "hernia_subtype" varchar NOT NULL DEFAULT '',
    "ehs_classification" varchar NOT NULL DEFAULT '',
    "ehs_size_grade" varchar NOT NULL DEFAULT '',
    "reducibility_status" varchar NOT NULL DEFAULT '',
    "computed_urgency" varchar NOT NULL DEFAULT '',
    "final_urgency" varchar NOT NULL DEFAULT '',
    "override_reason" varchar NOT NULL DEFAULT '',
    "recommendation" varchar NOT NULL DEFAULT '',
    "clinician_notes" text NOT NULL DEFAULT '',
    "signed_by_name" varchar NOT NULL DEFAULT '',
    "signed_at" timestamp with time zone NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "hernia_diagnostic_evaluation_id" uuid NOT NULL,
    CONSTRAINT "fk-hernia_diagnostic_evaluation_grades-hernia_diagnostic_evaluation_id-to-hernia_diagnostic_evaluations" FOREIGN KEY ("hernia_diagnostic_evaluation_id") REFERENCES "hernia_diagnostic_evaluations" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE hernia_diagnostic_evaluation_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
