CREATE TABLE IF NOT EXISTS "eye_prescription_eyes" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "eye_prescription_id" uuid NOT NULL,
    "eye" varchar NOT NULL,
    "sphere_diopters" double precision NULL,
    "cylinder_diopters" double precision NULL,
    "axis_degrees" integer NULL,
    "addition_diopters" double precision NULL,
    "intermediate_addition_diopters" double precision NULL,
    "prism_horizontal_diopters" double precision NOT NULL DEFAULT 0.00,
    "base_horizontal" varchar NOT NULL DEFAULT '',
    "prism_vertical_diopters" double precision NOT NULL DEFAULT 0.00,
    "base_vertical" varchar NOT NULL DEFAULT '',
    CONSTRAINT "fk-eye_prescription_eyes-eye_prescription_id-to-eye_prescriptions" FOREIGN KEY ("eye_prescription_id") REFERENCES "eye_prescriptions" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE eye_prescription_eyes ALTER COLUMN id SET DEFAULT gen_random_uuid();
CREATE UNIQUE INDEX IF NOT EXISTS "index_eye_prescription_eyes_0_unique" ON "eye_prescription_eyes" ("eye_prescription_id", "eye");
