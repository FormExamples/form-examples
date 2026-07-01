-- Red-flag issues that fire independently of the risk tier, each with a
-- priority and a suggested action for the clinical or crisis team.

CREATE TABLE columbia_suicide_severity_rating_scale_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    columbia_suicide_severity_rating_scale_grade_id UUID NOT NULL
        REFERENCES columbia_suicide_severity_rating_scale_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (category IN (
            'high-risk-crisis-response',
            'active-plan-and-intent',
            'recent-attempt',
            'high-lethality-attempt',
            'access-to-means',
            'preparatory-acts',
            'non-suicidal-self-injury',
            'safety-plan-needed',
            'incomplete',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX columbia_suicide_severity_rating_scale_grade_flag_grade_id_idx
    ON columbia_suicide_severity_rating_scale_grade_flag (columbia_suicide_severity_rating_scale_grade_id);

CREATE TRIGGER trigger_columbia_suicide_severity_rating_scale_grade_flag_updated_at
    BEFORE UPDATE ON columbia_suicide_severity_rating_scale_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE columbia_suicide_severity_rating_scale_grade_flag IS
    'Red-flag issues that fire independently of the risk tier, with priority and a suggested action for the clinical or crisis team.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale_grade_flag.columbia_suicide_severity_rating_scale_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-HIGH-RISK-CRISIS-RESPONSE-001).';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale_grade_flag.category IS
    'Flag category (see CHECK constraint for enumeration).';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale_grade_flag.suggested_action IS
    'Suggested clinical or crisis-response action (e.g. "arrange emergency mental-health evaluation; do not leave the person alone").';
