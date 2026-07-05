-- Computed grade for a neurodiversity reasonable-adjustments review (four-axis engine).

CREATE TABLE neurodiversity_adjustment_review_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    neurodiversity_adjustment_review_id UUID NOT NULL UNIQUE
        REFERENCES neurodiversity_adjustment_review(id) ON DELETE CASCADE,

    -- Axis A: overall effectiveness of the adjustments in place
    effectiveness_band VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (effectiveness_band IN ('effective', 'partially-effective', 'ineffective', 'not-yet-assessed', '')),

    -- Axis B: wellbeing risk
    wellbeing_risk_band VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (wellbeing_risk_band IN ('ok', 'caution', 'high-risk', '')),

    -- Axis C: review completeness
    completeness_percent INTEGER
        CHECK (completeness_percent IS NULL OR completeness_percent BETWEEN 0 AND 100),

    -- Axis D: next-step urgency
    next_step_urgency VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (next_step_urgency IN ('none', 'review-scheduled', 'adjust-now', 'escalate', '')),
    target_timeframe VARCHAR(50) NOT NULL DEFAULT '',

    recommendation VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (recommendation IN ('maintain', 'adjust-adjustments', 'seek-occupational-health', 'schedule-next-review', 'escalate-to-hr', '')),
    manager_notes TEXT NOT NULL DEFAULT '',
    signed_at TIMESTAMPTZ,
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_neurodiversity_adjustment_review_grade_updated_at
    BEFORE UPDATE ON neurodiversity_adjustment_review_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE neurodiversity_adjustment_review_grade IS
    'Computed four-axis grade for a neurodiversity reasonable-adjustments review: overall effectiveness, wellbeing risk, review completeness, and next-step urgency. Any adjustment reported as not-working, a dissatisfied worker, declining wellbeing, or an escalation drives the wellbeing-risk axis and the next-step urgency regardless of the other axes.';
COMMENT ON COLUMN neurodiversity_adjustment_review_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN neurodiversity_adjustment_review_grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN neurodiversity_adjustment_review_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN neurodiversity_adjustment_review_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN neurodiversity_adjustment_review_grade.neurodiversity_adjustment_review_id IS
    'Foreign key to the parent review (unique, 1:1).';
COMMENT ON COLUMN neurodiversity_adjustment_review_grade.effectiveness_band IS
    'Axis A overall effectiveness: effective, partially-effective, ineffective, not-yet-assessed.';
COMMENT ON COLUMN neurodiversity_adjustment_review_grade.wellbeing_risk_band IS
    'Axis B wellbeing risk band: ok, caution, high-risk.';
COMMENT ON COLUMN neurodiversity_adjustment_review_grade.completeness_percent IS
    'Axis C review completeness as a percentage of mandatory fields (0-100).';
COMMENT ON COLUMN neurodiversity_adjustment_review_grade.next_step_urgency IS
    'Axis D next-step urgency: none, review-scheduled, adjust-now, escalate.';
COMMENT ON COLUMN neurodiversity_adjustment_review_grade.target_timeframe IS
    'Target timeframe for the next step, implied by the next-step urgency.';
COMMENT ON COLUMN neurodiversity_adjustment_review_grade.recommendation IS
    'Overall recommendation: maintain, adjust-adjustments, seek-occupational-health, schedule-next-review, escalate-to-hr.';
COMMENT ON COLUMN neurodiversity_adjustment_review_grade.manager_notes IS
    'Free-text sign-off notes from the manager or HR contact.';
COMMENT ON COLUMN neurodiversity_adjustment_review_grade.signed_at IS
    'Timestamp of the manager / HR electronic signature.';
COMMENT ON COLUMN neurodiversity_adjustment_review_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
