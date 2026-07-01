-- Audit trail of every grading rule that fired during 4AT computation.
-- Each row records one rule firing with the item it belongs to, the
-- points it contributed, and a human-readable description.

CREATE TABLE four_a_test_for_delirium_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    four_a_test_for_delirium_grade_id UUID NOT NULL
        REFERENCES four_a_test_for_delirium_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    item VARCHAR(20) NOT NULL
        CHECK (item IN ('alertness', 'amt4', 'attention', 'acute-change', 'band')),
    points INT,
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX four_a_test_for_delirium_grade_rule_grade_id_idx
    ON four_a_test_for_delirium_grade_rule (four_a_test_for_delirium_grade_id);

CREATE TRIGGER trigger_four_a_test_for_delirium_grade_rule_updated_at
    BEFORE UPDATE ON four_a_test_for_delirium_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE four_a_test_for_delirium_grade_rule IS
    'Audit trail of every grading rule that fired during 4AT computation: item, points contributed, category, and description.';
COMMENT ON COLUMN four_a_test_for_delirium_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN four_a_test_for_delirium_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN four_a_test_for_delirium_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN four_a_test_for_delirium_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN four_a_test_for_delirium_grade_rule.four_a_test_for_delirium_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN four_a_test_for_delirium_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-ALERTNESS-4POINT-01).';
COMMENT ON COLUMN four_a_test_for_delirium_grade_rule.item IS
    'Scored item the rule belongs to: alertness, amt4, attention, acute-change, or band.';
COMMENT ON COLUMN four_a_test_for_delirium_grade_rule.points IS
    'Points contributed by this rule for its item.';
COMMENT ON COLUMN four_a_test_for_delirium_grade_rule.category IS
    'Subject category (e.g. item-score, band-assignment).';
COMMENT ON COLUMN four_a_test_for_delirium_grade_rule.description IS
    'Human-readable description of why the rule fired.';
