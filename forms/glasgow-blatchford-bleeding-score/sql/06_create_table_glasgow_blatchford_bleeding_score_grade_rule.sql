-- Audit trail of every grading rule that fired during Glasgow-Blatchford
-- computation. Each row records one rule firing with the parameter it
-- belongs to, the points it contributed, and a human-readable
-- description.

CREATE TABLE glasgow_blatchford_bleeding_score_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    glasgow_blatchford_bleeding_score_grade_id UUID NOT NULL
        REFERENCES glasgow_blatchford_bleeding_score_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    parameter VARCHAR(30) NOT NULL
        CHECK (parameter IN (
            'blood-urea',
            'haemoglobin',
            'systolic-blood-pressure',
            'pulse',
            'melaena',
            'syncope',
            'hepatic-disease',
            'cardiac-failure',
            'band'
        )),
    points INT,
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX glasgow_blatchford_bleeding_score_grade_rule_grade_id_idx
    ON glasgow_blatchford_bleeding_score_grade_rule (glasgow_blatchford_bleeding_score_grade_id);

CREATE TRIGGER trigger_glasgow_blatchford_bleeding_score_grade_rule_updated_at
    BEFORE UPDATE ON glasgow_blatchford_bleeding_score_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE glasgow_blatchford_bleeding_score_grade_rule IS
    'Audit trail of every grading rule that fired during Glasgow-Blatchford computation: parameter, points contributed, category, and description.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score_grade_rule.glasgow_blatchford_bleeding_score_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-BLOOD-UREA-6POINT-01).';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score_grade_rule.parameter IS
    'Scored parameter the rule belongs to: blood-urea, haemoglobin, systolic-blood-pressure, pulse, melaena, syncope, hepatic-disease, cardiac-failure, or band.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score_grade_rule.points IS
    'Points contributed by this rule for its parameter.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score_grade_rule.category IS
    'Subject category (e.g. threshold-band, band-band).';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score_grade_rule.description IS
    'Human-readable description of why the rule fired.';
