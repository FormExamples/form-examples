-- Per-eye refractive data (one row for right eye, one row for left eye).

CREATE TABLE eye_prescription_eye (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    eye_prescription_id UUID NOT NULL
        REFERENCES eye_prescription(id) ON DELETE CASCADE,
    eye VARCHAR(10) NOT NULL
        CHECK (eye IN ('right', 'left')),

    sphere_diopters NUMERIC(5,2)
        CHECK (sphere_diopters IS NULL OR sphere_diopters BETWEEN -30.00 AND 30.00),
    cylinder_diopters NUMERIC(5,2)
        CHECK (cylinder_diopters IS NULL OR cylinder_diopters BETWEEN -10.00 AND 0.00),
    axis_degrees INTEGER
        CHECK (axis_degrees IS NULL OR axis_degrees BETWEEN 1 AND 180),
    addition_diopters NUMERIC(5,2)
        CHECK (addition_diopters IS NULL OR addition_diopters BETWEEN 0.00 AND 4.00),
    intermediate_addition_diopters NUMERIC(5,2)
        CHECK (intermediate_addition_diopters IS NULL OR intermediate_addition_diopters BETWEEN 0.00 AND 4.00),

    prism_horizontal_diopters NUMERIC(5,2) NOT NULL DEFAULT 0.00
        CHECK (prism_horizontal_diopters >= 0.00 AND prism_horizontal_diopters <= 20.00),
    base_horizontal VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (base_horizontal IN ('in', 'out', '')),
    prism_vertical_diopters NUMERIC(5,2) NOT NULL DEFAULT 0.00
        CHECK (prism_vertical_diopters >= 0.00 AND prism_vertical_diopters <= 20.00),
    base_vertical VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (base_vertical IN ('up', 'down', '')),

    UNIQUE (eye_prescription_id, eye)
);

CREATE TRIGGER trigger_eye_prescription_eye_updated_at
    BEFORE UPDATE ON eye_prescription_eye
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE INDEX index_eye_prescription_eye_eye_prescription_id
    ON eye_prescription_eye(eye_prescription_id);

COMMENT ON TABLE eye_prescription_eye IS
    'Per-eye refractive prescription (sphere, cylinder, axis, addition, prism). One row per eye per prescription.';
COMMENT ON COLUMN eye_prescription_eye.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN eye_prescription_eye.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN eye_prescription_eye.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN eye_prescription_eye.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN eye_prescription_eye.eye_prescription_id IS
    'Foreign key to the eye_prescription table.';
COMMENT ON COLUMN eye_prescription_eye.eye IS
    'Which eye: right (OD) or left (OS).';
COMMENT ON COLUMN eye_prescription_eye.sphere_diopters IS
    'Sphere power in dioptres. Negative for myopia, positive for hyperopia, range -30.00 to +30.00 in 0.25 steps.';
COMMENT ON COLUMN eye_prescription_eye.cylinder_diopters IS
    'Cylinder power in dioptres (minus-cylinder convention). Range -10.00 to 0.00 in 0.25 steps.';
COMMENT ON COLUMN eye_prescription_eye.axis_degrees IS
    'Cylinder axis in integer degrees, 1 to 180 (only meaningful when cylinder is non-zero).';
COMMENT ON COLUMN eye_prescription_eye.addition_diopters IS
    'Reading addition in dioptres (always positive). Range 0.00 to +4.00 in 0.25 steps.';
COMMENT ON COLUMN eye_prescription_eye.intermediate_addition_diopters IS
    'Intermediate addition for trifocal / occupational varifocal use, in dioptres.';
COMMENT ON COLUMN eye_prescription_eye.prism_horizontal_diopters IS
    'Horizontal prism magnitude in prism dioptres (PD). 0.00 if no horizontal prism.';
COMMENT ON COLUMN eye_prescription_eye.base_horizontal IS
    'Horizontal prism base direction: in (toward nose) or out (toward temple). Empty if no horizontal prism.';
COMMENT ON COLUMN eye_prescription_eye.prism_vertical_diopters IS
    'Vertical prism magnitude in prism dioptres (PD). 0.00 if no vertical prism.';
COMMENT ON COLUMN eye_prescription_eye.base_vertical IS
    'Vertical prism base direction: up or down. Empty if no vertical prism.';
