-- Computed grading result (per-eye refractive class + overall complexity).

CREATE TABLE eye_prescription_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    eye_prescription_id UUID NOT NULL UNIQUE
        REFERENCES eye_prescription(id) ON DELETE CASCADE,

    right_eye_sphere_class VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (right_eye_sphere_class IN (
            'emmetropia',
            'low-myopia', 'moderate-myopia', 'high-myopia',
            'low-hyperopia', 'moderate-hyperopia', 'high-hyperopia',
            ''
        )),
    right_eye_cylinder_class VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (right_eye_cylinder_class IN (
            'none',
            'mild-astigmatism', 'moderate-astigmatism', 'high-astigmatism',
            ''
        )),
    left_eye_sphere_class VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (left_eye_sphere_class IN (
            'emmetropia',
            'low-myopia', 'moderate-myopia', 'high-myopia',
            'low-hyperopia', 'moderate-hyperopia', 'high-hyperopia',
            ''
        )),
    left_eye_cylinder_class VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (left_eye_cylinder_class IN (
            'none',
            'mild-astigmatism', 'moderate-astigmatism', 'high-astigmatism',
            ''
        )),
    presbyopia_class VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (presbyopia_class IN (
            'none',
            'early-presbyopia',
            'established-presbyopia',
            'advanced-presbyopia',
            ''
        )),
    anisometropia_diopters NUMERIC(5,2),
    anisometropia_significant BOOLEAN NOT NULL DEFAULT FALSE,
    prism_present BOOLEAN NOT NULL DEFAULT FALSE,

    computed_complexity VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (computed_complexity IN ('simple', 'moderate', 'complex', '')),
    final_complexity VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (final_complexity IN ('simple', 'moderate', 'complex', '')),
    override_reason VARCHAR(500) NOT NULL DEFAULT '',

    follow_up_interval_months INTEGER
        CHECK (follow_up_interval_months IS NULL OR follow_up_interval_months BETWEEN 1 AND 60),
    prescriber_notes TEXT NOT NULL DEFAULT '',

    signed_at TIMESTAMPTZ,
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_eye_prescription_grade_updated_at
    BEFORE UPDATE ON eye_prescription_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE eye_prescription_grade IS
    'Computed and signed-off grading result for the prescription. Captures per-eye refractive class, presbyopia, anisometropia, and overall complexity. Stores both computed and final complexity with an override reason.';
COMMENT ON COLUMN eye_prescription_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN eye_prescription_grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN eye_prescription_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN eye_prescription_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN eye_prescription_grade.eye_prescription_id IS
    'Foreign key to the parent eye_prescription (unique, 1:1).';
COMMENT ON COLUMN eye_prescription_grade.right_eye_sphere_class IS
    'Refractive class for the right eye sphere component.';
COMMENT ON COLUMN eye_prescription_grade.right_eye_cylinder_class IS
    'Refractive class for the right eye cylinder component.';
COMMENT ON COLUMN eye_prescription_grade.left_eye_sphere_class IS
    'Refractive class for the left eye sphere component.';
COMMENT ON COLUMN eye_prescription_grade.left_eye_cylinder_class IS
    'Refractive class for the left eye cylinder component.';
COMMENT ON COLUMN eye_prescription_grade.presbyopia_class IS
    'Presbyopia class based on addition power.';
COMMENT ON COLUMN eye_prescription_grade.anisometropia_diopters IS
    'Absolute difference in sphere between right and left eye in dioptres.';
COMMENT ON COLUMN eye_prescription_grade.anisometropia_significant IS
    'Whether anisometropia exceeds the 2.00 D safety-flag threshold.';
COMMENT ON COLUMN eye_prescription_grade.prism_present IS
    'Whether any prism is prescribed (in either eye, either direction).';
COMMENT ON COLUMN eye_prescription_grade.computed_complexity IS
    'Complexity grade computed by the engine: simple, moderate, complex.';
COMMENT ON COLUMN eye_prescription_grade.final_complexity IS
    'Complexity grade signed off by the prescriber (may equal or differ from computed).';
COMMENT ON COLUMN eye_prescription_grade.override_reason IS
    'Reason the prescriber set final differently from computed (mandatory when they differ).';
COMMENT ON COLUMN eye_prescription_grade.follow_up_interval_months IS
    'Recommended follow-up interval in months (typically 12 or 24).';
COMMENT ON COLUMN eye_prescription_grade.prescriber_notes IS
    'Free-text prescriber summary notes.';
COMMENT ON COLUMN eye_prescription_grade.signed_at IS
    'Timestamp of prescriber electronic signature.';
COMMENT ON COLUMN eye_prescription_grade.graded_at IS
    'Timestamp when the engine last computed the result.';
