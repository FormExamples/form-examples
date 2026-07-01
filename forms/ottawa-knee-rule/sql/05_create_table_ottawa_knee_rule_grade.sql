-- Computed Ottawa Knee Rule grading result. Stores the engine-computed binary
-- imaging decision: whether a knee radiograph is indicated (xray_indicated) and
-- the resulting decision label. This is a decision rule, not a score, so there
-- is no total. One-to-one with the parent assessment.

CREATE TABLE ottawa_knee_rule_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    ottawa_knee_rule_id UUID NOT NULL UNIQUE
        REFERENCES ottawa_knee_rule(id) ON DELETE CASCADE,

    xray_indicated VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (xray_indicated IN ('yes', 'no', '')),
    decision VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (decision IN ('xray-indicated', 'xray-not-indicated', '')),
    recommended_action TEXT NOT NULL DEFAULT '',
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_ottawa_knee_rule_grade_updated_at
    BEFORE UPDATE ON ottawa_knee_rule_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE ottawa_knee_rule_grade IS
    'Computed Ottawa Knee Rule grading result: the binary imaging decision (xray_indicated) and decision label. One-to-one with the parent assessment.';
COMMENT ON COLUMN ottawa_knee_rule_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN ottawa_knee_rule_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN ottawa_knee_rule_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN ottawa_knee_rule_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN ottawa_knee_rule_grade.ottawa_knee_rule_id IS
    'Foreign key to the parent assessment (unique, 1:1).';
COMMENT ON COLUMN ottawa_knee_rule_grade.xray_indicated IS
    'Whether a knee radiograph is indicated: yes when any one criterion fires, no when all five are absent.';
COMMENT ON COLUMN ottawa_knee_rule_grade.decision IS
    'Decision label: xray-indicated or xray-not-indicated.';
COMMENT ON COLUMN ottawa_knee_rule_grade.recommended_action IS
    'Recommended action: obtain a knee radiograph per local protocol when indicated, otherwise imaging is not required by the rule.';
COMMENT ON COLUMN ottawa_knee_rule_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
