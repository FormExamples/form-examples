CREATE TABLE IF NOT EXISTS "abdominal_aortic_aneurysm_screening_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "abdominal_aortic_aneurysm_screening_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-abdominal_aortic_aneurysm_screening_grade_flags-abdominal_aortic_aneurysm_screening_grade_id-to-abdominal_aortic_aneurysm_screening_grades" FOREIGN KEY ("abdominal_aortic_aneurysm_screening_grade_id") REFERENCES "abdominal_aortic_aneurysm_screening_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE abdominal_aortic_aneurysm_screening_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
