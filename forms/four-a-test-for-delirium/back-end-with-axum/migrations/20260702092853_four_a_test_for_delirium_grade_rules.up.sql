CREATE TABLE IF NOT EXISTS "four_a_test_for_delirium_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "item" varchar NOT NULL,
    "points" integer NULL,
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "four_a_test_for_delirium_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-four_a_test_for_delirium_grade_rules-four_a_test_for_delirium_grade_id-to-four_a_test_for_delirium_grades" FOREIGN KEY ("four_a_test_for_delirium_grade_id") REFERENCES "four_a_test_for_delirium_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE four_a_test_for_delirium_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
