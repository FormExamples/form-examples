-- Safety-critical flags for a cardiology response, independent of the axes.

CREATE TABLE cardiology_response_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    cardiology_response_grade_id UUID NOT NULL
        REFERENCES cardiology_response_grade(id) ON DELETE CASCADE,
    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (category IN (
            'critical-finding',
            'severe-valve-disease',
            'significant-arrhythmia',
            'reduced-ejection-fraction',
            'incomplete-response',
            'missing-diagnosis',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_cardiology_response_grade_flag_grade_id
    ON cardiology_response_grade_flag(cardiology_response_grade_id);

CREATE TRIGGER trigger_cardiology_response_grade_flag_updated_at
    BEFORE UPDATE ON cardiology_response_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE cardiology_response_grade_flag IS
    'Safety-critical flags that fire independently of the four axes, with priority and a suggested action for the responsible team.';
COMMENT ON COLUMN cardiology_response_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN cardiology_response_grade_flag.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN cardiology_response_grade_flag.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN cardiology_response_grade_flag.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN cardiology_response_grade_flag.cardiology_response_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN cardiology_response_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-CRITICAL-FINDING-001).';
COMMENT ON COLUMN cardiology_response_grade_flag.category IS
    'Flag category.';
COMMENT ON COLUMN cardiology_response_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN cardiology_response_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN cardiology_response_grade_flag.suggested_action IS
    'Suggested clinical action (e.g. "communicate critical result to referrer and arrange urgent review").';
