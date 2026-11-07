CREATE TABLE IF NOT EXISTS "assessment_surgery_items" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "surgical_history_id" uuid NOT NULL,
    "procedure_name" varchar NOT NULL DEFAULT '',
    "date_performed" date NULL,
    "surgeon" varchar NOT NULL DEFAULT '',
    "hospital" varchar NOT NULL DEFAULT '',
    "outcome" varchar NOT NULL DEFAULT '',
    "outcome_details" text NOT NULL DEFAULT '',
    "sort_order" integer NOT NULL DEFAULT 0,
    CONSTRAINT "fk-assessment_surgery_items-surgical_history_id-to-assessment_surgical_histories" FOREIGN KEY ("surgical_history_id") REFERENCES "assessment_surgical_histories" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessment_surgery_items ALTER COLUMN id SET DEFAULT gen_random_uuid();
