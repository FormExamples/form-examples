CREATE TABLE medical_device_assessment_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    medical_device_assessment_grade_id UUID NOT NULL
        REFERENCES medical_device_assessment_grade(id) ON DELETE CASCADE,
    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (category IN (
            'missing-intended-purpose',
            'clinical-evidence-gap',
            'risk-management-gap',
            'quality-system-gap',
            'cybersecurity-gap',
            'post-market-surveillance-gap',
            'udi-gap',
            'notified-body-required',
            'software-as-medical-device',
            'medicinal-substance-combination',
            'tissue-origin',
            'nanomaterial',
            'in-vitro-diagnostic-out-of-scope',
            'class-override',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_medical_device_assessment_grade_flag_grade_id
    ON medical_device_assessment_grade_flag(medical_device_assessment_grade_id);

CREATE TRIGGER trigger_medical_device_assessment_grade_flag_updated_at
    BEFORE UPDATE ON medical_device_assessment_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE medical_device_assessment_grade_flag IS
    'Medical device assessment grade flag.';
COMMENT ON COLUMN medical_device_assessment_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_device_assessment_grade_flag.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN medical_device_assessment_grade_flag.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN medical_device_assessment_grade_flag.deleted_at IS
    'Soft-delete timestamp; NULL when the row is live.';
COMMENT ON COLUMN medical_device_assessment_grade_flag.medical_device_assessment_grade_id IS
    'Foreign key to the medical_device_assessment_grade table.';
COMMENT ON COLUMN medical_device_assessment_grade_flag.flag_id IS
    'Flag ID.';
COMMENT ON COLUMN medical_device_assessment_grade_flag.category IS
    'Category. One of: missing-intended-purpose, clinical-evidence-gap, risk-management-gap, quality-system-gap, cybersecurity-gap, post-market-surveillance-gap, udi-gap, notified-body-required, ….';
COMMENT ON COLUMN medical_device_assessment_grade_flag.priority IS
    'Priority. One of: low, medium, high.';
COMMENT ON COLUMN medical_device_assessment_grade_flag.description IS
    'Description.';
COMMENT ON COLUMN medical_device_assessment_grade_flag.suggested_action IS
    'Suggested action.';
