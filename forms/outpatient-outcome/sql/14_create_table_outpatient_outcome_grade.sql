CREATE TABLE outpatient_outcome_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    outpatient_outcome_id UUID NOT NULL UNIQUE
        REFERENCES outpatient_outcome(id) ON DELETE CASCADE,

    overall_grade CHAR(1) NOT NULL DEFAULT ''
        CHECK (overall_grade IN ('A', 'B', 'C', 'D', 'E', '')),
    clinical_grade CHAR(1) NOT NULL DEFAULT ''
        CHECK (clinical_grade IN ('A', 'B', 'C', 'D', 'E', '')),
    prom_grade CHAR(1) NOT NULL DEFAULT ''
        CHECK (prom_grade IN ('A', 'B', 'C', 'D', 'E', '')),
    prem_grade CHAR(1) NOT NULL DEFAULT ''
        CHECK (prem_grade IN ('A', 'B', 'C', 'D', 'E', '')),
    operational_grade CHAR(1) NOT NULL DEFAULT ''
        CHECK (operational_grade IN ('A', 'B', 'C', 'D', 'E', '')),

    result_notes TEXT NOT NULL DEFAULT '',
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE outpatient_outcome_grade IS
    'Outpatient Outcome Composite Grade (OOCG) result: four per-domain letter grades and the overall grade (worst-of-four).';
COMMENT ON COLUMN outpatient_outcome_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN outpatient_outcome_grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN outpatient_outcome_grade.updated_at IS
    'Timestamp when this row was updated most-recently.';
COMMENT ON COLUMN outpatient_outcome_grade.deleted_at IS
    'Timestamp when this row was deleted i.e. soft-removed.';
COMMENT ON COLUMN outpatient_outcome_grade.outpatient_outcome_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN outpatient_outcome_grade.overall_grade IS
    'Overall OOCG grade A (best) - E (worst); equals the worst per-domain grade.';
COMMENT ON COLUMN outpatient_outcome_grade.clinical_grade IS
    'Clinical-domain grade A-E (A=Resolved, B=Improved, C=Unchanged, D=Worsened, E=Died).';
COMMENT ON COLUMN outpatient_outcome_grade.prom_grade IS
    'PROM-domain composite grade A-E over EQ-5D-5L, GRC, and PROMIS.';
COMMENT ON COLUMN outpatient_outcome_grade.prem_grade IS
    'PREM-domain grade A-E from FFT response.';
COMMENT ON COLUMN outpatient_outcome_grade.operational_grade IS
    'Operational-domain grade A-E from attendance outcome + wait vs target + modality.';
COMMENT ON COLUMN outpatient_outcome_grade.result_notes IS
    'Free-text clinician notes accompanying the grading result.';
