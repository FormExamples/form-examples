CREATE TABLE IF NOT EXISTS "meeting_outputs" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "position" integer NOT NULL DEFAULT 0,
    "title" varchar NOT NULL DEFAULT '',
    "kind" varchar NOT NULL DEFAULT '',
    "url" varchar NOT NULL DEFAULT '',
    "description" text NOT NULL DEFAULT '',
    "owner_name" varchar NOT NULL DEFAULT '',
    "meeting_id" uuid NOT NULL,
    CONSTRAINT "fk-meeting_outputs-meeting_id-to-meetings" FOREIGN KEY ("meeting_id") REFERENCES "meetings" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE meeting_outputs ALTER COLUMN id SET DEFAULT gen_random_uuid();
