-- Computed grading result for a pulmonary function test request (four-axis engine).

CREATE TABLE pulmonary_function_test_request_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    pulmonary_function_test_request_id UUID NOT NULL UNIQUE
        REFERENCES pulmonary_function_test_request(id) ON DELETE CASCADE,

    -- Axis A: appropriateness (NICE NG80 / NG115, ARTP indication match; 1-9 scale)
    appropriateness_score INTEGER
        CHECK (appropriateness_score IS NULL OR appropriateness_score BETWEEN 1 AND 9),
    appropriateness_band VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (appropriateness_band IN ('usually-appropriate', 'may-be-appropriate', 'usually-not-appropriate', '')),

    -- Axis B: safety / contraindication
    contraindication_band VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (contraindication_band IN ('ok', 'caution', 'contraindicated', '')),

    -- Axis C: request completeness
    completeness_percent INTEGER
        CHECK (completeness_percent IS NULL OR completeness_percent BETWEEN 0 AND 100),

    -- Axis D: triage priority
    triage_tier VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (triage_tier IN ('routine', 'urgent', '')),
    target_timeframe VARCHAR(50) NOT NULL DEFAULT '',

    recommendation VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (recommendation IN ('accept', 'query-referrer', 'redirect', 'reject', '')),
    clinician_notes TEXT NOT NULL DEFAULT '',
    signed_at TIMESTAMPTZ,
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_pulmonary_function_test_request_grade_updated_at
    BEFORE UPDATE ON pulmonary_function_test_request_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE pulmonary_function_test_request_grade IS
    'Computed four-axis grading result: appropriateness (NICE NG80 / NG115, ARTP indication match; 1-9), safety / contraindication, request completeness, and triage priority.';
COMMENT ON COLUMN pulmonary_function_test_request_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN pulmonary_function_test_request_grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN pulmonary_function_test_request_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN pulmonary_function_test_request_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN pulmonary_function_test_request_grade.pulmonary_function_test_request_id IS
    'Foreign key to the parent request (unique, 1:1).';
COMMENT ON COLUMN pulmonary_function_test_request_grade.appropriateness_score IS
    'Appropriateness score (1-9), grounded in NICE NG80 / NG115 and ARTP indication match.';
COMMENT ON COLUMN pulmonary_function_test_request_grade.appropriateness_band IS
    'Appropriateness band: usually-appropriate (7-9), may-be-appropriate (4-6), usually-not-appropriate (1-3).';
COMMENT ON COLUMN pulmonary_function_test_request_grade.contraindication_band IS
    'Safety band for forced-expiration and infection-control contraindications: ok, caution, contraindicated.';
COMMENT ON COLUMN pulmonary_function_test_request_grade.completeness_percent IS
    'Request completeness as a percentage of mandatory fields (0-100).';
COMMENT ON COLUMN pulmonary_function_test_request_grade.triage_tier IS
    'Assigned triage tier: routine, urgent.';
COMMENT ON COLUMN pulmonary_function_test_request_grade.target_timeframe IS
    'Target timeframe for the test implied by the triage tier.';
COMMENT ON COLUMN pulmonary_function_test_request_grade.recommendation IS
    'Vetting recommendation: accept, query-referrer, redirect, reject.';
COMMENT ON COLUMN pulmonary_function_test_request_grade.clinician_notes IS
    'Free-text vetting notes.';
COMMENT ON COLUMN pulmonary_function_test_request_grade.signed_at IS
    'Timestamp of vetting clinician electronic signature.';
COMMENT ON COLUMN pulmonary_function_test_request_grade.graded_at IS
    'Timestamp when the engine last computed the result.';
