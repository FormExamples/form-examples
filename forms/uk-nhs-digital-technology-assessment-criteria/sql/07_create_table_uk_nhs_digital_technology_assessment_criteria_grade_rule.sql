CREATE TABLE uk_nhs_digital_technology_assessment_criteria_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    grade_id UUID NOT NULL REFERENCES uk_nhs_digital_technology_assessment_criteria_grade(id) ON DELETE CASCADE,
    rule_id VARCHAR(30) NOT NULL,
    section CHAR(1) NOT NULL CHECK (section IN ('a','b','c','d','e','f','g')),
    criterion_id VARCHAR(5) NOT NULL CHECK (criterion_id IN ('a1', 'a2', 'a3', 'a4', 'b1', 'b2', 'b3', 'b4', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7')),
    status VARCHAR(15) NOT NULL DEFAULT '' CHECK (status IN ('met','partially-met','not-met','not-applicable','')),
    mandatory BOOLEAN NOT NULL DEFAULT TRUE,
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_uk_nhs_digital_technology_assessment_criteria_grade_rule_grade_id ON uk_nhs_digital_technology_assessment_criteria_grade_rule(grade_id);

CREATE TRIGGER trigger_uk_nhs_digital_technology_assessment_criteria_grade_rule_updated_at
    BEFORE UPDATE ON uk_nhs_digital_technology_assessment_criteria_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE uk_nhs_digital_technology_assessment_criteria_grade_rule IS
    'Audit trail of every criterion rule that fired for this assessment.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade_rule.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade_rule.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade_rule.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade_rule.grade_id IS
    'Foreign key to the grade table.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade_rule.rule_id IS
    'Identifier of the rule that fired.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade_rule.section IS
    'DTAC section letter.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade_rule.criterion_id IS
    'Criterion identifier, for example c2.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade_rule.status IS
    'Status of the criterion when the rule fired.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade_rule.mandatory IS
    'Whether the criterion is mandatory.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade_rule.description IS
    'Human-readable rule description.';
