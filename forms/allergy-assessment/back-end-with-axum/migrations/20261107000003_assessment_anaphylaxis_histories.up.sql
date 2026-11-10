CREATE TABLE IF NOT EXISTS "assessment_anaphylaxis_histories" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "assessment_id" uuid NOT NULL UNIQUE,
    "has_anaphylaxis_history" varchar NOT NULL DEFAULT '',
    "number_of_episodes" integer NULL,
    "adrenaline_auto_injector_prescribed" varchar NOT NULL DEFAULT '',
    "action_plan_in_place" varchar NOT NULL DEFAULT '',
    CONSTRAINT "fk-assessment_anaphylaxis_histories-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessment_anaphylaxis_histories ALTER COLUMN id SET DEFAULT gen_random_uuid();
