CREATE TABLE IF NOT EXISTS "eye_prescription_pupillary_distances" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "eye_prescription_id" uuid NOT NULL UNIQUE,
    "distance_total_mm" double precision NULL,
    "distance_right_mm" double precision NULL,
    "distance_left_mm" double precision NULL,
    "near_total_mm" double precision NULL,
    "near_right_mm" double precision NULL,
    "near_left_mm" double precision NULL,
    "segment_height_right_mm" double precision NULL,
    "segment_height_left_mm" double precision NULL,
    CONSTRAINT "fk-eye_prescription_pupillary_distances-eye_prescription_id-to-eye_prescriptions" FOREIGN KEY ("eye_prescription_id") REFERENCES "eye_prescriptions" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE eye_prescription_pupillary_distances ALTER COLUMN id SET DEFAULT gen_random_uuid();
