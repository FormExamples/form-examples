-- Audit trail of every completeness rule that fired during grading. Each
-- row records one rule firing with the component it concerns, the
-- category, and a human-readable description.

CREATE TABLE ward_round_note_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    ward_round_note_grade_id UUID NOT NULL
        REFERENCES ward_round_note_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    component VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (component IN (
            'header',
            'problems',
            'examination',
            'investigations',
            'vte',
            'medication',
            'plan',
            'escalation',
            'overnight-events',
            'estimated-discharge',
            'completeness',
            ''
        )),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX ward_round_note_grade_rule_grade_id_idx
    ON ward_round_note_grade_rule (ward_round_note_grade_id);

CREATE TRIGGER trigger_ward_round_note_grade_rule_updated_at
    BEFORE UPDATE ON ward_round_note_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE ward_round_note_grade_rule IS
    'Audit trail of every completeness rule that fired during grading: component, category, and description.';
COMMENT ON COLUMN ward_round_note_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN ward_round_note_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN ward_round_note_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN ward_round_note_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN ward_round_note_grade_rule.ward_round_note_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN ward_round_note_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-PLAN-DOCUMENTED-01).';
COMMENT ON COLUMN ward_round_note_grade_rule.component IS
    'Review component the rule concerns: header, problems, examination, investigations, vte, medication, plan, escalation, overnight-events, estimated-discharge, or completeness.';
COMMENT ON COLUMN ward_round_note_grade_rule.category IS
    'Subject category (e.g. required-component, recommended-component).';
COMMENT ON COLUMN ward_round_note_grade_rule.description IS
    'Human-readable description of why the rule fired.';
