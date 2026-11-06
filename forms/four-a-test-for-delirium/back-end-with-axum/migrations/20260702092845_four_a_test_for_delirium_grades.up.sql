CREATE TABLE IF NOT EXISTS "four_a_test_for_delirium_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "item1_score" integer NULL,
    "item2_score" integer NULL,
    "item3_score" integer NULL,
    "item4_score" integer NULL,
    "total_score" integer NULL,
    "interpretation" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "four_a_test_for_delirium_id" uuid NOT NULL,
    CONSTRAINT "fk-four_a_test_for_delirium_grades-four_a_test_for_delirium_id-to-four_a_test_for_deliriums" FOREIGN KEY ("four_a_test_for_delirium_id") REFERENCES "four_a_test_for_deliriums" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE four_a_test_for_delirium_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
