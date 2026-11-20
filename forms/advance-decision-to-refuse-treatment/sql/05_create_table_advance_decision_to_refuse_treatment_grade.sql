CREATE TABLE advance_decision_to_refuse_treatment.grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES advance_decision_to_refuse_treatment.assessment(id) ON DELETE CASCADE,
    validity_level VARCHAR(12) NOT NULL DEFAULT 'incomplete'
        CHECK (validity_level IN ('valid', 'invalid', 'incomplete')),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON advance_decision_to_refuse_treatment.grade
    FOR EACH ROW
    EXECUTE FUNCTION advance_decision_to_refuse_treatment.set_updated_at();

COMMENT ON TABLE advance_decision_to_refuse_treatment.grade IS
    'Computed validity grading result for the advance decision to refuse treatment. One-to-one child of assessment.';
COMMENT ON COLUMN advance_decision_to_refuse_treatment.grade.assessment_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN advance_decision_to_refuse_treatment.grade.validity_level IS
    'Overall validity classification: valid, invalid, or incomplete per Mental Capacity Act 2005 requirements.';
COMMENT ON COLUMN advance_decision_to_refuse_treatment.grade.graded_at IS
    'Timestamp when the validity grading was computed.';

COMMENT ON COLUMN advance_decision_to_refuse_treatment.grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN advance_decision_to_refuse_treatment.grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN advance_decision_to_refuse_treatment.grade.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN advance_decision_to_refuse_treatment.grade.deleted_at IS
    'Timestamp when this row was deleted.';
