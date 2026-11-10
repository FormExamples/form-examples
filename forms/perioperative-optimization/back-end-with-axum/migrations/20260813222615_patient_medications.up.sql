CREATE TABLE IF NOT EXISTS "patient_medications" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "dose" text NOT NULL DEFAULT '',
    "frequency" text NOT NULL DEFAULT '',
    "route" text NOT NULL DEFAULT '',
    "indication" text NOT NULL DEFAULT '',
    "started_on" date NULL,
    "prescribed_by" text NOT NULL DEFAULT '',
    "adherence" text NOT NULL DEFAULT '',
    "hold_required" boolean NOT NULL DEFAULT false,
    "hold_start_before_days" integer NULL,
    "restart_after_days" integer NULL,
    "hold_plan_agreed" boolean NOT NULL DEFAULT false,
    "hold_plan_agreed_by" text NOT NULL DEFAULT '',
    "hold_plan_agreed_on" date NULL,
    "notes" text NOT NULL DEFAULT '',
    "patient_id" uuid NOT NULL,
    "medication_id" uuid NOT NULL,
    CONSTRAINT "fk-patient_medications-patient_id-to-patients" FOREIGN KEY ("patient_id") REFERENCES "patients" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-patient_medications-medication_id-to-medications" FOREIGN KEY ("medication_id") REFERENCES "medications" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE patient_medications ALTER COLUMN id SET DEFAULT gen_random_uuid();
