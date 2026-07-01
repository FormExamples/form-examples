-- Computed TIMI grading result. Stores the summed total score (0-7),
-- the derived risk band (low / intermediate / high), the looked-up
-- 14-day composite-event risk percentage, and a free-text management
-- recommendation.

CREATE TABLE timi_risk_score_for_acute_coronary_syndrome_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    timi_risk_score_for_acute_coronary_syndrome_id UUID NOT NULL UNIQUE
        REFERENCES timi_risk_score_for_acute_coronary_syndrome(id) ON DELETE CASCADE,

    total_score INT,
    risk_band VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (risk_band IN ('low', 'intermediate', 'high', '')),
    fourteen_day_event_risk_percent NUMERIC(4,1),
    management TEXT NOT NULL DEFAULT '',

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_timi_risk_score_for_acute_coronary_syndrome_grade_updated_at
    BEFORE UPDATE ON timi_risk_score_for_acute_coronary_syndrome_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE timi_risk_score_for_acute_coronary_syndrome_grade IS
    'Computed TIMI grading result: summed total score (0-7), derived risk band (low/intermediate/high), looked-up 14-day composite-event risk percentage, and a management recommendation.';
COMMENT ON COLUMN timi_risk_score_for_acute_coronary_syndrome_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN timi_risk_score_for_acute_coronary_syndrome_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN timi_risk_score_for_acute_coronary_syndrome_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN timi_risk_score_for_acute_coronary_syndrome_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN timi_risk_score_for_acute_coronary_syndrome_grade.timi_risk_score_for_acute_coronary_syndrome_id IS
    'Foreign key to the parent assessment (unique, 1:1).';
COMMENT ON COLUMN timi_risk_score_for_acute_coronary_syndrome_grade.total_score IS
    'Summed TIMI score across the seven criteria (0-7 when complete).';
COMMENT ON COLUMN timi_risk_score_for_acute_coronary_syndrome_grade.risk_band IS
    'Derived risk band: low (0-1), intermediate (2-4), or high (5-7).';
COMMENT ON COLUMN timi_risk_score_for_acute_coronary_syndrome_grade.fourteen_day_event_risk_percent IS
    'Looked-up 14-day risk (%) of the composite end point: all-cause death, new/recurrent MI, or severe recurrent ischaemia requiring urgent revascularisation.';
COMMENT ON COLUMN timi_risk_score_for_acute_coronary_syndrome_grade.management IS
    'Free-text management recommendation associated with the risk band (e.g. early invasive strategy).';
COMMENT ON COLUMN timi_risk_score_for_acute_coronary_syndrome_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
