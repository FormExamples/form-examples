CREATE TABLE IF NOT EXISTS "assessment_imaging_items" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "imaging_history_id" uuid NOT NULL,
    "modality" varchar NOT NULL DEFAULT '',
    "body_region" varchar NOT NULL DEFAULT '',
    "date_performed" date NULL,
    "findings" text NOT NULL DEFAULT '',
    "sort_order" integer NOT NULL DEFAULT 0,
    CONSTRAINT "fk-assessment_imaging_items-imaging_history_id-to-assessment_imaging_histories" FOREIGN KEY ("imaging_history_id") REFERENCES "assessment_imaging_histories" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessment_imaging_items ALTER COLUMN id SET DEFAULT gen_random_uuid();
