CREATE TABLE framingham_risk_score_for_hard_coronary_heart_disease.grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES framingham_risk_score_for_hard_coronary_heart_disease.assessment(id) ON DELETE CASCADE,
    ten_year_risk_percent NUMERIC(5,1) NOT NULL DEFAULT 0
        CHECK (ten_year_risk_percent >= 0 AND ten_year_risk_percent <= 100),
    risk_category VARCHAR(15) NOT NULL DEFAULT 'low'
        CHECK (risk_category IN ('low', 'intermediate', 'high')),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON framingham_risk_score_for_hard_coronary_heart_disease.grade
    FOR EACH ROW
    EXECUTE FUNCTION framingham_risk_score_for_hard_coronary_heart_disease.set_updated_at();

COMMENT ON TABLE framingham_risk_score_for_hard_coronary_heart_disease.grade IS
    'Computed Framingham Risk Score grading result. One-to-one child of assessment.';
COMMENT ON COLUMN framingham_risk_score_for_hard_coronary_heart_disease.grade.assessment_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN framingham_risk_score_for_hard_coronary_heart_disease.grade.ten_year_risk_percent IS
    'Estimated 10-year risk of hard coronary heart disease as a percentage.';
COMMENT ON COLUMN framingham_risk_score_for_hard_coronary_heart_disease.grade.risk_category IS
    'Risk category: low (<10%), intermediate (10-19.9%), high (>=20%).';
COMMENT ON COLUMN framingham_risk_score_for_hard_coronary_heart_disease.grade.graded_at IS
    'Timestamp when the risk calculation was computed.';

COMMENT ON COLUMN framingham_risk_score_for_hard_coronary_heart_disease.grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN framingham_risk_score_for_hard_coronary_heart_disease.grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN framingham_risk_score_for_hard_coronary_heart_disease.grade.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN framingham_risk_score_for_hard_coronary_heart_disease.grade.deleted_at IS
    'Timestamp when this row was deleted.';
