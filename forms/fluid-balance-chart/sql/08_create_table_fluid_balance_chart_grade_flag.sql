-- Flagged issues raised independently of the fluid-status classification, with a
-- priority and a suggested action for the clinical team.

CREATE TABLE fluid_balance_chart_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    fluid_balance_chart_grade_id UUID NOT NULL
        REFERENCES fluid_balance_chart_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (category IN (
            'fluid-overload',
            'dehydration',
            'oliguria',
            'anuria',
            'incomplete-recording',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX fluid_balance_chart_grade_flag_grade_id_idx
    ON fluid_balance_chart_grade_flag (fluid_balance_chart_grade_id);

CREATE TRIGGER trigger_fluid_balance_chart_grade_flag_updated_at
    BEFORE UPDATE ON fluid_balance_chart_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE fluid_balance_chart_grade_flag IS
    'Flagged issues raised independently of the fluid-status classification, with priority and a suggested action for the clinical team.';
COMMENT ON COLUMN fluid_balance_chart_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN fluid_balance_chart_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN fluid_balance_chart_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN fluid_balance_chart_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN fluid_balance_chart_grade_flag.fluid_balance_chart_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN fluid_balance_chart_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-FLUID-OVERLOAD-001).';
COMMENT ON COLUMN fluid_balance_chart_grade_flag.category IS
    'Flag category: fluid-overload, dehydration, oliguria, anuria, incomplete-recording, or other.';
COMMENT ON COLUMN fluid_balance_chart_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN fluid_balance_chart_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN fluid_balance_chart_grade_flag.suggested_action IS
    'Suggested clinical action (e.g. "review for pulmonary or peripheral oedema").';
