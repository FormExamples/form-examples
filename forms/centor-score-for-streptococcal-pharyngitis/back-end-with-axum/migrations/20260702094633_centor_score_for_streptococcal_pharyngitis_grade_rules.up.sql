CREATE TABLE IF NOT EXISTS "centor_score_for_streptococcal_pharyngitis_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "criterion" varchar NOT NULL,
    "points" integer NULL,
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "centor_score_for_streptococcal_pharyngitis_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-centor_score_for_streptococcal_pharyngitis_grade_rules-centor_score_for_streptococcal_pharyngitis_grade_id-to-centor_score_for_streptococcal_pharyngitis_grades" FOREIGN KEY ("centor_score_for_streptococcal_pharyngitis_grade_id") REFERENCES "centor_score_for_streptococcal_pharyngitis_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE centor_score_for_streptococcal_pharyngitis_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
