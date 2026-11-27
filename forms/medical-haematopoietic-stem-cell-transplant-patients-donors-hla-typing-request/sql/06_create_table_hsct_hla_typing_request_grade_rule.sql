-- Audit trail of every scoring rule that fired.

CREATE TABLE medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    grade_id UUID NOT NULL REFERENCES medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request_grade(id) ON DELETE CASCADE,
    rule_id VARCHAR(40) NOT NULL,
    axis VARCHAR(20) NOT NULL DEFAULT '' CHECK (axis IN ('appropriateness', 'identity', 'completeness', 'triage', '')),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_mhsct_grade_rule_updated_at
    BEFORE UPDATE ON medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.set_updated_at();

COMMENT ON TABLE medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request_grade_rule IS
    'Audit trail of every appropriateness / identity / completeness / triage rule that fired for this request.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request_grade_rule.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request_grade_rule.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request_grade_rule.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request_grade_rule.grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request_grade_rule.rule_id IS
    'Stable rule identifier (for example R-ID-3PT-01).';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request_grade_rule.axis IS
    'Scoring axis: appropriateness, identity, completeness, triage.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request_grade_rule.category IS
    'Category the rule relates to.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request_grade_rule.description IS
    'Human-readable description of why the rule fired.';

CREATE INDEX index_mhsct_grade_rule_grade_id ON medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request_grade_rule(grade_id);
