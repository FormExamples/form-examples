-- Computed and signed-off grading result for an issue. Stores both the
-- engine-computed composite priority and the triager-final composite
-- with an override reason, plus the seven dimension scores echoed from
-- issue_tracker for convenient dashboard rendering.

CREATE TABLE issue_tracker_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    issue_tracker_id UUID NOT NULL UNIQUE
        REFERENCES issue_tracker(id) ON DELETE CASCADE,

    score_by_priority_rank INTEGER
        CHECK (score_by_priority_rank IS NULL OR score_by_priority_rank BETWEEN 1 AND 999),
    score_by_severity_of_impact INTEGER
        CHECK (score_by_severity_of_impact IS NULL OR score_by_severity_of_impact BETWEEN 1 AND 5),
    score_by_magnitude_of_damage INTEGER
        CHECK (score_by_magnitude_of_damage IS NULL OR score_by_magnitude_of_damage BETWEEN 1 AND 10),
    score_by_harm_grade INTEGER
        CHECK (score_by_harm_grade IS NULL OR score_by_harm_grade BETWEEN 0 AND 4),
    score_by_failure_condition VARCHAR(1) NOT NULL DEFAULT ''
        CHECK (score_by_failure_condition IN ('A', 'B', 'C', 'D', 'E', '')),
    score_by_moscow_requirement INTEGER
        CHECK (score_by_moscow_requirement IS NULL OR score_by_moscow_requirement BETWEEN 1 AND 4),
    score_by_frequency_percent NUMERIC(5,2)
        CHECK (score_by_frequency_percent IS NULL OR score_by_frequency_percent BETWEEN 0 AND 100),

    computed_composite_priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (computed_composite_priority IN ('low', 'moderate', 'high', 'critical', '')),
    final_composite_priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (final_composite_priority IN ('low', 'moderate', 'high', 'critical', '')),
    override_reason VARCHAR(500) NOT NULL DEFAULT '',

    recommendation VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (recommendation IN ('proceed', 'mitigate-first', 'escalate', 'wontfix', 'duplicate', 'cancel', '')),
    triage_notes TEXT NOT NULL DEFAULT '',

    signed_by VARCHAR(255) NOT NULL DEFAULT '',
    signed_at TIMESTAMPTZ,
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_issue_tracker_grade_updated_at
    BEFORE UPDATE ON issue_tracker_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE issue_tracker_grade IS
    'Computed and signed-off grading result for an issue. One-to-one with issue_tracker. Stores both engine-computed and triager-final composite priority, the seven dimension scores, and a triage recommendation.';
COMMENT ON COLUMN issue_tracker_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN issue_tracker_grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN issue_tracker_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN issue_tracker_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN issue_tracker_grade.issue_tracker_id IS
    'Foreign key to the parent issue_tracker row (unique, 1:1).';
COMMENT ON COLUMN issue_tracker_grade.score_by_priority_rank IS
    'Score 1 of 7: priority rank — echoed from issue_tracker for dashboard joins.';
COMMENT ON COLUMN issue_tracker_grade.score_by_severity_of_impact IS
    'Score 2 of 7: severity of impact 1-5 — echoed from issue_tracker.';
COMMENT ON COLUMN issue_tracker_grade.score_by_magnitude_of_damage IS
    'Score 3 of 7: magnitude of damage 1-10 — echoed from issue_tracker.';
COMMENT ON COLUMN issue_tracker_grade.score_by_harm_grade IS
    'Score 4 of 7: NHS LFPSE harm grade 0-4 — echoed from issue_tracker.';
COMMENT ON COLUMN issue_tracker_grade.score_by_failure_condition IS
    'Score 5 of 7: FAA / EASA failure condition A-E — echoed from issue_tracker.';
COMMENT ON COLUMN issue_tracker_grade.score_by_moscow_requirement IS
    'Score 6 of 7: MoSCoW prioritisation 1-4 — echoed from issue_tracker.';
COMMENT ON COLUMN issue_tracker_grade.score_by_frequency_percent IS
    'Score 7 of 7: frequency percent 0-100 — echoed from issue_tracker.';
COMMENT ON COLUMN issue_tracker_grade.computed_composite_priority IS
    'Composite priority computed by the engine using the max-grade algorithm: low, moderate, high, or critical.';
COMMENT ON COLUMN issue_tracker_grade.final_composite_priority IS
    'Composite priority signed off by the triager (may equal or differ from computed).';
COMMENT ON COLUMN issue_tracker_grade.override_reason IS
    'Reason the triager set final differently from computed (mandatory when they differ).';
COMMENT ON COLUMN issue_tracker_grade.recommendation IS
    'Overall recommendation: proceed, mitigate-first, escalate, wontfix, duplicate, or cancel.';
COMMENT ON COLUMN issue_tracker_grade.triage_notes IS
    'Free-text triager summary notes.';
COMMENT ON COLUMN issue_tracker_grade.signed_by IS
    'Name or identifier of the triager who signed off.';
COMMENT ON COLUMN issue_tracker_grade.signed_at IS
    'Timestamp of the triager electronic signature.';
COMMENT ON COLUMN issue_tracker_grade.graded_at IS
    'Timestamp when the engine last computed the result.';
