CREATE TABLE IF NOT EXISTS "knee_replacement_surgery_evaluation_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "knee_replacement_surgery_evaluation_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-knee_replacement_surgery_evaluation_grade_flags-knee_replacement_surgery_evaluation_grade_id-to-knee_replacement_surgery_evaluation_grades" FOREIGN KEY ("knee_replacement_surgery_evaluation_grade_id") REFERENCES "knee_replacement_surgery_evaluation_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE knee_replacement_surgery_evaluation_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
