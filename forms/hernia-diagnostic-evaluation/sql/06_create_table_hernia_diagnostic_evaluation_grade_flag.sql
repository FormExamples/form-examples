-- Safety-critical flags that fire independently of the computed urgency band,
-- with a priority and a suggested action for the surgical or referring team.
-- Flags are never suppressed by a clinician override of the urgency band.

CREATE TABLE hernia_diagnostic_evaluation_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    hernia_diagnostic_evaluation_grade_id UUID NOT NULL
        REFERENCES hernia_diagnostic_evaluation_grade(id) ON DELETE CASCADE,
    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (category IN (
            'strangulation-suspected',
            'incarceration-risk',
            'emergency-surgical-referral',
            'atypical-presentation',
            'occult-hernia-suspected',
            'recurrent-hernia',
            'paediatric',
            'pregnancy',
            'capacity-concern',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX hernia_diagnostic_evaluation_grade_flag_grade_id_index
    ON hernia_diagnostic_evaluation_grade_flag (hernia_diagnostic_evaluation_grade_id);

CREATE TRIGGER trigger_hernia_diagnostic_evaluation_grade_flag_updated_at
    BEFORE UPDATE ON hernia_diagnostic_evaluation_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE hernia_diagnostic_evaluation_grade_flag IS
    'Safety-critical flags that fire independently of the computed urgency band, with a priority and a suggested action for the surgical or referring team.';
COMMENT ON COLUMN hernia_diagnostic_evaluation_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN hernia_diagnostic_evaluation_grade_flag.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN hernia_diagnostic_evaluation_grade_flag.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN hernia_diagnostic_evaluation_grade_flag.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN hernia_diagnostic_evaluation_grade_flag.hernia_diagnostic_evaluation_grade_id IS
    'Foreign key to the parent hernia_diagnostic_evaluation_grade table.';
COMMENT ON COLUMN hernia_diagnostic_evaluation_grade_flag.flag_id IS
    'Stable flag identifier, such as F-STRANGULATION-SUSPECTED-001.';
COMMENT ON COLUMN hernia_diagnostic_evaluation_grade_flag.category IS
    'Flag category, such as strangulation-suspected or emergency-surgical-referral.';
COMMENT ON COLUMN hernia_diagnostic_evaluation_grade_flag.priority IS
    'Priority: low, medium, or high.';
COMMENT ON COLUMN hernia_diagnostic_evaluation_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN hernia_diagnostic_evaluation_grade_flag.suggested_action IS
    'Suggested clinical action, such as "refer for emergency surgical assessment today".';
