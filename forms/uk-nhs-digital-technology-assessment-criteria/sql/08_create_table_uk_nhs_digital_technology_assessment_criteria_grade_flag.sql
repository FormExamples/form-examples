CREATE TABLE uk_nhs_digital_technology_assessment_criteria_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    uk_nhs_digital_technology_assessment_criteria_grade_id UUID NOT NULL REFERENCES uk_nhs_digital_technology_assessment_criteria_grade(id) ON DELETE CASCADE,
    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(30) NOT NULL DEFAULT '' CHECK (category IN ('company', 'value-proposition', 'clinical-safety', 'data-protection', 'technical-security', 'interoperability', 'accessibility', 'completeness', '')),
    severity VARCHAR(10) NOT NULL DEFAULT '' CHECK (severity IN ('info','warning','critical','')),
    message VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_uk_nhs_digital_technology_assessment_criteria_grade_flag_grade_id ON uk_nhs_digital_technology_assessment_criteria_grade_flag(uk_nhs_digital_technology_assessment_criteria_grade_id);

CREATE TRIGGER trigger_uk_nhs_digital_technology_assessment_criteria_grade_flag_updated_at
    BEFORE UPDATE ON uk_nhs_digital_technology_assessment_criteria_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE uk_nhs_digital_technology_assessment_criteria_grade_flag IS
    'Flagged issues raised for this assessment.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade_flag.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade_flag.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade_flag.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade_flag.uk_nhs_digital_technology_assessment_criteria_grade_id IS
    'Foreign key to the grade table.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade_flag.flag_id IS
    'Identifier of the flag.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade_flag.category IS
    'Flag category.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade_flag.severity IS
    'Flag severity.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade_flag.message IS
    'Human-readable flag message.';
