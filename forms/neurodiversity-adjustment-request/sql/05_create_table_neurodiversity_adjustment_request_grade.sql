-- Computed grade for a neurodiversity reasonable-adjustments request (four-axis engine).

CREATE TABLE neurodiversity_adjustment_request_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    neurodiversity_adjustment_request_id UUID NOT NULL UNIQUE
        REFERENCES neurodiversity_adjustment_request(id) ON DELETE CASCADE,

    -- Axis A: Equality Act 2010 eligibility (likelihood the duty to make reasonable adjustments applies)
    eligibility_band VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (eligibility_band IN ('likely-covered', 'possibly-covered', 'unclear', '')),

    -- Axis B: impact / wellbeing risk
    impact_band VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (impact_band IN ('ok', 'caution', 'high-risk', '')),

    -- Axis C: request completeness
    completeness_percent INTEGER
        CHECK (completeness_percent IS NULL OR completeness_percent BETWEEN 0 AND 100),

    -- Axis D: handling priority
    priority_tier VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority_tier IN ('routine', 'soon', 'urgent', '')),
    target_timeframe VARCHAR(50) NOT NULL DEFAULT '',

    recommendation VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (recommendation IN ('progress-to-meeting', 'seek-occupational-health', 'request-more-detail', 'signpost-access-to-work', '')),
    manager_notes TEXT NOT NULL DEFAULT '',
    signed_at TIMESTAMPTZ,
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_neurodiversity_adjustment_request_grade_updated_at
    BEFORE UPDATE ON neurodiversity_adjustment_request_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE neurodiversity_adjustment_request_grade IS
    'Computed four-axis grade for a neurodiversity reasonable-adjustments request: Equality Act 2010 eligibility, impact / wellbeing risk, request completeness, and handling priority. Being neurodivergent will often amount to a disability under the Equality Act 2010; a substantial and long-term adverse effect drives the eligibility axis, and a worker at risk of absence / burnout auto-escalates the impact and priority axes.';
COMMENT ON COLUMN neurodiversity_adjustment_request_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN neurodiversity_adjustment_request_grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN neurodiversity_adjustment_request_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN neurodiversity_adjustment_request_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN neurodiversity_adjustment_request_grade.neurodiversity_adjustment_request_id IS
    'Foreign key to the parent request (unique, 1:1).';
COMMENT ON COLUMN neurodiversity_adjustment_request_grade.eligibility_band IS
    'Axis A Equality Act 2010 eligibility: likely-covered, possibly-covered, unclear.';
COMMENT ON COLUMN neurodiversity_adjustment_request_grade.impact_band IS
    'Axis B impact / wellbeing risk band: ok, caution, high-risk.';
COMMENT ON COLUMN neurodiversity_adjustment_request_grade.completeness_percent IS
    'Axis C request completeness as a percentage of mandatory fields (0-100).';
COMMENT ON COLUMN neurodiversity_adjustment_request_grade.priority_tier IS
    'Axis D handling priority: routine, soon, urgent.';
COMMENT ON COLUMN neurodiversity_adjustment_request_grade.target_timeframe IS
    'Target timeframe for the employer to respond, implied by the priority tier (the Equality Act duty is to act without unreasonable delay).';
COMMENT ON COLUMN neurodiversity_adjustment_request_grade.recommendation IS
    'Overall handling recommendation: progress-to-meeting, seek-occupational-health, request-more-detail, signpost-access-to-work.';
COMMENT ON COLUMN neurodiversity_adjustment_request_grade.manager_notes IS
    'Free-text triage / sign-off notes from the manager or HR contact.';
COMMENT ON COLUMN neurodiversity_adjustment_request_grade.signed_at IS
    'Timestamp of the manager / HR electronic signature.';
COMMENT ON COLUMN neurodiversity_adjustment_request_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
