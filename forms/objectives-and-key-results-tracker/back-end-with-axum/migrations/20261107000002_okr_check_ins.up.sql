CREATE TABLE IF NOT EXISTS "okr_check_ins" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "okr_objective_id" uuid NOT NULL,
    "checked_in_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "narrative" text NOT NULL DEFAULT '',
    "since_last_changes" text NOT NULL DEFAULT '',
    "blockers" text NOT NULL DEFAULT '',
    "asks" text NOT NULL DEFAULT '',
    "confidence_decile_at_check_in" integer NULL,
    CONSTRAINT "fk-okr_check_ins-okr_objective_id-to-okr_objectives" FOREIGN KEY ("okr_objective_id") REFERENCES "okr_objectives" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE okr_check_ins ALTER COLUMN id SET DEFAULT gen_random_uuid();
