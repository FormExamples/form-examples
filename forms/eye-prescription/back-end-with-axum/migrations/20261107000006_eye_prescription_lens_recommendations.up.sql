CREATE TABLE IF NOT EXISTS "eye_prescription_lens_recommendations" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "eye_prescription_id" uuid NOT NULL UNIQUE,
    "lens_type" varchar NOT NULL DEFAULT '',
    "material" varchar NOT NULL DEFAULT '',
    "refractive_index" double precision NULL,
    "aspheric" boolean NOT NULL DEFAULT FALSE,
    "coating_anti_reflective" boolean NOT NULL DEFAULT FALSE,
    "coating_scratch_resistant" boolean NOT NULL DEFAULT FALSE,
    "coating_hydrophobic" boolean NOT NULL DEFAULT FALSE,
    "coating_blue_light" boolean NOT NULL DEFAULT FALSE,
    "coating_photochromic" boolean NOT NULL DEFAULT FALSE,
    "coating_polarised" boolean NOT NULL DEFAULT FALSE,
    "coating_uv_400" boolean NOT NULL DEFAULT FALSE,
    "tint_description" varchar NOT NULL DEFAULT '',
    "tint_percent" integer NULL,
    "dispenser_notes" text NOT NULL DEFAULT '',
    CONSTRAINT "fk-eye_prescription_lens_recommendations-eye_prescription_id-to-eye_prescriptions" FOREIGN KEY ("eye_prescription_id") REFERENCES "eye_prescriptions" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE eye_prescription_lens_recommendations ALTER COLUMN id SET DEFAULT gen_random_uuid();
