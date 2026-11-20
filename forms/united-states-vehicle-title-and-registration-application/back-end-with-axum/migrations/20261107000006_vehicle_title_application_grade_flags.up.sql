CREATE TABLE IF NOT EXISTS "vehicle_title_application_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "vehicle_title_application_grade_id" uuid NOT NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    CONSTRAINT "fk-4d512e16b06c1fcc25a63cf3d8c7c14b" FOREIGN KEY ("vehicle_title_application_grade_id") REFERENCES "vehicle_title_application_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE vehicle_title_application_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
