CREATE TABLE IF NOT EXISTS "meeting_outcomes" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "position" integer NOT NULL DEFAULT 0,
    "title" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" text NOT NULL DEFAULT '',
    "impact" varchar NOT NULL DEFAULT '',
    "meeting_id" uuid NOT NULL,
    "related_action_item_id" uuid NULL,
    CONSTRAINT "fk-meeting_outcomes-meeting_id-to-meetings" FOREIGN KEY ("meeting_id") REFERENCES "meetings" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-meeting_outcomes-related_action_item_id-to-action_items" FOREIGN KEY ("related_action_item_id") REFERENCES "action_items" (id) ON DELETE SET NULL ON UPDATE NO ACTION
);

ALTER TABLE meeting_outcomes ALTER COLUMN id SET DEFAULT gen_random_uuid();
