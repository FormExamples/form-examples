CREATE TABLE IF NOT EXISTS "cha2ds2_vasc_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "cha2ds2_vasc_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-cha2ds2_vasc_grade_flags-cha2ds2_vasc_grade_id-to-cha2ds2_vasc_grades" FOREIGN KEY ("cha2ds2_vasc_grade_id") REFERENCES "cha2ds2_vasc_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE cha2ds2_vasc_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
