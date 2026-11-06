CREATE TABLE IF NOT EXISTS "united_kingdom_statement_of_fitness_for_work_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "fitness_category" varchar NOT NULL DEFAULT '',
    "adaptation_intensity" varchar NOT NULL DEFAULT '',
    "adaptation_count" integer NOT NULL DEFAULT 0,
    "period_days" integer NULL,
    "period_compliance" varchar NOT NULL DEFAULT '',
    "recommendation" varchar NOT NULL DEFAULT '',
    "is_within_first_six_months_of_condition" varchar NOT NULL DEFAULT '',
    "is_valid" varchar NOT NULL DEFAULT '',
    "grader_notes" text NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "clinician_override" varchar NOT NULL DEFAULT '',
    "clinician_override_reason" varchar NOT NULL DEFAULT '',
    "clinician_final_recommendation" varchar NOT NULL DEFAULT '',
    "united_kingdom_statement_of_fitness_for_work_id" uuid NOT NULL,
    CONSTRAINT "fk-united_kingdom_statement_of_fitness_for_work_grades-united_kingdom_statement_of_fitness_for_work_id-to-united_kingdom_statement_of_fitness_for_works" FOREIGN KEY ("united_kingdom_statement_of_fitness_for_work_id") REFERENCES "united_kingdom_statement_of_fitness_for_works" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE united_kingdom_statement_of_fitness_for_work_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
