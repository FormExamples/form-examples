CREATE TABLE IF NOT EXISTS "centor_score_for_streptococcal_pharyngitis_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "centor_score" integer NULL,
    "age_modifier" integer NULL,
    "mcisaac_score" integer NULL,
    "risk_band" varchar NOT NULL DEFAULT '',
    "management" text NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "centor_score_for_streptococcal_pharyngitis_id" uuid NOT NULL,
    CONSTRAINT "fk-centor_score_for_streptococcal_pharyngitis_grades-centor_score_for_streptococcal_pharyngitis_id-to-centor_score_for_streptococcal_pharyngitis" FOREIGN KEY ("centor_score_for_streptococcal_pharyngitis_id") REFERENCES "centor_score_for_streptococcal_pharyngitis" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE centor_score_for_streptococcal_pharyngitis_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
