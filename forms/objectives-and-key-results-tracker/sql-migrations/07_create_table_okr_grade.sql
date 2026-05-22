--liquibase formatted sql

--changeset author:1
CREATE TABLE okr_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    okr_objective_id UUID NOT NULL UNIQUE REFERENCES okr_objective(id) ON DELETE CASCADE,

    score_by_progress_percent NUMERIC(5,2)
        CHECK (score_by_progress_percent IS NULL OR score_by_progress_percent BETWEEN 0 AND 100),
    score_by_confidence_decile INTEGER
        CHECK (score_by_confidence_decile IS NULL OR score_by_confidence_decile BETWEEN 1 AND 10),
    score_by_stretch_tier INTEGER
        CHECK (score_by_stretch_tier IS NULL OR score_by_stretch_tier BETWEEN 1 AND 3),
    score_by_alignment_grade INTEGER
        CHECK (score_by_alignment_grade IS NULL OR score_by_alignment_grade BETWEEN 1 AND 5),
    score_by_impact_tier INTEGER
        CHECK (score_by_impact_tier IS NULL OR score_by_impact_tier BETWEEN 1 AND 5),
    score_by_smart_quality INTEGER
        CHECK (score_by_smart_quality IS NULL OR score_by_smart_quality BETWEEN 0 AND 5),
    score_by_pace_deviation_percent NUMERIC(5,2)
        CHECK (score_by_pace_deviation_percent IS NULL OR score_by_pace_deviation_percent BETWEEN -100 AND 100),

    computed_composite_rag TEXT NOT NULL DEFAULT ''
        CHECK (computed_composite_rag IN ('green','amber','red','')),
    final_composite_rag TEXT NOT NULL DEFAULT ''
        CHECK (final_composite_rag IN ('green','amber','red','')),
    override_reason TEXT NOT NULL DEFAULT '',

    recommendation TEXT NOT NULL DEFAULT ''
        CHECK (recommendation IN ('continue','escalate','re-scope','retire','split','merge','')),
    triage_notes TEXT NOT NULL DEFAULT '',

    signed_by TEXT NOT NULL DEFAULT '',
    signed_at TIMESTAMPTZ,
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_okr_grade_updated_at
    BEFORE UPDATE ON okr_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE okr_grade IS
    'Computed and signed-off grading result for an objective. 1:1 with okr_objective.';
COMMENT ON COLUMN okr_grade.id IS 'Primary key UUID, auto-generated.';
COMMENT ON COLUMN okr_grade.created_at IS 'Timestamp when this row was created.';
COMMENT ON COLUMN okr_grade.updated_at IS 'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN okr_grade.deleted_at IS 'Timestamp when the record was soft-deleted.';
COMMENT ON COLUMN okr_grade.okr_objective_id IS 'Foreign key to the parent okr_objective row (UNIQUE, 1:1).';
COMMENT ON COLUMN okr_grade.score_by_progress_percent IS 'Score 1 of 7: echoed from okr_objective for dashboard joins.';
COMMENT ON COLUMN okr_grade.score_by_confidence_decile IS 'Score 2 of 7: echoed from okr_objective.';
COMMENT ON COLUMN okr_grade.score_by_stretch_tier IS 'Score 3 of 7: echoed from okr_objective.';
COMMENT ON COLUMN okr_grade.score_by_alignment_grade IS 'Score 4 of 7: echoed from okr_objective.';
COMMENT ON COLUMN okr_grade.score_by_impact_tier IS 'Score 5 of 7: echoed from okr_objective.';
COMMENT ON COLUMN okr_grade.score_by_smart_quality IS 'Score 6 of 7: echoed from okr_objective.';
COMMENT ON COLUMN okr_grade.score_by_pace_deviation_percent IS 'Score 7 of 7: echoed from okr_objective.';
COMMENT ON COLUMN okr_grade.computed_composite_rag IS
    'Composite RAG computed by the engine using the worst-band-finding algorithm: green, amber, or red.';
COMMENT ON COLUMN okr_grade.final_composite_rag IS
    'Composite RAG signed off by the reviewer (may equal or differ from computed).';
COMMENT ON COLUMN okr_grade.override_reason IS
    'Reason the reviewer set final differently from computed (mandatory when they differ).';
COMMENT ON COLUMN okr_grade.recommendation IS
    'Overall recommendation: continue, escalate, re-scope, retire, split, merge.';
COMMENT ON COLUMN okr_grade.triage_notes IS 'Free-text reviewer summary notes.';
COMMENT ON COLUMN okr_grade.signed_by IS 'Name or identifier of the reviewer who signed off.';
COMMENT ON COLUMN okr_grade.signed_at IS 'Timestamp of the reviewer electronic signature.';
COMMENT ON COLUMN okr_grade.graded_at IS 'Timestamp when the engine last computed the result.';

--rollback DROP TABLE okr_grade;
