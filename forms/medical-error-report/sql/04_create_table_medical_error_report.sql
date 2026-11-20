CREATE TABLE medical_error_report.assessment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    patient_id UUID NOT NULL
        REFERENCES medical_error_report.patient(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'reviewed', 'urgent'))
);

CREATE TRIGGER trigger_assessment_updated_at
    BEFORE UPDATE ON medical_error_report.assessment
    FOR EACH ROW
    EXECUTE FUNCTION medical_error_report.set_updated_at();

COMMENT ON TABLE medical_error_report.assessment IS
    'Medical error report using WHO Severity Scale and NCC MERP Harm Categories. Parent entity for all report sections.';
COMMENT ON COLUMN medical_error_report.assessment.patient_id IS
    'Foreign key to the patient who owns this report.';
COMMENT ON COLUMN medical_error_report.assessment.status IS
    'Lifecycle status: draft, submitted, reviewed, or urgent.';

COMMENT ON COLUMN medical_error_report.assessment.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_error_report.assessment.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN medical_error_report.assessment.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN medical_error_report.assessment.deleted_at IS
    'Timestamp when this row was deleted.';
