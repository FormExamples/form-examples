-- Additional safety flags raised during the Return to Work composite
-- grading. Flags fire independently of the fitness statement and the
-- restriction-priority grade and are surfaced to the
-- occupational-health reviewer.

CREATE TABLE return_to_work_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    return_to_work_grade_id UUID NOT NULL
        REFERENCES return_to_work_grade(id) ON DELETE CASCADE,

    flag_code VARCHAR(60) NOT NULL DEFAULT '',
    flag_title VARCHAR(255) NOT NULL DEFAULT '',
    flag_category VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (flag_category IN (
            'safety-critical-role',
            'dvla-notifiable',
            'riddor-reportable',
            'phased-return-incomplete',
            'risk-assessment-required',
            'long-term-absence',
            'mental-health-no-followup',
            'pregnancy-no-mat-b1',
            'clinician-low-confidence',
            'equality-act-adjustment',
            'other',
            '')),
    flag_priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (flag_priority IN ('low', 'medium', 'high', '')),
    flag_evidence TEXT NOT NULL DEFAULT '',
    flag_recommendation TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_return_to_work_grade_flag_updated_at
    BEFORE UPDATE ON return_to_work_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE return_to_work_grade_flag IS
    'Additional safety flags raised during Return to Work composite grading. Many-to-one child of return_to_work_grade.';
COMMENT ON COLUMN return_to_work_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN return_to_work_grade_flag.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN return_to_work_grade_flag.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN return_to_work_grade_flag.deleted_at IS
    'Timestamp when this row was deleted.';
COMMENT ON COLUMN return_to_work_grade_flag.return_to_work_grade_id IS
    'Foreign key to the parent return_to_work_grade record.';
COMMENT ON COLUMN return_to_work_grade_flag.flag_code IS
    'Stable flag identifier (e.g. RTW-FLAG-SAFETY-001).';
COMMENT ON COLUMN return_to_work_grade_flag.flag_title IS
    'Human-readable flag title for display.';
COMMENT ON COLUMN return_to_work_grade_flag.flag_category IS
    'Flag category: safety-critical-role, dvla-notifiable, riddor-reportable, phased-return-incomplete, risk-assessment-required, long-term-absence, mental-health-no-followup, pregnancy-no-mat-b1, clinician-low-confidence, equality-act-adjustment, or other.';
COMMENT ON COLUMN return_to_work_grade_flag.flag_priority IS
    'Flag priority: low, medium, or high.';
COMMENT ON COLUMN return_to_work_grade_flag.flag_evidence IS
    'Free-text evidence describing which input field(s) triggered the flag.';
COMMENT ON COLUMN return_to_work_grade_flag.flag_recommendation IS
    'Free-text recommended action for the occupational-health reviewer.';

CREATE INDEX return_to_work_grade_flag_grade_id_index
    ON return_to_work_grade_flag (return_to_work_grade_id);
