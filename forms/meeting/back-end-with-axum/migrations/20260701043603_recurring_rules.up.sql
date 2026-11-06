CREATE TABLE IF NOT EXISTS "recurring_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "frequency" varchar NOT NULL DEFAULT 'none',
    "interval_count" integer NOT NULL DEFAULT 1,
    "by_day_of_week" varchar NOT NULL DEFAULT '',
    "by_day_of_month" integer NULL,
    "by_set_position" integer NULL,
    "by_month_of_year" integer NULL,
    "series_count" integer NULL,
    "series_until" timestamp with time zone NULL,
    "timezone" varchar NOT NULL DEFAULT '',
    "rrule_text" varchar NOT NULL DEFAULT '',
    "meeting_id" uuid NOT NULL,
    CONSTRAINT "fk-recurring_rules-meeting_id-to-meetings" FOREIGN KEY ("meeting_id") REFERENCES "meetings" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE recurring_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
