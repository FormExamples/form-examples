CREATE TABLE IF NOT EXISTS "assessment_strength_test_items" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "strength_testing_id" uuid NOT NULL,
    "muscle_group" varchar NOT NULL DEFAULT '',
    "movement" varchar NOT NULL DEFAULT '',
    "mrc_grade" integer NULL,
    "pain_on_testing" varchar NOT NULL DEFAULT '',
    "sort_order" integer NOT NULL DEFAULT 0,
    CONSTRAINT "fk-assessment_strength_test_items-strength_testing_id-to-assessment_strength_testings" FOREIGN KEY ("strength_testing_id") REFERENCES "assessment_strength_testings" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessment_strength_test_items ALTER COLUMN id SET DEFAULT gen_random_uuid();
