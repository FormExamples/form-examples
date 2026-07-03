CREATE TABLE outpatient_outcome_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    grade_id UUID NOT NULL
        REFERENCES outpatient_outcome_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    priority VARCHAR(20) NOT NULL DEFAULT 'medium'
        CHECK (priority IN ('low', 'medium', 'high', 'critical'))
);

CREATE TRIGGER trigger_outpatient_outcome_grade_flag_updated_at
    BEFORE UPDATE ON outpatient_outcome_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE UNIQUE INDEX idx_grade_flag_unique
    ON outpatient_outcome_grade_flag (grade_id, flag_id);

COMMENT ON TABLE outpatient_outcome_grade_flag IS
    'Safety / data-quality flags raised alongside the OOCG grading result (DNA, PROM worsening, FFT Poor/Very Poor, wait-over-target, Worsened/Died, missing data).';
COMMENT ON COLUMN outpatient_outcome_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN outpatient_outcome_grade_flag.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN outpatient_outcome_grade_flag.updated_at IS
    'Timestamp when this row was updated most-recently.';
COMMENT ON COLUMN outpatient_outcome_grade_flag.deleted_at IS
    'Timestamp when this row was deleted i.e. soft-removed.';
COMMENT ON COLUMN outpatient_outcome_grade_flag.grade_id IS
    'Foreign key to the parent grading result.';
COMMENT ON COLUMN outpatient_outcome_grade_flag.flag_id IS
    'Stable identifier of the flag.';
COMMENT ON COLUMN outpatient_outcome_grade_flag.category IS
    'Category / domain of the flag.';
COMMENT ON COLUMN outpatient_outcome_grade_flag.description IS
    'Human-readable description of the flag.';
COMMENT ON COLUMN outpatient_outcome_grade_flag.priority IS
    'Priority: low, medium, high, critical.';
