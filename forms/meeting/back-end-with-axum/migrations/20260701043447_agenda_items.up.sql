CREATE TABLE IF NOT EXISTS "agenda_items" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "position" integer NOT NULL DEFAULT 0,
    "title" varchar NOT NULL DEFAULT '',
    "duration_minutes" integer NULL,
    "presenter" varchar NOT NULL DEFAULT '',
    "notes" text NOT NULL DEFAULT '',
    "status" varchar NOT NULL DEFAULT '',
    "meeting_id" uuid NOT NULL,
    CONSTRAINT "fk-agenda_items-meeting_id-to-meetings" FOREIGN KEY ("meeting_id") REFERENCES "meetings" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE agenda_items ALTER COLUMN id SET DEFAULT gen_random_uuid();
