CREATE TABLE IF NOT EXISTS "okr_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "okr_objective_id" uuid NOT NULL UNIQUE,
    "score_by_progress_percent" double precision NULL,
    "score_by_confidence_decile" integer NULL,
    "score_by_stretch_tier" integer NULL,
    "score_by_alignment_grade" integer NULL,
    "score_by_impact_tier" integer NULL,
    "score_by_smart_quality" integer NULL,
    "score_by_pace_deviation_percent" double precision NULL,
    "computed_composite_rag" text NOT NULL DEFAULT '',
    "final_composite_rag" text NOT NULL DEFAULT '',
    "override_reason" text NOT NULL DEFAULT '',
    "recommendation" text NOT NULL DEFAULT '',
    "triage_notes" text NOT NULL DEFAULT '',
    "signed_by" text NOT NULL DEFAULT '',
    "signed_at" timestamp with time zone NULL,
    "graded_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk-okr_grades-okr_objective_id-to-okr_objectives" FOREIGN KEY ("okr_objective_id") REFERENCES "okr_objectives" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE okr_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
