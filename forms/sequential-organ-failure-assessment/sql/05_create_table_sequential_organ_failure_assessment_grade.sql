-- Computed SOFA grading result. Stores each organ system's 0-4
-- sub-score, the summed total (0-24), the change from baseline
-- (delta-SOFA), the derived mortality band, and the Sepsis-3 flag.

CREATE TABLE sequential_organ_failure_assessment_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    sequential_organ_failure_assessment_id UUID NOT NULL UNIQUE
        REFERENCES sequential_organ_failure_assessment(id) ON DELETE CASCADE,

    respiration_score INT,
    coagulation_score INT,
    liver_score INT,
    cardiovascular_score INT,
    cns_score INT,
    renal_score INT,
    total_score INT,
    delta_sofa INT,
    mortality_band VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (mortality_band IN ('low', 'moderate', 'high', 'veryHigh', 'extreme', '')),
    sepsis3 BOOLEAN NOT NULL DEFAULT false,

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_sequential_organ_failure_assessment_grade_updated_at
    BEFORE UPDATE ON sequential_organ_failure_assessment_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE sequential_organ_failure_assessment_grade IS
    'Computed SOFA grading result: per-system 0-4 sub-scores, summed total (0-24), delta-SOFA versus baseline, derived mortality band, and the Sepsis-3 flag.';
COMMENT ON COLUMN sequential_organ_failure_assessment_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN sequential_organ_failure_assessment_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN sequential_organ_failure_assessment_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN sequential_organ_failure_assessment_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN sequential_organ_failure_assessment_grade.sequential_organ_failure_assessment_id IS
    'Foreign key to the parent assessment (unique, 1:1).';
COMMENT ON COLUMN sequential_organ_failure_assessment_grade.respiration_score IS
    'Respiration organ-system sub-score (0-4); null when the input is incomplete.';
COMMENT ON COLUMN sequential_organ_failure_assessment_grade.coagulation_score IS
    'Coagulation organ-system sub-score (0-4); null when the input is incomplete.';
COMMENT ON COLUMN sequential_organ_failure_assessment_grade.liver_score IS
    'Liver organ-system sub-score (0-4); null when the input is incomplete.';
COMMENT ON COLUMN sequential_organ_failure_assessment_grade.cardiovascular_score IS
    'Cardiovascular organ-system sub-score (0-4), max of MAP and vasopressor bands; null when the input is incomplete.';
COMMENT ON COLUMN sequential_organ_failure_assessment_grade.cns_score IS
    'Central nervous system organ-system sub-score (0-4); null when the input is incomplete.';
COMMENT ON COLUMN sequential_organ_failure_assessment_grade.renal_score IS
    'Renal organ-system sub-score (0-4), max of creatinine and urine-output bands; null when the input is incomplete.';
COMMENT ON COLUMN sequential_organ_failure_assessment_grade.total_score IS
    'Summed total SOFA score across the six systems (0-24 when complete).';
COMMENT ON COLUMN sequential_organ_failure_assessment_grade.delta_sofa IS
    'Change in total SOFA from baseline (total_score minus baseline_sofa_total); null when no baseline is present.';
COMMENT ON COLUMN sequential_organ_failure_assessment_grade.mortality_band IS
    'Derived mortality-risk band: low (0-6), moderate (7-9), high (10-12), veryHigh (13-14), or extreme (15-24).';
COMMENT ON COLUMN sequential_organ_failure_assessment_grade.sepsis3 IS
    'Sepsis-3 flag: true when infection is suspected and delta-SOFA is >= 2.';
COMMENT ON COLUMN sequential_organ_failure_assessment_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
