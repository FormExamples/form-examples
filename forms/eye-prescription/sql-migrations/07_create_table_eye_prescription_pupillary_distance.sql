-- Pupillary distance measurements.

CREATE TABLE eye_prescription_pupillary_distance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    eye_prescription_id UUID NOT NULL UNIQUE
        REFERENCES eye_prescription(id) ON DELETE CASCADE,

    distance_total_mm NUMERIC(4,1)
        CHECK (distance_total_mm IS NULL OR distance_total_mm BETWEEN 40.0 AND 80.0),
    distance_right_mm NUMERIC(4,1)
        CHECK (distance_right_mm IS NULL OR distance_right_mm BETWEEN 20.0 AND 45.0),
    distance_left_mm NUMERIC(4,1)
        CHECK (distance_left_mm IS NULL OR distance_left_mm BETWEEN 20.0 AND 45.0),
    near_total_mm NUMERIC(4,1)
        CHECK (near_total_mm IS NULL OR near_total_mm BETWEEN 40.0 AND 80.0),
    near_right_mm NUMERIC(4,1)
        CHECK (near_right_mm IS NULL OR near_right_mm BETWEEN 20.0 AND 45.0),
    near_left_mm NUMERIC(4,1)
        CHECK (near_left_mm IS NULL OR near_left_mm BETWEEN 20.0 AND 45.0),
    segment_height_right_mm NUMERIC(4,1)
        CHECK (segment_height_right_mm IS NULL OR segment_height_right_mm BETWEEN 10.0 AND 35.0),
    segment_height_left_mm NUMERIC(4,1)
        CHECK (segment_height_left_mm IS NULL OR segment_height_left_mm BETWEEN 10.0 AND 35.0)
);

CREATE TRIGGER trigger_eye_prescription_pupillary_distance_updated_at
    BEFORE UPDATE ON eye_prescription_pupillary_distance
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE eye_prescription_pupillary_distance IS
    'Pupillary distance measurements: distance total and monocular, near total and monocular, segment height for bifocal / varifocal.';
COMMENT ON COLUMN eye_prescription_pupillary_distance.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN eye_prescription_pupillary_distance.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN eye_prescription_pupillary_distance.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN eye_prescription_pupillary_distance.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN eye_prescription_pupillary_distance.eye_prescription_id IS
    'Foreign key to the parent eye_prescription (unique, 1:1).';
COMMENT ON COLUMN eye_prescription_pupillary_distance.distance_total_mm IS
    'Total interpupillary distance for distance vision, in mm.';
COMMENT ON COLUMN eye_prescription_pupillary_distance.distance_right_mm IS
    'Monocular pupillary distance, right eye to nose bridge, for distance vision, in mm.';
COMMENT ON COLUMN eye_prescription_pupillary_distance.distance_left_mm IS
    'Monocular pupillary distance, left eye to nose bridge, for distance vision, in mm.';
COMMENT ON COLUMN eye_prescription_pupillary_distance.near_total_mm IS
    'Total interpupillary distance for near vision, in mm (typically distance PD - 3 mm).';
COMMENT ON COLUMN eye_prescription_pupillary_distance.near_right_mm IS
    'Monocular pupillary distance, right eye to nose bridge, for near vision, in mm.';
COMMENT ON COLUMN eye_prescription_pupillary_distance.near_left_mm IS
    'Monocular pupillary distance, left eye to nose bridge, for near vision, in mm.';
COMMENT ON COLUMN eye_prescription_pupillary_distance.segment_height_right_mm IS
    'Segment height for bifocal / varifocal lens, right eye, in mm (typically 16-22 mm).';
COMMENT ON COLUMN eye_prescription_pupillary_distance.segment_height_left_mm IS
    'Segment height for bifocal / varifocal lens, left eye, in mm.';
