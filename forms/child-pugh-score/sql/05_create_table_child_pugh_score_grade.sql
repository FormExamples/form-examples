-- Computed Child-Pugh grading result. Stores each parameter's 1-3
-- points, the summed total (5-15), and the derived class (A/B/C) with
-- banded survival and surgical-risk estimates.

CREATE TABLE child_pugh_score_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    child_pugh_score_id UUID NOT NULL UNIQUE
        REFERENCES child_pugh_score(id) ON DELETE CASCADE,

    bilirubin_points INT,
    albumin_points INT,
    coagulation_points INT,
    ascites_points INT,
    encephalopathy_points INT,
    total_score INT,
    child_pugh_class VARCHAR(1) NOT NULL DEFAULT ''
        CHECK (child_pugh_class IN ('A', 'B', 'C', '')),

    one_year_survival VARCHAR(20) NOT NULL DEFAULT '',
    two_year_survival VARCHAR(20) NOT NULL DEFAULT '',
    surgical_risk VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (surgical_risk IN ('low', 'moderate', 'high', '')),

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_child_pugh_score_grade_updated_at
    BEFORE UPDATE ON child_pugh_score_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE child_pugh_score_grade IS
    'Computed Child-Pugh grading result: per-parameter points, summed total (5-15), derived class (A/B/C), and banded survival and surgical-risk estimates.';
COMMENT ON COLUMN child_pugh_score_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN child_pugh_score_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN child_pugh_score_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN child_pugh_score_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN child_pugh_score_grade.child_pugh_score_id IS
    'Foreign key to the parent assessment (unique, 1:1).';
COMMENT ON COLUMN child_pugh_score_grade.bilirubin_points IS
    'Points (1-3) awarded for parameter 1, total bilirubin.';
COMMENT ON COLUMN child_pugh_score_grade.albumin_points IS
    'Points (1-3) awarded for parameter 2, serum albumin.';
COMMENT ON COLUMN child_pugh_score_grade.coagulation_points IS
    'Points (1-3) awarded for parameter 3, coagulation (INR or prothrombin time).';
COMMENT ON COLUMN child_pugh_score_grade.ascites_points IS
    'Points (1-3) awarded for parameter 4, ascites.';
COMMENT ON COLUMN child_pugh_score_grade.encephalopathy_points IS
    'Points (1-3) awarded for parameter 5, hepatic encephalopathy.';
COMMENT ON COLUMN child_pugh_score_grade.total_score IS
    'Summed Child-Pugh score across the five parameters (5-15 when complete).';
COMMENT ON COLUMN child_pugh_score_grade.child_pugh_class IS
    'Derived class: A (5-6), B (7-9), or C (10-15).';
COMMENT ON COLUMN child_pugh_score_grade.one_year_survival IS
    'Banded one-year survival estimate for the class (e.g. ~100%).';
COMMENT ON COLUMN child_pugh_score_grade.two_year_survival IS
    'Banded two-year survival estimate for the class (e.g. ~85%).';
COMMENT ON COLUMN child_pugh_score_grade.surgical_risk IS
    'Banded peri-operative risk for the class: low, moderate, or high.';
COMMENT ON COLUMN child_pugh_score_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
