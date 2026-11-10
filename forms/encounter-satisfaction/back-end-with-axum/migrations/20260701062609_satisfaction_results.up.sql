CREATE TABLE IF NOT EXISTS "satisfaction_results" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "composite_score" double precision NOT NULL,
    "category" text NOT NULL DEFAULT '',
    "answered_count" integer NOT NULL DEFAULT 0,
    "scored_at" timestamp with time zone NOT NULL,
    "encounter_satisfaction_id" uuid NOT NULL,
    CONSTRAINT "fk-satisfaction_results-encounter_satisfaction_id-to-encounter_satisfactions" FOREIGN KEY ("encounter_satisfaction_id") REFERENCES "encounter_satisfactions" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE satisfaction_results ALTER COLUMN id SET DEFAULT gen_random_uuid();
