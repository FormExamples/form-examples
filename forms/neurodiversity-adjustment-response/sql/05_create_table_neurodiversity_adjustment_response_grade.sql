-- Computed grade for a neurodiversity reasonable-adjustments response (four-axis engine).

CREATE TABLE neurodiversity_adjustment_response_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    neurodiversity_adjustment_response_id UUID NOT NULL UNIQUE
        REFERENCES neurodiversity_adjustment_response(id) ON DELETE CASCADE,

    -- Axis A: outcome classification
    outcome_classification VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (outcome_classification IN ('fully-agreed', 'partially-agreed', 'alternative-offered', 'declined', 'deferred', '')),

    -- Axis B: legal / discrimination risk (reasonableness)
    legal_risk_band VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (legal_risk_band IN ('ok', 'caution', 'high-risk', '')),

    -- Axis C: response completeness
    completeness_percent INTEGER
        CHECK (completeness_percent IS NULL OR completeness_percent BETWEEN 0 AND 100),

    -- Axis D: follow-up / review urgency
    follow_up_urgency VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (follow_up_urgency IN ('none', 'review-scheduled', 'urgent-review', 'escalation-needed', '')),
    target_timeframe VARCHAR(50) NOT NULL DEFAULT '',

    recommendation VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (recommendation IN ('implement', 'schedule-review', 'seek-occupational-health', 'reconsider-decision', 'escalate-to-hr', '')),
    manager_notes TEXT NOT NULL DEFAULT '',
    signed_at TIMESTAMPTZ,
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_neurodiversity_adjustment_response_grade_updated_at
    BEFORE UPDATE ON neurodiversity_adjustment_response_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE neurodiversity_adjustment_response_grade IS
    'Computed four-axis grade for a neurodiversity reasonable-adjustments response: outcome classification, legal / discrimination risk (reasonableness), response completeness, and follow-up / review urgency. Declining adjustments for a worker likely covered by the Equality Act 2010 without an adequate reasonableness justification or alternatives drives the legal-risk axis to high-risk and raises the discrimination-risk flag regardless of the other axes.';
COMMENT ON COLUMN neurodiversity_adjustment_response_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN neurodiversity_adjustment_response_grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN neurodiversity_adjustment_response_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN neurodiversity_adjustment_response_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN neurodiversity_adjustment_response_grade.neurodiversity_adjustment_response_id IS
    'Foreign key to the parent response (unique, 1:1).';
COMMENT ON COLUMN neurodiversity_adjustment_response_grade.outcome_classification IS
    'Axis A outcome classification: fully-agreed, partially-agreed, alternative-offered, declined, deferred.';
COMMENT ON COLUMN neurodiversity_adjustment_response_grade.legal_risk_band IS
    'Axis B legal / discrimination risk band (reasonableness): ok, caution, high-risk.';
COMMENT ON COLUMN neurodiversity_adjustment_response_grade.completeness_percent IS
    'Axis C response completeness as a percentage of mandatory sections (0-100).';
COMMENT ON COLUMN neurodiversity_adjustment_response_grade.follow_up_urgency IS
    'Axis D follow-up / review urgency: none, review-scheduled, urgent-review, escalation-needed.';
COMMENT ON COLUMN neurodiversity_adjustment_response_grade.target_timeframe IS
    'Target timeframe for the next review or action, implied by the follow-up urgency.';
COMMENT ON COLUMN neurodiversity_adjustment_response_grade.recommendation IS
    'Overall recommendation: implement, schedule-review, seek-occupational-health, reconsider-decision, escalate-to-hr.';
COMMENT ON COLUMN neurodiversity_adjustment_response_grade.manager_notes IS
    'Free-text sign-off notes from the manager or HR contact.';
COMMENT ON COLUMN neurodiversity_adjustment_response_grade.signed_at IS
    'Timestamp of the manager / HR electronic signature.';
COMMENT ON COLUMN neurodiversity_adjustment_response_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
