CREATE TABLE IF NOT EXISTS "outpatient_outcome_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "outpatient_outcome_id" uuid NOT NULL UNIQUE,
    "overall_grade" varchar NOT NULL DEFAULT '',
    "clinical_grade" varchar NOT NULL DEFAULT '',
    "prom_grade" varchar NOT NULL DEFAULT '',
    "prem_grade" varchar NOT NULL DEFAULT '',
    "operational_grade" varchar NOT NULL DEFAULT '',
    "result_notes" text NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk-outpatient_outcome_grades-outpatient_outcome_id-to-outpatient_outcomes" FOREIGN KEY ("outpatient_outcome_id") REFERENCES "outpatient_outcomes" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE outpatient_outcome_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
