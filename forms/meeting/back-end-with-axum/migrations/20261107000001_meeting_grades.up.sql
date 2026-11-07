CREATE TABLE IF NOT EXISTS "meeting_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "meeting_id" uuid NOT NULL UNIQUE,
    "duration_minutes" integer NULL,
    "agenda_item_count" integer NOT NULL DEFAULT 0,
    "participant_count" integer NOT NULL DEFAULT 0,
    "accepted_count" integer NOT NULL DEFAULT 0,
    "declined_count" integer NOT NULL DEFAULT 0,
    "attended_count" integer NOT NULL DEFAULT 0,
    "action_item_count" integer NOT NULL DEFAULT 0,
    "output_count" integer NOT NULL DEFAULT 0,
    "outcome_count" integer NOT NULL DEFAULT 0,
    "completion_status" varchar NOT NULL DEFAULT '',
    "overall_health" varchar NOT NULL DEFAULT '',
    "override_reason" varchar NOT NULL DEFAULT '',
    "notes" text NOT NULL DEFAULT '',
    "signed_by" varchar NOT NULL DEFAULT '',
    "signed_at" timestamp with time zone NULL,
    "graded_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk-meeting_grades-meeting_id-to-meetings" FOREIGN KEY ("meeting_id") REFERENCES "meetings" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE meeting_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
