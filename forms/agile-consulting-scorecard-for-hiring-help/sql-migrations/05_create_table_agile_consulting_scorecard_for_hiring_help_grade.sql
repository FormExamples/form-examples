-- Computed and signed-off grading result for an agile-consulting scorecard.
-- Stores the engine-computed total and band, the manifesto and principles
-- subtotals, and the respondent-final band with an optional override reason.

CREATE TABLE agile_consulting_scorecard_for_hiring_help_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    agile_consulting_scorecard_id UUID NOT NULL UNIQUE
        REFERENCES agile_consulting_scorecard_for_hiring_help(id) ON DELETE CASCADE,

    score_total INTEGER
        CHECK (score_total IS NULL OR score_total BETWEEN 0 AND 16),
    manifesto_subtotal INTEGER
        CHECK (manifesto_subtotal IS NULL OR manifesto_subtotal BETWEEN 0 AND 4),
    principles_subtotal INTEGER
        CHECK (principles_subtotal IS NULL OR principles_subtotal BETWEEN 0 AND 12),

    computed_band VARCHAR(12) NOT NULL DEFAULT ''
        CHECK (computed_band IN ('low', 'borderline', 'medium', 'high', '')),
    final_band VARCHAR(12) NOT NULL DEFAULT ''
        CHECK (final_band IN ('low', 'borderline', 'medium', 'high', '')),
    override_reason VARCHAR(500) NOT NULL DEFAULT '',

    recommendation VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (recommendation IN (
            'do-not-hire-yet', 'do-homework-first', 'trial-engagement',
            'hire-with-focus-areas', 'reassess-in-3-months', ''
        )),
    recommended_focus_areas TEXT NOT NULL DEFAULT '',
    review_notes TEXT NOT NULL DEFAULT '',

    signed_by VARCHAR(255) NOT NULL DEFAULT '',
    signed_at TIMESTAMPTZ,
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_agile_consulting_scorecard_for_hiring_help_grade_upd
    BEFORE UPDATE ON agile_consulting_scorecard_for_hiring_help_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE agile_consulting_scorecard_for_hiring_help_grade IS
    'Computed and signed-off grading result for an agile-consulting scorecard. One-to-one with agile_consulting_scorecard_for_hiring_help. Stores total score (0-16), manifesto subtotal (0-4), principles subtotal (0-12), the engine-computed and respondent-final readiness bands (low/borderline/medium/high), and a recommendation.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade.agile_consulting_scorecard_id IS
    'Foreign key to the parent agile_consulting_scorecard_for_hiring_help row (unique, 1:1).';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade.score_total IS
    'Total points across all 16 items, 0 to 16. One point per "yes" answer.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade.manifesto_subtotal IS
    'Subtotal across the four Manifesto items (m1..m4), 0 to 4.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade.principles_subtotal IS
    'Subtotal across the twelve Principles items (p1..p12), 0 to 12.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade.computed_band IS
    'Readiness band computed by the engine: low (0-4), borderline (5), medium (6-10), high (11-16).';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade.final_band IS
    'Readiness band signed off by the respondent or sponsor (may equal or differ from computed).';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade.override_reason IS
    'Reason the final band differs from the computed band (mandatory when they differ).';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade.recommendation IS
    'Procurement recommendation: do-not-hire-yet, do-homework-first, trial-engagement, hire-with-focus-areas, reassess-in-3-months.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade.recommended_focus_areas IS
    'Free-text list of focus areas the consultant should prioritize, derived from any flags that fired.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade.review_notes IS
    'Free-text reviewer summary notes.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade.signed_by IS
    'Name or identifier of the person who signed off the grade.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade.signed_at IS
    'Timestamp of the electronic signature.';
COMMENT ON COLUMN agile_consulting_scorecard_for_hiring_help_grade.graded_at IS
    'Timestamp when the engine last computed the result.';
