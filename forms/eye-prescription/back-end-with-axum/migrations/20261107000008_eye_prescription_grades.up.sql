CREATE TABLE IF NOT EXISTS "eye_prescription_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "eye_prescription_id" uuid NOT NULL UNIQUE,
    "right_eye_sphere_class" varchar NOT NULL DEFAULT '',
    "right_eye_cylinder_class" varchar NOT NULL DEFAULT '',
    "left_eye_sphere_class" varchar NOT NULL DEFAULT '',
    "left_eye_cylinder_class" varchar NOT NULL DEFAULT '',
    "presbyopia_class" varchar NOT NULL DEFAULT '',
    "anisometropia_diopters" double precision NULL,
    "anisometropia_significant" boolean NOT NULL DEFAULT FALSE,
    "prism_present" boolean NOT NULL DEFAULT FALSE,
    "computed_complexity" varchar NOT NULL DEFAULT '',
    "final_complexity" varchar NOT NULL DEFAULT '',
    "override_reason" varchar NOT NULL DEFAULT '',
    "follow_up_interval_months" integer NULL,
    "prescriber_notes" text NOT NULL DEFAULT '',
    "signed_at" timestamp with time zone NULL,
    "graded_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk-eye_prescription_grades-eye_prescription_id-to-eye_prescriptions" FOREIGN KEY ("eye_prescription_id") REFERENCES "eye_prescriptions" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE eye_prescription_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
