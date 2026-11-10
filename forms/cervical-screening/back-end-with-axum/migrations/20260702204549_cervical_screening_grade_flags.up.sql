CREATE TABLE IF NOT EXISTS "cervical_screening_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "cervical_screening_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-cervical_screening_grade_flags-cervical_screening_grade_id-to-cervical_screening_grades" FOREIGN KEY ("cervical_screening_grade_id") REFERENCES "cervical_screening_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE cervical_screening_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
