-- Audit trail of every classification rule that fired during grading. Each
-- row records one rule firing with the area of the assessment it concerns,
-- the category, and a human-readable description.

CREATE TABLE mental_health_act_assessment_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    mental_health_act_assessment_grade_id UUID NOT NULL
        REFERENCES mental_health_act_assessment_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    section VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (section IN ('signatories', 'criteria', 'completeness', 'urgency', 'time-limits', 'other', '')),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX mental_health_act_assessment_grade_rule_grade_id_idx
    ON mental_health_act_assessment_grade_rule (mental_health_act_assessment_grade_id);

CREATE TRIGGER trigger_mental_health_act_assessment_grade_rule_updated_at
    BEFORE UPDATE ON mental_health_act_assessment_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE mental_health_act_assessment_grade_rule IS
    'Audit trail of every classification rule that fired during grading: assessment area, category, and description.';
COMMENT ON COLUMN mental_health_act_assessment_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN mental_health_act_assessment_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN mental_health_act_assessment_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN mental_health_act_assessment_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN mental_health_act_assessment_grade_rule.mental_health_act_assessment_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN mental_health_act_assessment_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-SIGNATORIES-S2-01).';
COMMENT ON COLUMN mental_health_act_assessment_grade_rule.section IS
    'Assessment area the rule concerns: signatories, criteria, completeness, urgency, time-limits, or other.';
COMMENT ON COLUMN mental_health_act_assessment_grade_rule.category IS
    'Subject category (e.g. required-signatory, required-criterion, classification).';
COMMENT ON COLUMN mental_health_act_assessment_grade_rule.description IS
    'Human-readable description of why the rule fired.';
