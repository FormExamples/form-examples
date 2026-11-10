CREATE TABLE IF NOT EXISTS "assessment_anaphylaxis_episodes" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "anaphylaxis_history_id" uuid NOT NULL,
    "trigger_description" text NOT NULL DEFAULT '',
    "symptoms" text NOT NULL DEFAULT '',
    "treatment_required" text NOT NULL DEFAULT '',
    "sort_order" integer NOT NULL DEFAULT 0,
    CONSTRAINT "fk-assessment_anaphylaxis_episodes-anaphylaxis_history_id-to-assessment_anaphylaxis_histories" FOREIGN KEY ("anaphylaxis_history_id") REFERENCES "assessment_anaphylaxis_histories" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessment_anaphylaxis_episodes ALTER COLUMN id SET DEFAULT gen_random_uuid();
