CREATE TABLE IF NOT EXISTS "eye_prescription_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "eye_prescription_grade_id" uuid NOT NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "eye" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    CONSTRAINT "fk-eye_prescription_grade_flags-eye_prescription_grade_id-to-eye_prescription_grades" FOREIGN KEY ("eye_prescription_grade_id") REFERENCES "eye_prescription_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE eye_prescription_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
