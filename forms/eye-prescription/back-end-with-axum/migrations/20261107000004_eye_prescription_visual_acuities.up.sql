CREATE TABLE IF NOT EXISTS "eye_prescription_visual_acuities" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "eye_prescription_id" uuid NOT NULL UNIQUE,
    "distance_right_unaided" varchar NOT NULL DEFAULT '',
    "distance_left_unaided" varchar NOT NULL DEFAULT '',
    "distance_binocular_unaided" varchar NOT NULL DEFAULT '',
    "distance_right_corrected" varchar NOT NULL DEFAULT '',
    "distance_left_corrected" varchar NOT NULL DEFAULT '',
    "distance_binocular_corrected" varchar NOT NULL DEFAULT '',
    "near_right_unaided" varchar NOT NULL DEFAULT '',
    "near_left_unaided" varchar NOT NULL DEFAULT '',
    "near_binocular_unaided" varchar NOT NULL DEFAULT '',
    "near_right_corrected" varchar NOT NULL DEFAULT '',
    "near_left_corrected" varchar NOT NULL DEFAULT '',
    "near_binocular_corrected" varchar NOT NULL DEFAULT '',
    "pinhole_right" varchar NOT NULL DEFAULT '',
    "pinhole_left" varchar NOT NULL DEFAULT '',
    "dominant_eye" varchar NOT NULL DEFAULT '',
    CONSTRAINT "fk-eye_prescription_visual_acuities-eye_prescription_id-to-eye_prescriptions" FOREIGN KEY ("eye_prescription_id") REFERENCES "eye_prescriptions" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE eye_prescription_visual_acuities ALTER COLUMN id SET DEFAULT gen_random_uuid();
