CREATE TABLE IF NOT EXISTS "issue_tracker_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "score_by_priority_rank" integer NULL,
    "score_by_severity_of_impact" integer NULL,
    "score_by_magnitude_of_damage" integer NULL,
    "score_by_harm_grade" integer NULL,
    "score_by_failure_condition" varchar NOT NULL DEFAULT '',
    "score_by_moscow_requirement" integer NULL,
    "score_by_frequency_percent" double precision NULL,
    "computed_composite_priority" varchar NOT NULL DEFAULT '',
    "final_composite_priority" varchar NOT NULL DEFAULT '',
    "override_reason" varchar NOT NULL DEFAULT '',
    "recommendation" varchar NOT NULL DEFAULT '',
    "triage_notes" text NOT NULL DEFAULT '',
    "signed_by" varchar NOT NULL DEFAULT '',
    "signed_at" timestamp with time zone NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "issue_tracker_id" uuid NOT NULL,
    CONSTRAINT "fk-issue_tracker_grades-issue_tracker_id-to-issue_trackers" FOREIGN KEY ("issue_tracker_id") REFERENCES "issue_trackers" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE issue_tracker_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
