CREATE TABLE IF NOT EXISTS "eye_prescription_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "eye_prescription_grade_id" uuid NOT NULL,
    "rule_id" varchar NOT NULL,
    "instrument" varchar NOT NULL DEFAULT '',
    "eye" varchar NOT NULL DEFAULT '',
    "class" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    CONSTRAINT "fk-eye_prescription_grade_rules-eye_prescription_grade_id-to-eye_prescription_grades" FOREIGN KEY ("eye_prescription_grade_id") REFERENCES "eye_prescription_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE eye_prescription_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
