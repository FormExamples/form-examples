CREATE TABLE IF NOT EXISTS "return_to_work_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "fitness_statement" varchar NOT NULL DEFAULT 'not-fit',
    "restriction_priority" varchar NOT NULL DEFAULT 'routine',
    "rule_count" integer NOT NULL DEFAULT 0,
    "flag_count" integer NOT NULL DEFAULT 0,
    "graded_at" timestamp with time zone NOT NULL,
    "return_to_work_id" uuid NOT NULL,
    CONSTRAINT "fk-return_to_work_grades-return_to_work_id-to-return_to_works" FOREIGN KEY ("return_to_work_id") REFERENCES "return_to_works" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE return_to_work_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
