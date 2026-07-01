-- Audit trail of every grading rule that fired during Glasgow Coma
-- Scale computation. Each row records one rule firing with the
-- component it belongs to, the score it contributed, and a
-- human-readable description.

CREATE TABLE glasgow_coma_scale_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    glasgow_coma_scale_grade_id UUID NOT NULL
        REFERENCES glasgow_coma_scale_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    component VARCHAR(20) NOT NULL
        CHECK (component IN ('eye', 'verbal', 'motor', 'total', 'pupils', 'gcs-p', 'trend', 'other')),
    points INT,
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX glasgow_coma_scale_grade_rule_grade_id_idx
    ON glasgow_coma_scale_grade_rule (glasgow_coma_scale_grade_id);

CREATE TRIGGER trigger_glasgow_coma_scale_grade_rule_updated_at
    BEFORE UPDATE ON glasgow_coma_scale_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE glasgow_coma_scale_grade_rule IS
    'Audit trail of every grading rule that fired during Glasgow Coma Scale computation: component, score contributed, category, and description.';
COMMENT ON COLUMN glasgow_coma_scale_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN glasgow_coma_scale_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN glasgow_coma_scale_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN glasgow_coma_scale_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN glasgow_coma_scale_grade_rule.glasgow_coma_scale_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN glasgow_coma_scale_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-EYE-SPONTANEOUS-01, R-TOTAL-BAND-SEVERE-01).';
COMMENT ON COLUMN glasgow_coma_scale_grade_rule.component IS
    'Assessment component the rule belongs to: eye, verbal, motor, total, pupils, gcs-p, trend, or other.';
COMMENT ON COLUMN glasgow_coma_scale_grade_rule.points IS
    'Score contributed by this rule for its component (e.g. the resolved component score), when applicable.';
COMMENT ON COLUMN glasgow_coma_scale_grade_rule.category IS
    'Subject category (e.g. component-score, severity-band, pupil-reactivity).';
COMMENT ON COLUMN glasgow_coma_scale_grade_rule.description IS
    'Human-readable description of why the rule fired.';
