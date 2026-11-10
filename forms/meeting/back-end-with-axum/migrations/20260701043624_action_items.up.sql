CREATE TABLE IF NOT EXISTS "action_items" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "position" integer NOT NULL DEFAULT 0,
    "title" varchar NOT NULL DEFAULT '',
    "description" text NOT NULL DEFAULT '',
    "owner_name" varchar NOT NULL DEFAULT '',
    "owner_email" varchar NOT NULL DEFAULT '',
    "due_date" date NULL,
    "priority" varchar NOT NULL DEFAULT '',
    "status" varchar NOT NULL DEFAULT 'open',
    "completed_at" timestamp with time zone NULL,
    "external_reference" varchar NOT NULL DEFAULT '',
    "meeting_id" uuid NOT NULL,
    CONSTRAINT "fk-action_items-meeting_id-to-meetings" FOREIGN KEY ("meeting_id") REFERENCES "meetings" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE action_items ALTER COLUMN id SET DEFAULT gen_random_uuid();
