-- Audit trail of every classification rule that fired for this prescription.

CREATE TABLE eye_prescription_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    eye_prescription_grade_id UUID NOT NULL
        REFERENCES eye_prescription_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    instrument VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (instrument IN (
            'sphere',
            'cylinder',
            'addition',
            'anisometropia',
            'prism',
            'change',
            ''
        )),
    eye VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (eye IN ('right', 'left', 'both', '')),
    class VARCHAR(40) NOT NULL DEFAULT '',
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_eye_prescription_grade_rule_updated_at
    BEFORE UPDATE ON eye_prescription_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE INDEX index_eye_prescription_grade_rule_grade_id
    ON eye_prescription_grade_rule(eye_prescription_grade_id);

COMMENT ON TABLE eye_prescription_grade_rule IS
    'Audit trail of every sphere / cylinder / addition / anisometropia / prism / change rule that fired during classification.';
COMMENT ON COLUMN eye_prescription_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN eye_prescription_grade_rule.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN eye_prescription_grade_rule.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN eye_prescription_grade_rule.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN eye_prescription_grade_rule.eye_prescription_grade_id IS
    'Foreign key to the parent eye_prescription_grade.';
COMMENT ON COLUMN eye_prescription_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-SPH-MYO-HIGH-01).';
COMMENT ON COLUMN eye_prescription_grade_rule.instrument IS
    'Classification instrument: sphere, cylinder, addition, anisometropia, prism, change.';
COMMENT ON COLUMN eye_prescription_grade_rule.eye IS
    'Which eye the rule applied to: right, left, both.';
COMMENT ON COLUMN eye_prescription_grade_rule.class IS
    'Class contributed by this rule (e.g. high-myopia, mild-astigmatism).';
COMMENT ON COLUMN eye_prescription_grade_rule.category IS
    'Risk / classification category (e.g. refraction, alignment).';
COMMENT ON COLUMN eye_prescription_grade_rule.description IS
    'Human-readable description of why the rule fired.';
