-- Computed interpretation grade for a cardiology response (four-axis engine).

CREATE TABLE cardiology_response_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    cardiology_response_id UUID NOT NULL UNIQUE
        REFERENCES cardiology_response(id) ON DELETE CASCADE,

    -- Axis A: response classification
    response_classification VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (response_classification IN ('no-abnormality', 'cardiac-condition', 'critical', 'inconclusive', '')),

    -- Axis B: severity and structured findings
    severity VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (severity IN ('none', 'minor', 'moderate', 'major', '')),
    severity_category VARCHAR(50) NOT NULL DEFAULT '',

    -- Axis C: response completeness
    completeness_percent INTEGER
        CHECK (completeness_percent IS NULL OR completeness_percent BETWEEN 0 AND 100),

    -- Axis D: follow-up urgency
    follow_up_urgency VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (follow_up_urgency IN ('routine', 'recommended', 'urgent', 'critical-alert', '')),
    target_timeframe VARCHAR(50) NOT NULL DEFAULT '',
    recommended_action VARCHAR(500) NOT NULL DEFAULT '',

    recommendation VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (recommendation IN ('no-action', 'routine-follow-up', 'further-investigation', 'specialist-management', 'urgent-review', '')),
    clinician_notes TEXT NOT NULL DEFAULT '',
    signed_at TIMESTAMPTZ,
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_cardiology_response_grade_updated_at
    BEFORE UPDATE ON cardiology_response_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE cardiology_response_grade IS
    'Computed four-axis interpretation grade: response classification, condition severity / category, response completeness, and follow-up urgency. A critical result auto-escalates the follow-up urgency to critical-alert regardless of the other axes.';
COMMENT ON COLUMN cardiology_response_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN cardiology_response_grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN cardiology_response_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN cardiology_response_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN cardiology_response_grade.cardiology_response_id IS
    'Foreign key to the parent response (unique, 1:1).';
COMMENT ON COLUMN cardiology_response_grade.response_classification IS
    'Axis A overall classification: no-abnormality, cardiac-condition, critical, inconclusive.';
COMMENT ON COLUMN cardiology_response_grade.severity IS
    'Axis B condition severity: none, minor, moderate, major.';
COMMENT ON COLUMN cardiology_response_grade.severity_category IS
    'Axis B structured-finding category label (e.g. the dominant finding driving severity).';
COMMENT ON COLUMN cardiology_response_grade.completeness_percent IS
    'Axis C response completeness as a percentage of mandatory sections (0-100).';
COMMENT ON COLUMN cardiology_response_grade.follow_up_urgency IS
    'Axis D follow-up urgency: routine, recommended, urgent, critical-alert.';
COMMENT ON COLUMN cardiology_response_grade.target_timeframe IS
    'Target timeframe for the recommended follow-up implied by the urgency.';
COMMENT ON COLUMN cardiology_response_grade.recommended_action IS
    'Axis D concise recommended action derived from the urgency.';
COMMENT ON COLUMN cardiology_response_grade.recommendation IS
    'Overall recommendation: no-action, routine-follow-up, further-investigation, specialist-management, urgent-review.';
COMMENT ON COLUMN cardiology_response_grade.clinician_notes IS
    'Free-text interpretation / sign-off notes.';
COMMENT ON COLUMN cardiology_response_grade.signed_at IS
    'Timestamp of the responding clinician electronic signature.';
COMMENT ON COLUMN cardiology_response_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
