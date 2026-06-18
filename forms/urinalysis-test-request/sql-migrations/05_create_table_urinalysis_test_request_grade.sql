-- Computed grading result for a urinalysis test request (four-axis engine).

CREATE TABLE urinalysis_test_request_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    urinalysis_test_request_id UUID NOT NULL UNIQUE
        REFERENCES urinalysis_test_request(id) ON DELETE CASCADE,

    -- Axis A: appropriateness (indication match / NICE UTI; 1-9 ordinal).
    -- Note: there is no single published 1-9 score for urinalysis. The 1-9 is
    -- anchored on indication-to-test match and guideline appropriateness
    -- (NICE NG109 UTI, NICE NG12 haematuria, UK SMI B41 urine investigation).
    appropriateness_score INTEGER
        CHECK (appropriateness_score IS NULL OR appropriateness_score BETWEEN 1 AND 9),
    appropriateness_band VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (appropriateness_band IN ('usually-appropriate', 'may-be-appropriate', 'usually-not-appropriate', '')),

    -- Axis B: preanalytical (specimen suitability) — specimen type / collected
    -- / timing / contamination risk.
    preanalytical_band VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (preanalytical_band IN ('ok', 'caution', 'reject-risk', '')),
    fasting_or_specimen VARCHAR(500) NOT NULL DEFAULT '',

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

CREATE TRIGGER trigger_urinalysis_test_request_grade_updated_at
    BEFORE UPDATE ON urinalysis_test_request_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE urinalysis_test_request_grade IS
    'Computed four-axis grading result: appropriateness (indication match / NICE UTI, 1-9), preanalytical specimen suitability, request completeness, and triage priority.';
COMMENT ON COLUMN urinalysis_test_request_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN urinalysis_test_request_grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN urinalysis_test_request_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN urinalysis_test_request_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN urinalysis_test_request_grade.urinalysis_test_request_id IS
    'Foreign key to the parent request (unique, 1:1).';
COMMENT ON COLUMN urinalysis_test_request_grade.appropriateness_score IS
    'Appropriateness score (1-9) anchored on indication-to-test match and guideline appropriateness (no single published urinalysis score exists).';
COMMENT ON COLUMN urinalysis_test_request_grade.appropriateness_band IS
    'Appropriateness band: usually-appropriate (7-9), may-be-appropriate (4-6), usually-not-appropriate (1-3).';
COMMENT ON COLUMN urinalysis_test_request_grade.preanalytical_band IS
    'Preanalytical specimen-suitability band: ok, caution, reject-risk (driven by specimen type / collected / timing / contamination risk per UK SMI B41).';
COMMENT ON COLUMN urinalysis_test_request_grade.fasting_or_specimen IS
    'Specimen / preanalytical advisory note (e.g. "MSU not yet collected; refrigerate or use boric acid if >4 h to lab").';
COMMENT ON COLUMN urinalysis_test_request_grade.completeness_percent IS
    'Request completeness as a percentage of mandatory fields, clinical details and indication weighted highest (0-100).';
COMMENT ON COLUMN urinalysis_test_request_grade.triage_tier IS
    'Assigned triage tier: routine, urgent, stat.';
COMMENT ON COLUMN urinalysis_test_request_grade.target_timeframe IS
    'Target timeframe for the test implied by the triage tier.';
COMMENT ON COLUMN urinalysis_test_request_grade.recommendation IS
    'Vetting recommendation: accept, query-referrer, redirect, reject.';
COMMENT ON COLUMN urinalysis_test_request_grade.clinician_notes IS
    'Free-text vetting notes.';
COMMENT ON COLUMN urinalysis_test_request_grade.signed_at IS
    'Timestamp of vetting clinician electronic signature.';
COMMENT ON COLUMN urinalysis_test_request_grade.graded_at IS
    'Timestamp when the engine last computed the result.';
