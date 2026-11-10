CREATE TABLE IF NOT EXISTS "apgar_score_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "apgar_score_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-apgar_score_grade_flags-apgar_score_grade_id-to-apgar_score_grades" FOREIGN KEY ("apgar_score_grade_id") REFERENCES "apgar_score_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE apgar_score_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
