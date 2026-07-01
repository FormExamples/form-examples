-- Audit trail of every classification rule that fired while selecting the
-- MTS priority level. Each row records one rule firing with the instrument
-- that produced it, the minimum level it justified, a subject category, and
-- a human-readable description. Because the engine selects (does not sum),
-- these rows explain why the assigned level is the most urgent justified.

CREATE TABLE emergency_department_triage_note_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    emergency_department_triage_note_grade_id UUID NOT NULL
        REFERENCES emergency_department_triage_note_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    instrument VARCHAR(30) NOT NULL
        CHECK (instrument IN ('discriminator', 'news2', 'pain', 'vital-sign', 'composite')),
    band INT
        CHECK (band IS NULL OR band BETWEEN 1 AND 5),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX emergency_department_triage_note_grade_rule_grade_id_idx
    ON emergency_department_triage_note_grade_rule (emergency_department_triage_note_grade_id);

CREATE TRIGGER trigger_emergency_department_triage_note_grade_rule_updated_at
    BEFORE UPDATE ON emergency_department_triage_note_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE emergency_department_triage_note_grade_rule IS
    'Audit trail of every classification rule that fired while selecting the MTS priority level: instrument, minimum level justified, category, and description.';
COMMENT ON COLUMN emergency_department_triage_note_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN emergency_department_triage_note_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN emergency_department_triage_note_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN emergency_department_triage_note_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN emergency_department_triage_note_grade_rule.emergency_department_triage_note_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN emergency_department_triage_note_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-DISCRIMINATOR-AIRWAY-01).';
COMMENT ON COLUMN emergency_department_triage_note_grade_rule.instrument IS
    'Classification instrument the rule belongs to: discriminator, news2, pain, vital-sign, or composite.';
COMMENT ON COLUMN emergency_department_triage_note_grade_rule.band IS
    'Minimum MTS priority level (1-5) justified by this rule; NULL when not applicable.';
COMMENT ON COLUMN emergency_department_triage_note_grade_rule.category IS
    'Subject category (e.g. airway, sepsis, deterioration, pain).';
COMMENT ON COLUMN emergency_department_triage_note_grade_rule.description IS
    'Human-readable description of why the rule fired.';
