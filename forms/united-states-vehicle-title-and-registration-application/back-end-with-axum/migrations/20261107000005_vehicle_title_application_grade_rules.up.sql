CREATE TABLE IF NOT EXISTS "vehicle_title_application_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "vehicle_title_application_grade_id" uuid NOT NULL,
    "rule_id" varchar NOT NULL,
    "dimension" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    CONSTRAINT "fk-f6dfe992f7249c7d12bd482f3fe0c317" FOREIGN KEY ("vehicle_title_application_grade_id") REFERENCES "vehicle_title_application_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE vehicle_title_application_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
