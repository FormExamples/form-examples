CREATE TABLE IF NOT EXISTS "participants" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "position" integer NOT NULL DEFAULT 0,
    "name" varchar NOT NULL DEFAULT '',
    "email" varchar NOT NULL DEFAULT '',
    "organisation" varchar NOT NULL DEFAULT '',
    "role" varchar NOT NULL DEFAULT '',
    "response_status" varchar NOT NULL DEFAULT '',
    "attendance_status" varchar NOT NULL DEFAULT '',
    "notes" text NOT NULL DEFAULT '',
    "meeting_id" uuid NOT NULL,
    CONSTRAINT "fk-participants-meeting_id-to-meetings" FOREIGN KEY ("meeting_id") REFERENCES "meetings" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE participants ALTER COLUMN id SET DEFAULT gen_random_uuid();
