CREATE TABLE medical_language_speaking_assessment_for_english.assessment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    patient_id UUID NOT NULL
        REFERENCES medical_language_speaking_assessment_for_english.patient(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'reviewed', 'urgent'))
);

CREATE TRIGGER trigger_assessment_updated_at
    BEFORE UPDATE ON medical_language_speaking_assessment_for_english.assessment
    FOR EACH ROW
    EXECUTE FUNCTION medical_language_speaking_assessment_for_english.set_updated_at();

COMMENT ON TABLE medical_language_speaking_assessment_for_english.assessment IS 'Top-level assessment instance for medical-language-speaking-assessment-for-english. Parent entity for domain-specific sections and the grading result.';
COMMENT ON COLUMN medical_language_speaking_assessment_for_english.assessment.patient_id IS 'Foreign key to the patient who owns this assessment.';
COMMENT ON COLUMN medical_language_speaking_assessment_for_english.assessment.status IS 'Lifecycle status: draft, submitted, reviewed, or urgent.';

COMMENT ON COLUMN medical_language_speaking_assessment_for_english.assessment.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_language_speaking_assessment_for_english.assessment.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN medical_language_speaking_assessment_for_english.assessment.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN medical_language_speaking_assessment_for_english.assessment.deleted_at IS
    'Timestamp when this row was deleted.';
