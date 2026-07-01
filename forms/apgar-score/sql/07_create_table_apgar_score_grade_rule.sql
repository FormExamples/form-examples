-- Audit trail of every grading rule that fired during Apgar computation. Each
-- row records one rule firing with the timepoint and sign it belongs to, the
-- points it contributed, and a human-readable description. Cross-timepoint
-- rules (total banding, trend) leave timepoint_minutes null or use the
-- 'total' / 'trend' sign.

CREATE TABLE apgar_score_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    apgar_score_grade_id UUID NOT NULL
        REFERENCES apgar_score_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    timepoint_minutes INT,
    sign VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (sign IN ('appearance', 'pulse', 'grimace', 'activity', 'respiration', 'total', 'trend', '')),
    points INT,
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX apgar_score_grade_rule_grade_id_idx
    ON apgar_score_grade_rule (apgar_score_grade_id);

CREATE TRIGGER trigger_apgar_score_grade_rule_updated_at
    BEFORE UPDATE ON apgar_score_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE apgar_score_grade_rule IS
    'Audit trail of every grading rule that fired during Apgar computation: timepoint, sign, points contributed, category, and description.';
COMMENT ON COLUMN apgar_score_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN apgar_score_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN apgar_score_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN apgar_score_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN apgar_score_grade_rule.apgar_score_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN apgar_score_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-TOTAL-BAND-01, R-TREND-FALLING-01).';
COMMENT ON COLUMN apgar_score_grade_rule.timepoint_minutes IS
    'Timepoint in minutes the rule applies to (1, 5, 10, ...); null for cross-timepoint rules such as trend.';
COMMENT ON COLUMN apgar_score_grade_rule.sign IS
    'Scored sign the rule belongs to: appearance, pulse, grimace, activity, respiration, total (per-timepoint sum), or trend (across timepoints).';
COMMENT ON COLUMN apgar_score_grade_rule.points IS
    'Points (0-2 for a sign, 0-10 for a total) contributed by this rule.';
COMMENT ON COLUMN apgar_score_grade_rule.category IS
    'Subject category (e.g. sign-score, total-band, trend-band).';
COMMENT ON COLUMN apgar_score_grade_rule.description IS
    'Human-readable description of why the rule fired.';
