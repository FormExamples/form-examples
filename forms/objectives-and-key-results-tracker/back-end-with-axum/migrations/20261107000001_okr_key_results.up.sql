CREATE TABLE IF NOT EXISTS "okr_key_results" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "okr_objective_id" uuid NOT NULL,
    "position" integer NOT NULL,
    "title" text NOT NULL DEFAULT '',
    "kr_type" text NOT NULL DEFAULT '',
    "unit" text NOT NULL DEFAULT '',
    "start_value" double precision NULL,
    "current_value" double precision NULL,
    "target_value" double precision NULL,
    "milestones_json" jsonb NULL,
    "binary_done" boolean NULL,
    "owner_name" text NOT NULL DEFAULT '',
    "due_date" date NULL,
    "progress_fraction" double precision NULL,
    CONSTRAINT "fk-okr_key_results-okr_objective_id-to-okr_objectives" FOREIGN KEY ("okr_objective_id") REFERENCES "okr_objectives" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE okr_key_results ALTER COLUMN id SET DEFAULT gen_random_uuid();
CREATE UNIQUE INDEX IF NOT EXISTS "index_okr_key_results_0_unique" ON "okr_key_results" ("okr_objective_id", "position");
