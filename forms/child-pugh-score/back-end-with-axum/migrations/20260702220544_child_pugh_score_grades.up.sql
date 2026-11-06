CREATE TABLE IF NOT EXISTS "child_pugh_score_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "bilirubin_points" integer NULL,
    "albumin_points" integer NULL,
    "coagulation_points" integer NULL,
    "ascites_points" integer NULL,
    "encephalopathy_points" integer NULL,
    "total_score" integer NULL,
    "child_pugh_class" varchar NOT NULL DEFAULT '',
    "one_year_survival" varchar NOT NULL DEFAULT '',
    "two_year_survival" varchar NOT NULL DEFAULT '',
    "surgical_risk" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "child_pugh_score_id" uuid NOT NULL,
    CONSTRAINT "fk-child_pugh_score_grades-child_pugh_score_id-to-child_pugh_scores" FOREIGN KEY ("child_pugh_score_id") REFERENCES "child_pugh_scores" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE child_pugh_score_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
