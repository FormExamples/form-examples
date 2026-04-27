CREATE TABLE grading_result (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    assessment_id UUID NOT NULL UNIQUE
        REFERENCES assessment(id) ON DELETE CASCADE,

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
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grading_result_updated_at
    BEFORE UPDATE ON grading_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE grading_result IS
    'Outpatient Outcome Composite Grade (OOCG) result: four per-domain letter grades and the overall grade (worst-of-four).';
COMMENT ON COLUMN grading_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN grading_result.assessment_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN grading_result.overall_grade IS
    'Overall OOCG grade A (best) - E (worst); equals the worst per-domain grade.';
COMMENT ON COLUMN grading_result.clinical_grade IS
    'Clinical-domain grade A-E (A=Resolved, B=Improved, C=Unchanged, D=Worsened, E=Died).';
COMMENT ON COLUMN grading_result.prom_grade IS
    'PROM-domain composite grade A-E over EQ-5D-5L, GRC, and PROMIS.';
COMMENT ON COLUMN grading_result.prem_grade IS
    'PREM-domain grade A-E from FFT response.';
COMMENT ON COLUMN grading_result.operational_grade IS
    'Operational-domain grade A-E from attendance outcome + wait vs target + modality.';
COMMENT ON COLUMN grading_result.result_notes IS
    'Free-text clinician notes accompanying the grading result.';
COMMENT ON COLUMN grading_result.graded_at IS
    'Timestamp when the OOCG was computed.';
COMMENT ON COLUMN grading_result.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN grading_result.updated_at IS
    'Timestamp when this row was updated.';
