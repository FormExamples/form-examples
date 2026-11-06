CREATE TABLE IF NOT EXISTS "newborn_blood_spot_screening_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "newborn_blood_spot_screening_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-newborn_blood_spot_screening_grade_flags-newborn_blood_spot_screening_grade_id-to-newborn_blood_spot_screening_grades" FOREIGN KEY ("newborn_blood_spot_screening_grade_id") REFERENCES "newborn_blood_spot_screening_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE newborn_blood_spot_screening_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
