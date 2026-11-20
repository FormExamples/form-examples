CREATE TABLE employee_offboarding_checklist.assessment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    patient_id UUID NOT NULL
        REFERENCES employee_offboarding_checklist.patient(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'reviewed', 'urgent'))
);

CREATE TRIGGER trigger_assessment_updated_at
    BEFORE UPDATE ON employee_offboarding_checklist.assessment
    FOR EACH ROW
    EXECUTE FUNCTION employee_offboarding_checklist.set_updated_at();

COMMENT ON TABLE employee_offboarding_checklist.assessment IS 'Top-level assessment instance for employee-offboarding-checklist. Parent entity for domain-specific sections and the grading result.';
COMMENT ON COLUMN employee_offboarding_checklist.assessment.patient_id IS 'Foreign key to the patient who owns this assessment.';
COMMENT ON COLUMN employee_offboarding_checklist.assessment.status IS 'Lifecycle status: draft, submitted, reviewed, or urgent.';

COMMENT ON COLUMN employee_offboarding_checklist.assessment.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN employee_offboarding_checklist.assessment.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN employee_offboarding_checklist.assessment.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN employee_offboarding_checklist.assessment.deleted_at IS
    'Timestamp when this row was deleted.';
