CREATE TABLE IF NOT EXISTS "cage_alcohol_questionnaire_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "cut_down_point" integer NULL,
    "annoyed_point" integer NULL,
    "guilty_point" integer NULL,
    "eye_opener_point" integer NULL,
    "total_score" integer NULL,
    "interpretation" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "cage_alcohol_questionnaire_id" uuid NOT NULL,
    CONSTRAINT "fk-cage_alcohol_questionnaire_grades-cage_alcohol_questionnaire_id-to-cage_alcohol_questionnaires" FOREIGN KEY ("cage_alcohol_questionnaire_id") REFERENCES "cage_alcohol_questionnaires" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE cage_alcohol_questionnaire_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
