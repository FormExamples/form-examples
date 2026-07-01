-- Computed vetting grade for a cardiology referral request (four-axis engine).

CREATE TABLE cardiology_request_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    cardiology_request_id UUID NOT NULL UNIQUE
        REFERENCES cardiology_request(id) ON DELETE CASCADE,

    -- Axis A: appropriateness of referral to cardiology
    appropriateness_band VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (appropriateness_band IN ('usually-appropriate', 'may-be-appropriate', 'usually-not-appropriate', '')),

    -- Axis B: safety / red-flag
    safety_band VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (safety_band IN ('ok', 'caution', 'red-flag', '')),

    -- Axis C: request completeness
    completeness_percent INTEGER
        CHECK (completeness_percent IS NULL OR completeness_percent BETWEEN 0 AND 100),

    -- Axis D: triage priority
    triage_tier VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (triage_tier IN ('routine', 'urgent', 'emergency', '')),
    target_timeframe VARCHAR(50) NOT NULL DEFAULT '',

    recommendation VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (recommendation IN ('accept', 'query-referrer', 'redirect', 'reject', '')),
    clinician_notes TEXT NOT NULL DEFAULT '',
    signed_at TIMESTAMPTZ,
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_cardiology_request_grade_updated_at
    BEFORE UPDATE ON cardiology_request_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE cardiology_request_grade IS
    'Computed four-axis vetting grade: referral appropriateness, safety / red-flag, request completeness, and triage priority. A red flag (suspected acute coronary syndrome, exertional syncope, new-onset heart failure) drives the safety axis and auto-escalates the triage tier regardless of the other axes.';
COMMENT ON COLUMN cardiology_request_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN cardiology_request_grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN cardiology_request_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN cardiology_request_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN cardiology_request_grade.cardiology_request_id IS
    'Foreign key to the parent request (unique, 1:1).';
COMMENT ON COLUMN cardiology_request_grade.appropriateness_band IS
    'Axis A appropriateness of referral to cardiology: usually-appropriate, may-be-appropriate, usually-not-appropriate.';
COMMENT ON COLUMN cardiology_request_grade.safety_band IS
    'Axis B safety / red-flag band: ok, caution, red-flag.';
COMMENT ON COLUMN cardiology_request_grade.completeness_percent IS
    'Axis C request completeness as a percentage of mandatory fields (0-100).';
COMMENT ON COLUMN cardiology_request_grade.triage_tier IS
    'Axis D triage priority: routine, urgent, emergency.';
COMMENT ON COLUMN cardiology_request_grade.target_timeframe IS
    'Target timeframe for the patient to be seen, implied by the triage tier.';
COMMENT ON COLUMN cardiology_request_grade.recommendation IS
    'Overall vetting recommendation: accept, query-referrer, redirect, reject.';
COMMENT ON COLUMN cardiology_request_grade.clinician_notes IS
    'Free-text vetting / sign-off notes from the cardiology triage clinician.';
COMMENT ON COLUMN cardiology_request_grade.signed_at IS
    'Timestamp of the triage clinician electronic signature.';
COMMENT ON COLUMN cardiology_request_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
