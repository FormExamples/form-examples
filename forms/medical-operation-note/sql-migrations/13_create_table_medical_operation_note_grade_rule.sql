-- Audit trail of every grading rule that fired during composite-risk
-- computation. Each row records one rule firing with the instrument
-- that produced it, the band it contributed, and a human-readable
-- description.

CREATE TABLE medical_operation_note_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    medical_operation_note_grade_id UUID NOT NULL
        REFERENCES medical_operation_note_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    instrument VARCHAR(30) NOT NULL
        CHECK (instrument IN ('blood-loss', 'transfusion', 'clavien-dindo', 'counts', 'never-event', 'anaesthetic-event', 'conversion', 'asa', 'composite')),
    band VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (band IN ('routine', 'complicated', 'high-risk', 'critical', '')),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX medical_operation_note_grade_rule_grade_id_idx
    ON medical_operation_note_grade_rule (medical_operation_note_grade_id);

CREATE TRIGGER trigger_medical_operation_note_grade_rule_updated_at
    BEFORE UPDATE ON medical_operation_note_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE medical_operation_note_grade_rule IS
    'Audit trail of every grading rule that fired during composite-risk computation: instrument, band, category, and description.';
COMMENT ON COLUMN medical_operation_note_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_operation_note_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN medical_operation_note_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN medical_operation_note_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN medical_operation_note_grade_rule.medical_operation_note_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN medical_operation_note_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-BLOOD-LOSS-MASSIVE-01).';
COMMENT ON COLUMN medical_operation_note_grade_rule.instrument IS
    'Scoring instrument the rule belongs to: blood-loss, transfusion, clavien-dindo, counts, never-event, anaesthetic-event, conversion, asa, or composite.';
COMMENT ON COLUMN medical_operation_note_grade_rule.band IS
    'Composite-risk band contributed by this rule: routine, complicated, high-risk, or critical.';
COMMENT ON COLUMN medical_operation_note_grade_rule.category IS
    'Subject category (e.g. haemorrhage, count-discrepancy, anaesthetic-incident).';
COMMENT ON COLUMN medical_operation_note_grade_rule.description IS
    'Human-readable description of why the rule fired.';
