CREATE TABLE agile_principles_assessment_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    agile_principles_assessment_grade_id UUID NOT NULL
        REFERENCES agile_principles_assessment_grade(id) ON DELETE CASCADE,
    flag_id VARCHAR(40) NOT NULL,
    category VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (category IN (
            'customer-disconnect',
            'change-resistance',
            'slow-delivery',
            'silo-collaboration',
            'morale-risk',
            'communication-gap',
            'output-not-outcome',
            'burnout-risk',
            'technical-debt',
            'over-engineering',
            'command-and-control',
            'no-retrospective',
            'critical-principle-gap',
            'insufficient-data',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT 'medium'
        CHECK (priority IN ('low', 'medium', 'high')),
    principle_number SMALLINT
        CHECK (principle_number IS NULL OR principle_number BETWEEN 1 AND 12),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_agile_principles_assessment_grade_flag_grade_id
    ON agile_principles_assessment_grade_flag(agile_principles_assessment_grade_id);

CREATE TRIGGER trigger_agile_principles_assessment_grade_flag_updated_at
    BEFORE UPDATE ON agile_principles_assessment_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE agile_principles_assessment_grade_flag IS
    'Operational flags raised by the maturity engine independently of the composite maturity level.';
COMMENT ON COLUMN agile_principles_assessment_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN agile_principles_assessment_grade_flag.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN agile_principles_assessment_grade_flag.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN agile_principles_assessment_grade_flag.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN agile_principles_assessment_grade_flag.agile_principles_assessment_grade_id IS
    'Foreign key to the parent grade row.';
COMMENT ON COLUMN agile_principles_assessment_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-BURNOUT-RISK).';
COMMENT ON COLUMN agile_principles_assessment_grade_flag.category IS
    'Flag category: customer-disconnect, change-resistance, burnout-risk, technical-debt, etc.';
COMMENT ON COLUMN agile_principles_assessment_grade_flag.priority IS
    'Operational priority: low, medium, or high.';
COMMENT ON COLUMN agile_principles_assessment_grade_flag.principle_number IS
    'Ordinal 1-12 of the principle that triggered this flag, NULL when the flag is cross-cutting.';
COMMENT ON COLUMN agile_principles_assessment_grade_flag.description IS
    'Human-readable description of the operational concern.';
COMMENT ON COLUMN agile_principles_assessment_grade_flag.suggested_action IS
    'Suggested coaching action to address the flag.';
