CREATE TABLE IF NOT EXISTS "grade_fired_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "grade_id" uuid NOT NULL,
    "rule_id" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" text NOT NULL DEFAULT '',
    "severity_level" varchar NOT NULL DEFAULT '',
    "contributing_condition_code" text NOT NULL DEFAULT '',
    CONSTRAINT "fk-grade_fired_rules-grade_id-to-grades" FOREIGN KEY ("grade_id") REFERENCES "grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE grade_fired_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
