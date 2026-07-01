-- Audit trail of every grading rule that fired during Zarit Burden
-- Interview computation. Each row records one fired item (an answered item
-- with a rating of 1 or more) with the item number, the points it
-- contributed, and a human-readable description.

CREATE TABLE zarit_burden_interview_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    zarit_burden_interview_grade_id UUID NOT NULL
        REFERENCES zarit_burden_interview_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    item_number SMALLINT,
    points SMALLINT,
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX zarit_burden_interview_grade_rule_grade_id_idx
    ON zarit_burden_interview_grade_rule (zarit_burden_interview_grade_id);

CREATE TRIGGER trigger_zarit_burden_interview_grade_rule_updated_at
    BEFORE UPDATE ON zarit_burden_interview_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE zarit_burden_interview_grade_rule IS
    'Audit trail of every grading rule that fired during Zarit Burden Interview computation: item number, points contributed, category, and description.';
COMMENT ON COLUMN zarit_burden_interview_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN zarit_burden_interview_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN zarit_burden_interview_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN zarit_burden_interview_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN zarit_burden_interview_grade_rule.zarit_burden_interview_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN zarit_burden_interview_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-ITEM-22-FIRED-01).';
COMMENT ON COLUMN zarit_burden_interview_grade_rule.item_number IS
    'Item number (1-22) the fired rule belongs to, or NULL for a whole-form rule.';
COMMENT ON COLUMN zarit_burden_interview_grade_rule.points IS
    'Points (0-4) contributed by this item to the total.';
COMMENT ON COLUMN zarit_burden_interview_grade_rule.category IS
    'Subject category (e.g. item-rating, short-form-item).';
COMMENT ON COLUMN zarit_burden_interview_grade_rule.description IS
    'Human-readable description of why the rule fired.';
