-- Computed classification result for a medical device assessment.

CREATE TABLE medical_device_assessment_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    medical_device_assessment_id UUID NOT NULL UNIQUE
        REFERENCES medical_device_assessment(id) ON DELETE CASCADE,
    computed_device_class VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (computed_device_class IN ('I', 'IIa', 'IIb', 'III', '')),
    final_device_class VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (final_device_class IN ('I', 'IIa', 'IIb', 'III', '')),
    class_suffix VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (class_suffix IN ('s', 'm', 'r', 'sm', 'sr', 'mr', 'smr', '')),
    override_reason VARCHAR(500) NOT NULL DEFAULT '',
    conformity_route VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (conformity_route IN ('self-declaration', 'notified-body-partial', 'notified-body-full', '')),
    determining_rule VARCHAR(20) NOT NULL DEFAULT '',
    regulatory_readiness VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (regulatory_readiness IN ('ready', 'gaps', 'blocked', '')),
    assessor_notes TEXT NOT NULL DEFAULT '',
    signed_at TIMESTAMPTZ,
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_medical_device_assessment_grade_updated_at
    BEFORE UPDATE ON medical_device_assessment_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE medical_device_assessment_grade IS
    'Medical device assessment grade.';
COMMENT ON COLUMN medical_device_assessment_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_device_assessment_grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN medical_device_assessment_grade.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN medical_device_assessment_grade.deleted_at IS
    'Soft-delete timestamp; NULL when the row is live.';
COMMENT ON COLUMN medical_device_assessment_grade.medical_device_assessment_id IS
    'Foreign key to the medical_device_assessment table.';
COMMENT ON COLUMN medical_device_assessment_grade.computed_device_class IS
    'Computed device class. One of: I, IIa, IIb, III.';
COMMENT ON COLUMN medical_device_assessment_grade.final_device_class IS
    'Final device class. One of: I, IIa, IIb, III.';
COMMENT ON COLUMN medical_device_assessment_grade.class_suffix IS
    'Class suffix. One of: s, m, r, sm, sr, mr, smr.';
COMMENT ON COLUMN medical_device_assessment_grade.override_reason IS
    'Override reason.';
COMMENT ON COLUMN medical_device_assessment_grade.conformity_route IS
    'Conformity route. One of: self-declaration, notified-body-partial, notified-body-full.';
COMMENT ON COLUMN medical_device_assessment_grade.determining_rule IS
    'Determining rule.';
COMMENT ON COLUMN medical_device_assessment_grade.regulatory_readiness IS
    'Regulatory readiness. One of: ready, gaps, blocked.';
COMMENT ON COLUMN medical_device_assessment_grade.assessor_notes IS
    'Assessor notes.';
COMMENT ON COLUMN medical_device_assessment_grade.signed_at IS
    'Signed at.';
COMMENT ON COLUMN medical_device_assessment_grade.graded_at IS
    'Graded at.';
