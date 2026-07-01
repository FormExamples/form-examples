-- Clinically significant flags that fire independently of the classification,
-- with priority and a suggested action for the assessing team.

CREATE TABLE pulmonary_embolism_rule_out_criteria_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    pulmonary_embolism_rule_out_criteria_grade_id UUID NOT NULL
        REFERENCES pulmonary_embolism_rule_out_criteria_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (category IN (
            'requires-workup',
            'not-applicable',
            'hypoxia',
            'tachycardia',
            'prior-vte',
            'incomplete',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX pulmonary_embolism_rule_out_criteria_grade_flag_grade_id_idx
    ON pulmonary_embolism_rule_out_criteria_grade_flag (pulmonary_embolism_rule_out_criteria_grade_id);

CREATE TRIGGER trigger_pulmonary_embolism_rule_out_criteria_grade_flag_updated_at
    BEFORE UPDATE ON pulmonary_embolism_rule_out_criteria_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE pulmonary_embolism_rule_out_criteria_grade_flag IS
    'Clinically significant flags that fire independently of the classification, with priority and a suggested action for the assessing team.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria_grade_flag.pulmonary_embolism_rule_out_criteria_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-REQUIRES-WORKUP-001).';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria_grade_flag.category IS
    'Flag category: requires-workup, not-applicable, hypoxia, tachycardia, prior-vte, incomplete, or other.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria_grade_flag.suggested_action IS
    'Suggested clinical action (e.g. "proceed to D-dimer and/or imaging per local policy").';
