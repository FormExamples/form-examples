CREATE TABLE IF NOT EXISTS "anaesthetic_record_intra_operative_events" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "event_type" varchar NOT NULL DEFAULT '',
    "occurred_at" timestamp with time zone NULL,
    "management" text NOT NULL DEFAULT '',
    "anaesthetic_record_id" uuid NOT NULL,
    CONSTRAINT "fk-anaesthetic_record_intra_operative_events-anaesthetic_record_id-to-anaesthetic_records" FOREIGN KEY ("anaesthetic_record_id") REFERENCES "anaesthetic_records" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE anaesthetic_record_intra_operative_events ALTER COLUMN id SET DEFAULT gen_random_uuid();
