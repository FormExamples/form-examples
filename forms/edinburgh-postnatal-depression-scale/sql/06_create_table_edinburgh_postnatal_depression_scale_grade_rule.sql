-- Audit trail of every grading rule that fired during EPDS computation.
-- Each row records one rule firing with the item or aspect it belongs
-- to, the points it contributed, and a human-readable description.

CREATE TABLE edinburgh_postnatal_depression_scale_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    edinburgh_postnatal_depression_scale_grade_id UUID NOT NULL
        REFERENCES edinburgh_postnatal_depression_scale_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    parameter VARCHAR(20) NOT NULL
        CHECK (parameter IN ('item', 'total', 'band', 'self-harm', 'anxiety-subscale', 'other', '')),
    points INT,
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX edinburgh_postnatal_depression_scale_grade_rule_grade_id_idx
    ON edinburgh_postnatal_depression_scale_grade_rule (edinburgh_postnatal_depression_scale_grade_id);

CREATE TRIGGER trigger_edinburgh_postnatal_depression_scale_grade_rule_updated_at
    BEFORE UPDATE ON edinburgh_postnatal_depression_scale_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE edinburgh_postnatal_depression_scale_grade_rule IS
    'Audit trail of every grading rule that fired during EPDS computation: parameter, points contributed, category, and description.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale_grade_rule.edinburgh_postnatal_depression_scale_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-ITEM-10-SCORE-01).';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale_grade_rule.parameter IS
    'Aspect the rule belongs to: item, total, band, self-harm, anxiety-subscale, or other.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale_grade_rule.points IS
    'Points (0-3) contributed by this rule, where applicable.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale_grade_rule.category IS
    'Subject category (e.g. item-score, band-threshold, safety).';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale_grade_rule.description IS
    'Human-readable description of why the rule fired.';
