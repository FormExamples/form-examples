-- Computed grading result for a coagulation test request (four-axis engine).

CREATE TABLE coagulation_test_request_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    coagulation_test_request_id UUID NOT NULL UNIQUE
        REFERENCES coagulation_test_request(id) ON DELETE CASCADE,

    -- Axis A: appropriateness (1-9 anchored on indication appropriateness;
    -- there is no single published 1-9 coagulation-ordering score, so the scale
    -- is anchored on BSH indication / retest-interval match.)
    appropriateness_score INTEGER
        CHECK (appropriateness_score IS NULL OR appropriateness_score BETWEEN 1 AND 9),
    appropriateness_band VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (appropriateness_band IN ('usually-appropriate', 'may-be-appropriate', 'usually-not-appropriate', '')),

    -- Axis B: pre-analytical / specimen safety (citrate tube fill / ratio / timing)
    preanalytical_band VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (preanalytical_band IN ('ok', 'caution', 'reject-risk', '')),

    -- Axis C: request completeness
    completeness_percent INTEGER
        CHECK (completeness_percent IS NULL OR completeness_percent BETWEEN 0 AND 100),

    -- Axis D: triage priority
    triage_tier VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (triage_tier IN ('routine', 'urgent', 'stat', '')),
    target_timeframe VARCHAR(50) NOT NULL DEFAULT '',

    recommendation VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (recommendation IN ('accept', 'query-referrer', 'redirect', 'reject', '')),
    clinician_notes TEXT NOT NULL DEFAULT '',
    signed_at TIMESTAMPTZ,
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_coagulation_test_request_grade_updated_at
    BEFORE UPDATE ON coagulation_test_request_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE coagulation_test_request_grade IS
    'Computed four-axis grading result: appropriateness (1-9 anchored on BSH indication / retest-interval match), pre-analytical / specimen safety (citrate tube fill / ratio / timing), request completeness, and triage priority.';
COMMENT ON COLUMN coagulation_test_request_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN coagulation_test_request_grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN coagulation_test_request_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN coagulation_test_request_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN coagulation_test_request_grade.coagulation_test_request_id IS
    'Foreign key to the parent request (unique, 1:1).';
COMMENT ON COLUMN coagulation_test_request_grade.appropriateness_score IS
    'Appropriateness score (1-9), anchored on BSH indication and retest-interval match; there is no single published 1-9 coagulation-ordering score.';
COMMENT ON COLUMN coagulation_test_request_grade.appropriateness_band IS
    'Appropriateness band: usually-appropriate (7-9), may-be-appropriate (4-6), usually-not-appropriate (1-3).';
COMMENT ON COLUMN coagulation_test_request_grade.preanalytical_band IS
    'Pre-analytical / specimen safety band: ok, caution, reject-risk (citrate tube fill / ratio correct? specimen collected? analysed in time?).';
COMMENT ON COLUMN coagulation_test_request_grade.completeness_percent IS
    'Request completeness as a percentage of mandatory fields (0-100).';
COMMENT ON COLUMN coagulation_test_request_grade.triage_tier IS
    'Assigned triage tier: routine, urgent, stat.';
COMMENT ON COLUMN coagulation_test_request_grade.target_timeframe IS
    'Target timeframe for the tests implied by the triage tier (e.g. active bleeding / DIC -> stat).';
COMMENT ON COLUMN coagulation_test_request_grade.recommendation IS
    'Vetting recommendation: accept, query-referrer, redirect, reject.';
COMMENT ON COLUMN coagulation_test_request_grade.clinician_notes IS
    'Free-text vetting notes.';
COMMENT ON COLUMN coagulation_test_request_grade.signed_at IS
    'Timestamp of vetting clinician electronic signature.';
COMMENT ON COLUMN coagulation_test_request_grade.graded_at IS
    'Timestamp when the engine last computed the result.';
