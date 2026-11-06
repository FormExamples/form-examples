CREATE TABLE IF NOT EXISTS "architecture_decision_record_positions" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "ordinal" integer NOT NULL DEFAULT 0,
    "name" varchar NOT NULL,
    "description" text NOT NULL DEFAULT '',
    "model_or_diagram_url" varchar NOT NULL DEFAULT '',
    "is_chosen" boolean NOT NULL DEFAULT false,
    "pros" text NOT NULL DEFAULT '',
    "cons" text NOT NULL DEFAULT '',
    "architecture_decision_record_id" uuid NOT NULL,
    CONSTRAINT "fk-architecture_decision_record_positions-architecture_decision_record_id-to-architecture_decision_records" FOREIGN KEY ("architecture_decision_record_id") REFERENCES "architecture_decision_records" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE architecture_decision_record_positions ALTER COLUMN id SET DEFAULT gen_random_uuid();
