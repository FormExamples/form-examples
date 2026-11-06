CREATE TABLE IF NOT EXISTS "architecture_decision_record_notes" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "noted_at" timestamp with time zone NOT NULL,
    "noted_by" varchar NOT NULL DEFAULT '',
    "body" text NOT NULL,
    "architecture_decision_record_id" uuid NOT NULL,
    CONSTRAINT "fk-architecture_decision_record_notes-architecture_decision_record_id-to-architecture_decision_records" FOREIGN KEY ("architecture_decision_record_id") REFERENCES "architecture_decision_records" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE architecture_decision_record_notes ALTER COLUMN id SET DEFAULT gen_random_uuid();
