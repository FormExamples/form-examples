-- Visual acuity measurements per eye plus binocular.

CREATE TABLE eye_prescription_visual_acuity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    eye_prescription_id UUID NOT NULL UNIQUE
        REFERENCES eye_prescription(id) ON DELETE CASCADE,

    distance_right_unaided VARCHAR(20) NOT NULL DEFAULT '',
    distance_left_unaided VARCHAR(20) NOT NULL DEFAULT '',
    distance_binocular_unaided VARCHAR(20) NOT NULL DEFAULT '',
    distance_right_corrected VARCHAR(20) NOT NULL DEFAULT '',
    distance_left_corrected VARCHAR(20) NOT NULL DEFAULT '',
    distance_binocular_corrected VARCHAR(20) NOT NULL DEFAULT '',

    near_right_unaided VARCHAR(20) NOT NULL DEFAULT '',
    near_left_unaided VARCHAR(20) NOT NULL DEFAULT '',
    near_binocular_unaided VARCHAR(20) NOT NULL DEFAULT '',
    near_right_corrected VARCHAR(20) NOT NULL DEFAULT '',
    near_left_corrected VARCHAR(20) NOT NULL DEFAULT '',
    near_binocular_corrected VARCHAR(20) NOT NULL DEFAULT '',

    pinhole_right VARCHAR(20) NOT NULL DEFAULT '',
    pinhole_left VARCHAR(20) NOT NULL DEFAULT '',

    dominant_eye VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (dominant_eye IN ('right', 'left', 'none', ''))
);

CREATE TRIGGER trigger_eye_prescription_visual_acuity_updated_at
    BEFORE UPDATE ON eye_prescription_visual_acuity
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE eye_prescription_visual_acuity IS
    'Visual acuity measurements: Snellen distance and near, unaided and corrected, per eye and binocular, plus pinhole VA and dominant eye.';
COMMENT ON COLUMN eye_prescription_visual_acuity.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN eye_prescription_visual_acuity.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN eye_prescription_visual_acuity.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN eye_prescription_visual_acuity.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN eye_prescription_visual_acuity.eye_prescription_id IS
    'Foreign key to the parent eye_prescription (unique, 1:1).';
COMMENT ON COLUMN eye_prescription_visual_acuity.distance_right_unaided IS
    'Snellen distance acuity, right eye, unaided (e.g. "6/12").';
COMMENT ON COLUMN eye_prescription_visual_acuity.distance_left_unaided IS
    'Snellen distance acuity, left eye, unaided.';
COMMENT ON COLUMN eye_prescription_visual_acuity.distance_binocular_unaided IS
    'Snellen distance acuity, binocular, unaided.';
COMMENT ON COLUMN eye_prescription_visual_acuity.distance_right_corrected IS
    'Snellen distance acuity, right eye, with this prescription.';
COMMENT ON COLUMN eye_prescription_visual_acuity.distance_left_corrected IS
    'Snellen distance acuity, left eye, with this prescription.';
COMMENT ON COLUMN eye_prescription_visual_acuity.distance_binocular_corrected IS
    'Snellen distance acuity, binocular, with this prescription.';
COMMENT ON COLUMN eye_prescription_visual_acuity.near_right_unaided IS
    'Near acuity, right eye, unaided (e.g. "N6").';
COMMENT ON COLUMN eye_prescription_visual_acuity.near_left_unaided IS
    'Near acuity, left eye, unaided.';
COMMENT ON COLUMN eye_prescription_visual_acuity.near_binocular_unaided IS
    'Near acuity, binocular, unaided.';
COMMENT ON COLUMN eye_prescription_visual_acuity.near_right_corrected IS
    'Near acuity, right eye, with this prescription.';
COMMENT ON COLUMN eye_prescription_visual_acuity.near_left_corrected IS
    'Near acuity, left eye, with this prescription.';
COMMENT ON COLUMN eye_prescription_visual_acuity.near_binocular_corrected IS
    'Near acuity, binocular, with this prescription.';
COMMENT ON COLUMN eye_prescription_visual_acuity.pinhole_right IS
    'Pinhole visual acuity, right eye.';
COMMENT ON COLUMN eye_prescription_visual_acuity.pinhole_left IS
    'Pinhole visual acuity, left eye.';
COMMENT ON COLUMN eye_prescription_visual_acuity.dominant_eye IS
    'Dominant eye: right, left, none.';
