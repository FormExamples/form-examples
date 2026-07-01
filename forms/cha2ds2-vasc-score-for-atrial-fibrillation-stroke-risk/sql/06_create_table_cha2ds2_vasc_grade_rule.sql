-- Audit trail of every grading rule that fired during CHA2DS2-VASc
-- computation. Each row records one rule firing with the criterion it
-- belongs to, the points it contributed, and a human-readable
-- description.

CREATE TABLE cha2ds2_vasc_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    cha2ds2_vasc_grade_id UUID NOT NULL
        REFERENCES cha2ds2_vasc_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    criterion VARCHAR(30) NOT NULL
        CHECK (criterion IN ('congestive-heart-failure', 'hypertension', 'age', 'diabetes', 'stroke', 'vascular-disease', 'sex', 'risk-band')),
    points INT,
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX cha2ds2_vasc_grade_rule_grade_id_idx
    ON cha2ds2_vasc_grade_rule (cha2ds2_vasc_grade_id);

CREATE TRIGGER trigger_cha2ds2_vasc_grade_rule_updated_at
    BEFORE UPDATE ON cha2ds2_vasc_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE cha2ds2_vasc_grade_rule IS
    'Audit trail of every grading rule that fired during CHA2DS2-VASc computation: criterion, points contributed, category, and description.';
COMMENT ON COLUMN cha2ds2_vasc_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN cha2ds2_vasc_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN cha2ds2_vasc_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN cha2ds2_vasc_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN cha2ds2_vasc_grade_rule.cha2ds2_vasc_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN cha2ds2_vasc_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-STROKE-2POINT-01).';
COMMENT ON COLUMN cha2ds2_vasc_grade_rule.criterion IS
    'Scored criterion the rule belongs to: congestive-heart-failure, hypertension, age, diabetes, stroke, vascular-disease, sex, or risk-band.';
COMMENT ON COLUMN cha2ds2_vasc_grade_rule.points IS
    'Points contributed by this rule for its criterion.';
COMMENT ON COLUMN cha2ds2_vasc_grade_rule.category IS
    'Subject category (e.g. criterion-fired, risk-band).';
COMMENT ON COLUMN cha2ds2_vasc_grade_rule.description IS
    'Human-readable description of why the rule fired.';
