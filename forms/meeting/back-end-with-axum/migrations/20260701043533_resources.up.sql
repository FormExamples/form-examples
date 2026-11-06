CREATE TABLE IF NOT EXISTS "resources" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "position" integer NOT NULL DEFAULT 0,
    "resource_type" varchar NOT NULL DEFAULT '',
    "name" varchar NOT NULL DEFAULT '',
    "quantity" integer NULL,
    "unit" varchar NOT NULL DEFAULT '',
    "url" varchar NOT NULL DEFAULT '',
    "cost_amount" double precision NULL,
    "cost_currency" varchar NOT NULL DEFAULT '',
    "status" varchar NOT NULL DEFAULT '',
    "notes" text NOT NULL DEFAULT '',
    "meeting_id" uuid NOT NULL,
    CONSTRAINT "fk-resources-meeting_id-to-meetings" FOREIGN KEY ("meeting_id") REFERENCES "meetings" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE resources ALTER COLUMN id SET DEFAULT gen_random_uuid();
