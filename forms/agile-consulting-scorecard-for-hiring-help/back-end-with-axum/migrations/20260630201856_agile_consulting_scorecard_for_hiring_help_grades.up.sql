CREATE TABLE IF NOT EXISTS "agile_consulting_scorecard_for_hiring_help_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "score_total" integer NULL,
    "manifesto_subtotal" integer NULL,
    "principles_subtotal" integer NULL,
    "computed_band" varchar NOT NULL DEFAULT '',
    "final_band" varchar NOT NULL DEFAULT '',
    "override_reason" varchar NOT NULL DEFAULT '',
    "recommendation" varchar NOT NULL DEFAULT '',
    "recommended_focus_areas" text NOT NULL DEFAULT '',
    "review_notes" text NOT NULL DEFAULT '',
    "signed_by" varchar NOT NULL DEFAULT '',
    "signed_at" timestamp with time zone NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "agile_consulting_scorecard_for_hiring_help_id" uuid NOT NULL,
    CONSTRAINT "fk-agile_consulting_scorecard_for_hiring_help_grades-agile_consulting_scorecard_for_hiring_help_id-to-agile_consulting_scorecard_for_hiring_helps" FOREIGN KEY ("agile_consulting_scorecard_for_hiring_help_id") REFERENCES "agile_consulting_scorecard_for_hiring_helps" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE agile_consulting_scorecard_for_hiring_help_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
