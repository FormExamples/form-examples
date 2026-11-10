CREATE TABLE IF NOT EXISTS "respect_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "section" varchar NOT NULL DEFAULT '',
    "satisfied" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "respect_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-respect_grade_rules-respect_grade_id-to-respect_grades" FOREIGN KEY ("respect_grade_id") REFERENCES "respect_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE respect_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
