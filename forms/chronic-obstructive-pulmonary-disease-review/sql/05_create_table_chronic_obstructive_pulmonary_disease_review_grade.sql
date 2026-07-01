-- Computed GOLD airflow-grade, ABE-group and completeness grading result for a
-- COPD annual review. The engine bands the GOLD airflow-limitation grade from
-- FEV1 % predicted, derives the symptom and exacerbation axes, combines them
-- into the ABE assessment group, and grades review completeness. A grade
-- reflects the recorded classification and the completeness of the review, not
-- a diagnostic judgement.

CREATE TABLE chronic_obstructive_pulmonary_disease_review_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    chronic_obstructive_pulmonary_disease_review_id UUID NOT NULL UNIQUE
        REFERENCES chronic_obstructive_pulmonary_disease_review(id) ON DELETE CASCADE,

    gold_airflow_grade VARCHAR(1) NOT NULL DEFAULT ''
        CHECK (gold_airflow_grade IN ('1', '2', '3', '4', '')),
    symptom_burden VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (symptom_burden IN ('low', 'high', '')),
    exacerbation_risk VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (exacerbation_risk IN ('low', 'high', '')),
    abe_group VARCHAR(1) NOT NULL DEFAULT ''
        CHECK (abe_group IN ('A', 'B', 'E', '')),
    review_status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (review_status IN ('complete', 'partial', 'incomplete', '')),

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_chronic_obstructive_pulmonary_disease_review_grade_updated_at
    BEFORE UPDATE ON chronic_obstructive_pulmonary_disease_review_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE chronic_obstructive_pulmonary_disease_review_grade IS
    'Computed GOLD airflow-grade, ABE-group and completeness grading result for a COPD annual review: GOLD airflow-limitation grade (1-4), symptom and exacerbation axes, combined ABE assessment group, and review-completeness status. 1:1 with the parent review.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review_grade.chronic_obstructive_pulmonary_disease_review_id IS
    'Foreign key to the parent COPD review (unique, 1:1).';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review_grade.gold_airflow_grade IS
    'GOLD airflow-limitation grade banded from FEV1 % predicted: 1 (>=80), 2 (>=50), 3 (>=30), 4 (<30); empty when FEV1 % predicted is unrecorded.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review_grade.symptom_burden IS
    'Symptom axis: high when mMRC >= 2 or CAT >= 10, else low.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review_grade.exacerbation_risk IS
    'Exacerbation axis: high when >= 2 moderate or >= 1 hospitalised exacerbation in 12 months, else low.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review_grade.abe_group IS
    'Combined ABE assessment group: E when exacerbation risk high; else B when symptom burden high; else A; empty when no symptom/exacerbation data.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review_grade.review_status IS
    'Review completeness: complete, partial, or incomplete.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
