CREATE TABLE IF NOT EXISTS "medical_operation_note_drains" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "device_type" varchar NOT NULL DEFAULT '',
    "name" varchar NOT NULL DEFAULT '',
    "site" varchar NOT NULL DEFAULT '',
    "size_or_gauge" varchar NOT NULL DEFAULT '',
    "output_target" varchar NOT NULL DEFAULT '',
    "removal_plan" varchar NOT NULL DEFAULT '',
    "removal_by_date" date NULL,
    "quantity" integer NOT NULL DEFAULT 1,
    "notes" text NOT NULL DEFAULT '',
    "medical_operation_note_id" uuid NOT NULL,
    CONSTRAINT "fk-medical_operation_note_drains-medical_operation_note_id-to-medical_operation_notes" FOREIGN KEY ("medical_operation_note_id") REFERENCES "medical_operation_notes" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE medical_operation_note_drains ALTER COLUMN id SET DEFAULT gen_random_uuid();
