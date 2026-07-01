-- Red-flag issues that fire independently of the burden band, with
-- priority and a suggested action for the carer-support team.

CREATE TABLE zarit_burden_interview_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    zarit_burden_interview_grade_id UUID NOT NULL
        REFERENCES zarit_burden_interview_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (category IN (
            'severe-burden',
            'carer-support-respite',
            'carer-mental-health-screen',
            'incomplete',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX zarit_burden_interview_grade_flag_grade_id_idx
    ON zarit_burden_interview_grade_flag (zarit_burden_interview_grade_id);

CREATE TRIGGER trigger_zarit_burden_interview_grade_flag_updated_at
    BEFORE UPDATE ON zarit_burden_interview_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE zarit_burden_interview_grade_flag IS
    'Red-flag issues that fire independently of the burden band, with priority and a suggested action for the carer-support team.';
COMMENT ON COLUMN zarit_burden_interview_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN zarit_burden_interview_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN zarit_burden_interview_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN zarit_burden_interview_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN zarit_burden_interview_grade_flag.zarit_burden_interview_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN zarit_burden_interview_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-SEVERE-BURDEN-001).';
COMMENT ON COLUMN zarit_burden_interview_grade_flag.category IS
    'Flag category: severe-burden, carer-support-respite, carer-mental-health-screen, incomplete, or other.';
COMMENT ON COLUMN zarit_burden_interview_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN zarit_burden_interview_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN zarit_burden_interview_grade_flag.suggested_action IS
    'Suggested action (e.g. "arrange urgent carer support and respite").';
