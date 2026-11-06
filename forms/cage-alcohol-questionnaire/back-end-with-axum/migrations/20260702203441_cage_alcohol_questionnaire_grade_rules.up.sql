CREATE TABLE IF NOT EXISTS "cage_alcohol_questionnaire_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "parameter" varchar NOT NULL,
    "points" integer NULL,
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "cage_alcohol_questionnaire_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-cage_alcohol_questionnaire_grade_rules-cage_alcohol_questionnaire_grade_id-to-cage_alcohol_questionnaire_grades" FOREIGN KEY ("cage_alcohol_questionnaire_grade_id") REFERENCES "cage_alcohol_questionnaire_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE cage_alcohol_questionnaire_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
