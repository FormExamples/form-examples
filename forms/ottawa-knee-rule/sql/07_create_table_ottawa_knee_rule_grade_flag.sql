-- Clinically significant flags that fire independently of the imaging decision,
-- each with a priority and a suggested action for the assessing team.

CREATE TABLE ottawa_knee_rule_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    ottawa_knee_rule_grade_id UUID NOT NULL
        REFERENCES ottawa_knee_rule_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (category IN (
            'xray-indicated',
            'unable-to-bear-weight',
            'other-bony-tenderness',
            'applicability',
            'incomplete',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX ottawa_knee_rule_grade_flag_grade_id_idx
    ON ottawa_knee_rule_grade_flag (ottawa_knee_rule_grade_id);

CREATE TRIGGER trigger_ottawa_knee_rule_grade_flag_updated_at
    BEFORE UPDATE ON ottawa_knee_rule_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE ottawa_knee_rule_grade_flag IS
    'Clinically significant flags that fire independently of the imaging decision, with priority and a suggested action for the assessing team.';
COMMENT ON COLUMN ottawa_knee_rule_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN ottawa_knee_rule_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN ottawa_knee_rule_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN ottawa_knee_rule_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN ottawa_knee_rule_grade_flag.ottawa_knee_rule_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN ottawa_knee_rule_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-XRAY-INDICATED-001).';
COMMENT ON COLUMN ottawa_knee_rule_grade_flag.category IS
    'Flag category: xray-indicated, unable-to-bear-weight, other-bony-tenderness, applicability, incomplete, or other.';
COMMENT ON COLUMN ottawa_knee_rule_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN ottawa_knee_rule_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN ottawa_knee_rule_grade_flag.suggested_action IS
    'Suggested clinical action (e.g. "obtain a knee radiograph per local protocol", "complete the outstanding criterion inputs").';
