-- Safety-critical flags, independent of the axes.

CREATE TABLE medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    grade_id UUID NOT NULL REFERENCES medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request_grade(id) ON DELETE CASCADE,
    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT '' CHECK (category IN ('no-clinical-details', 'abacavir-start-pending', 'previous-hla-result-possible-duplicate', 'high-risk-sample', 'identity-mismatch-risk', 'report-destination-missing', 'other', '')),
    priority VARCHAR(10) NOT NULL DEFAULT '' CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_mhldar_grade_flag_updated_at
    BEFORE UPDATE ON medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION medical_human_leukocyte_and_disease_association_request.set_updated_at();

COMMENT ON TABLE medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request_grade_flag IS
    'Safety-critical flags that fire independently of the four axes, with priority and a suggested action.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request_grade_flag.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request_grade_flag.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request_grade_flag.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request_grade_flag.grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request_grade_flag.flag_id IS
    'Stable flag identifier (for example F-DAY-OF-TRANSPLANT-001).';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request_grade_flag.category IS
    'Flag category.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request_grade_flag.suggested_action IS
    'Suggested action for the requester or laboratory.';

CREATE INDEX index_mhldar_grade_flag_grade_id ON medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request_grade_flag(grade_id);
