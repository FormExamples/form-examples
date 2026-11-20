CREATE TABLE IF NOT EXISTS "ss5_application_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "ss5_application_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-ss5_application_grade_flags-ss5_application_grade_id-to-ss5_application_grades" FOREIGN KEY ("ss5_application_grade_id") REFERENCES "ss5_application_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE ss5_application_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
