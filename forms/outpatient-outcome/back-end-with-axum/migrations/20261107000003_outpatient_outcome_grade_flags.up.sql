CREATE TABLE IF NOT EXISTS "outpatient_outcome_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "grade_id" uuid NOT NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "description" text NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT 'medium',
    CONSTRAINT "fk-outpatient_outcome_grade_flags-grade_id-to-outpatient_outcome_grades" FOREIGN KEY ("grade_id") REFERENCES "outpatient_outcome_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE outpatient_outcome_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
