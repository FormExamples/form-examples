-- Computed grading result for an echocardiogram request (four-axis engine).

CREATE TABLE echocardiogram_test_request_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    echocardiogram_test_request_id UUID NOT NULL UNIQUE
        REFERENCES echocardiogram_test_request(id) ON DELETE CASCADE,

    -- Axis A: appropriateness (ACC/AHA/ASE & BSE Appropriate Use Criteria 1-9 scale)
    appropriateness_score INTEGER
        CHECK (appropriateness_score IS NULL OR appropriateness_score BETWEEN 1 AND 9),
    appropriateness_band VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (appropriateness_band IN ('appropriate', 'may-be-appropriate', 'rarely-appropriate', '')),

    -- Axis B: urgency
    triage_tier VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (triage_tier IN ('routine', 'urgent', 'emergency', '')),
    target_timeframe VARCHAR(50) NOT NULL DEFAULT '',

    -- Axis C: request completeness
    completeness_percent INTEGER
        CHECK (completeness_percent IS NULL OR completeness_percent BETWEEN 0 AND 100),

    -- Axis D: clinical priority
    priority_band VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (priority_band IN ('low', 'moderate', 'high', '')),

    recommendation VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (recommendation IN ('accept', 'query-referrer', 'redirect', 'reject', '')),
    clinician_notes TEXT NOT NULL DEFAULT '',
    signed_at TIMESTAMPTZ,
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_echocardiogram_test_request_grade_updated_at
    BEFORE UPDATE ON echocardiogram_test_request_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE echocardiogram_test_request_grade IS
    'Computed four-axis grading result: appropriateness (ACC/AHA/ASE & BSE AUC 1-9), urgency triage, request completeness, and clinical priority.';
COMMENT ON COLUMN echocardiogram_test_request_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN echocardiogram_test_request_grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN echocardiogram_test_request_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN echocardiogram_test_request_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN echocardiogram_test_request_grade.echocardiogram_test_request_id IS
    'Foreign key to the parent request (unique, 1:1).';
COMMENT ON COLUMN echocardiogram_test_request_grade.appropriateness_score IS
    'ACC/AHA/ASE & BSE Appropriate Use Criteria score (1-9).';
COMMENT ON COLUMN echocardiogram_test_request_grade.appropriateness_band IS
    'Appropriateness band: appropriate (7-9), may-be-appropriate (4-6), rarely-appropriate (1-3).';
COMMENT ON COLUMN echocardiogram_test_request_grade.triage_tier IS
    'Assigned urgency triage tier: routine, urgent, emergency.';
COMMENT ON COLUMN echocardiogram_test_request_grade.target_timeframe IS
    'Target timeframe for the echocardiogram implied by the triage tier.';
COMMENT ON COLUMN echocardiogram_test_request_grade.completeness_percent IS
    'Request completeness as a percentage of mandatory fields (0-100); indication and clinical question weighted highest.';
COMMENT ON COLUMN echocardiogram_test_request_grade.priority_band IS
    'Clinical priority band: low, moderate, high, driven by NYHA class, natriuretic peptide, and suspected severe pathology.';
COMMENT ON COLUMN echocardiogram_test_request_grade.recommendation IS
    'Vetting recommendation: accept, query-referrer, redirect, reject.';
COMMENT ON COLUMN echocardiogram_test_request_grade.clinician_notes IS
    'Free-text vetting notes.';
COMMENT ON COLUMN echocardiogram_test_request_grade.signed_at IS
    'Timestamp of vetting clinician electronic signature.';
COMMENT ON COLUMN echocardiogram_test_request_grade.graded_at IS
    'Timestamp when the engine last computed the result.';
