CREATE TABLE IF NOT EXISTS "united_kingdom_statement_of_fitness_for_work_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "united_kingdom_statement_of_fitness_for_work_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-united_kingdom_statement_of_fitness_for_work_grade_flags-united_kingdom_statement_of_fitness_for_work_grade_id-to-united_kingdom_statement_of_fitness_for_work_grades" FOREIGN KEY ("united_kingdom_statement_of_fitness_for_work_grade_id") REFERENCES "united_kingdom_statement_of_fitness_for_work_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE united_kingdom_statement_of_fitness_for_work_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
