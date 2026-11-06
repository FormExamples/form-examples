CREATE TABLE IF NOT EXISTS "anaesthetic_record_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "criticality" varchar NOT NULL DEFAULT '',
    "satisfied" boolean NOT NULL DEFAULT false,
    "description" varchar NOT NULL DEFAULT '',
    "anaesthetic_record_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-anaesthetic_record_grade_rules-anaesthetic_record_grade_id-to-anaesthetic_record_grades" FOREIGN KEY ("anaesthetic_record_grade_id") REFERENCES "anaesthetic_record_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE anaesthetic_record_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
