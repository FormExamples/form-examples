CREATE TABLE IF NOT EXISTS "eye_prescription_ocular_health_findings" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "eye_prescription_id" uuid NOT NULL UNIQUE,
    "slit_lamp_right" text NOT NULL DEFAULT '',
    "slit_lamp_left" text NOT NULL DEFAULT '',
    "fundus_right" text NOT NULL DEFAULT '',
    "fundus_left" text NOT NULL DEFAULT '',
    "intraocular_pressure_right_mmhg" double precision NULL,
    "intraocular_pressure_left_mmhg" double precision NULL,
    "cup_to_disc_ratio_right" double precision NULL,
    "cup_to_disc_ratio_left" double precision NULL,
    "oct_performed" boolean NOT NULL DEFAULT FALSE,
    "oct_findings" text NOT NULL DEFAULT '',
    "fields_performed" boolean NOT NULL DEFAULT FALSE,
    "fields_findings" text NOT NULL DEFAULT '',
    "pathology_flag" boolean NOT NULL DEFAULT FALSE,
    "refer_ophthalmology" boolean NOT NULL DEFAULT FALSE,
    "referral_reason" text NOT NULL DEFAULT '',
    CONSTRAINT "fk-eye_prescription_ocular_health_findings-eye_prescription_id-to-eye_prescriptions" FOREIGN KEY ("eye_prescription_id") REFERENCES "eye_prescriptions" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE eye_prescription_ocular_health_findings ALTER COLUMN id SET DEFAULT gen_random_uuid();
