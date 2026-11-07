CREATE TABLE IF NOT EXISTS "grading_fired_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "grade_id" uuid NOT NULL,
    "rule_id" text NOT NULL,
    "system" text NOT NULL,
    "description" text NOT NULL,
    "score" integer NOT NULL,
    CONSTRAINT "fk-grading_fired_rules-grade_id-to-grades" FOREIGN KEY ("grade_id") REFERENCES "grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE grading_fired_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
CREATE UNIQUE INDEX IF NOT EXISTS "index_grading_fired_rules_0_unique" ON "grading_fired_rules" ("grade_id", "rule_id");
