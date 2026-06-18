-- Computed grading result for a biopsy request (four-axis engine).

CREATE TABLE biopsy_test_request_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    biopsy_test_request_id UUID NOT NULL UNIQUE
        REFERENCES biopsy_test_request(id) ON DELETE CASCADE,

    -- Axis A: appropriateness (ACR Appropriateness Criteria 1-9 scale)
    appropriateness_score INTEGER
        CHECK (appropriateness_score IS NULL OR appropriateness_score BETWEEN 1 AND 9),
    appropriateness_band VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (appropriateness_band IN ('usually-appropriate', 'may-be-appropriate', 'usually-not-appropriate', '')),

    -- Axis B: bleeding risk
    bleeding_risk_band VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (bleeding_risk_band IN ('low', 'moderate', 'high', '')),
    anticoagulant_action VARCHAR(500) NOT NULL DEFAULT '',

    -- Axis C: request completeness
    completeness_percent INTEGER
        CHECK (completeness_percent IS NULL OR completeness_percent BETWEEN 0 AND 100),

    -- Axis D: urgency / cancer pathway
    triage_tier VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (triage_tier IN ('routine', 'urgent', 'two-week-wait', 'emergency', '')),
    target_timeframe VARCHAR(50) NOT NULL DEFAULT '',
    two_week_wait_eligible BOOLEAN NOT NULL DEFAULT FALSE,

    recommendation VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (recommendation IN ('accept', 'query-referrer', 'redirect', 'reject', '')),
    clinician_notes TEXT NOT NULL DEFAULT '',
    signed_at TIMESTAMPTZ,
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_biopsy_test_request_grade_updated_at
    BEFORE UPDATE ON biopsy_test_request_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE biopsy_test_request_grade IS
    'Computed four-axis grading result: appropriateness (ACR 1-9), periprocedural bleeding risk, request completeness, and urgency / cancer-pathway triage.';
COMMENT ON COLUMN biopsy_test_request_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN biopsy_test_request_grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN biopsy_test_request_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN biopsy_test_request_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN biopsy_test_request_grade.biopsy_test_request_id IS
    'Foreign key to the parent request (unique, 1:1).';
COMMENT ON COLUMN biopsy_test_request_grade.appropriateness_score IS
    'ACR Appropriateness Criteria score (1-9).';
COMMENT ON COLUMN biopsy_test_request_grade.appropriateness_band IS
    'Appropriateness band: usually-appropriate (7-9), may-be-appropriate (4-6), usually-not-appropriate (1-3).';
COMMENT ON COLUMN biopsy_test_request_grade.bleeding_risk_band IS
    'Periprocedural bleeding-risk band: low, moderate, high, driven by anticoagulant / antiplatelet use, INR, platelet count, and bleeding disorder.';
COMMENT ON COLUMN biopsy_test_request_grade.anticoagulant_action IS
    'Recommended periprocedural anticoagulant / antiplatelet action (e.g. withhold, bridge, proceed).';
COMMENT ON COLUMN biopsy_test_request_grade.completeness_percent IS
    'Request completeness as a percentage of mandatory fields (0-100).';
COMMENT ON COLUMN biopsy_test_request_grade.triage_tier IS
    'Assigned triage tier: routine, urgent, two-week-wait, emergency.';
COMMENT ON COLUMN biopsy_test_request_grade.target_timeframe IS
    'Target timeframe for the biopsy implied by the triage tier.';
COMMENT ON COLUMN biopsy_test_request_grade.two_week_wait_eligible IS
    'Whether the request meets NICE NG12 suspected-cancer two-week-wait eligibility.';
COMMENT ON COLUMN biopsy_test_request_grade.recommendation IS
    'Vetting recommendation: accept, query-referrer, redirect, reject.';
COMMENT ON COLUMN biopsy_test_request_grade.clinician_notes IS
    'Free-text vetting notes.';
COMMENT ON COLUMN biopsy_test_request_grade.signed_at IS
    'Timestamp of vetting clinician electronic signature.';
COMMENT ON COLUMN biopsy_test_request_grade.graded_at IS
    'Timestamp when the engine last computed the result.';
