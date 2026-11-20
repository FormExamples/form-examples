CREATE TABLE united_kingdom_maternity_certificate_mat_b1.assessment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    patient_id UUID NOT NULL
        REFERENCES united_kingdom_maternity_certificate_mat_b1.patient(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'reviewed', 'urgent'))
);

CREATE TRIGGER trigger_assessment_updated_at
    BEFORE UPDATE ON united_kingdom_maternity_certificate_mat_b1.assessment
    FOR EACH ROW
    EXECUTE FUNCTION united_kingdom_maternity_certificate_mat_b1.set_updated_at();

COMMENT ON TABLE united_kingdom_maternity_certificate_mat_b1.assessment IS 'Top-level assessment instance for united-kingdom-maternity-certificate-mat-b1. Parent entity for domain-specific sections and the grading result.';
COMMENT ON COLUMN united_kingdom_maternity_certificate_mat_b1.assessment.patient_id IS 'Foreign key to the patient who owns this assessment.';
COMMENT ON COLUMN united_kingdom_maternity_certificate_mat_b1.assessment.status IS 'Lifecycle status: draft, submitted, reviewed, or urgent.';

COMMENT ON COLUMN united_kingdom_maternity_certificate_mat_b1.assessment.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_kingdom_maternity_certificate_mat_b1.assessment.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN united_kingdom_maternity_certificate_mat_b1.assessment.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN united_kingdom_maternity_certificate_mat_b1.assessment.deleted_at IS
    'Timestamp when this row was deleted.';
