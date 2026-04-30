CREATE TABLE grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    pre_operative_assessment_by_patient_id UUID NOT NULL UNIQUE
        REFERENCES pre_operative_assessment_by_patient(id) ON DELETE CASCADE,
    computed_asa_grade VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (computed_asa_grade IN ('I', 'II', 'III', 'IV', 'V', 'VI', '')),
    final_asa_grade VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (final_asa_grade IN ('I', 'II', 'III', 'IV', 'V', 'VI', '')),
    asa_emergency_suffix VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (asa_emergency_suffix IN ('E', '')),
    override_reason VARCHAR(500) NOT NULL DEFAULT '',
    mallampati_class VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (mallampati_class IN ('I', 'II', 'III', 'IV', '')),
    rcri_score INTEGER
        CHECK (rcri_score IS NULL OR rcri_score BETWEEN 0 AND 6),
    stopbang_score INTEGER
        CHECK (stopbang_score IS NULL OR stopbang_score BETWEEN 0 AND 8),
    frailty_scale INTEGER
        CHECK (frailty_scale IS NULL OR frailty_scale BETWEEN 1 AND 9),
    composite_risk VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (composite_risk IN ('low', 'moderate', 'high', 'critical', '')),
    recommendation VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (recommendation IN ('proceed', 'optimise-first', 'mdt-review', 'cancel', '')),
    clinician_notes TEXT NOT NULL DEFAULT '',
    signed_at TIMESTAMPTZ,
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE grade IS
    'Step 16: computed and signed-off grading result. Stores both the engine-computed ASA grade and the clinician-final grade with an override reason.';
COMMENT ON COLUMN grade.assessment_id IS
    'Foreign key to the parent assessment (unique, 1:1).';
COMMENT ON COLUMN grade.computed_asa_grade IS
    'ASA grade computed by the engine from clinician-observed data.';
COMMENT ON COLUMN grade.final_asa_grade IS
    'ASA grade signed off by the clinician (may equal or differ from computed).';
COMMENT ON COLUMN grade.asa_emergency_suffix IS
    'Emergency suffix: E if the procedure is emergency, empty otherwise.';
COMMENT ON COLUMN grade.override_reason IS
    'Reason the clinician set final differently from computed (mandatory when they differ).';
COMMENT ON COLUMN grade.mallampati_class IS
    'Mallampati airway class as per step 4.';
COMMENT ON COLUMN grade.rcri_score IS
    'Revised Cardiac Risk Index score (0-6).';
COMMENT ON COLUMN grade.stopbang_score IS
    'STOP-BANG score (0-8).';
COMMENT ON COLUMN grade.frailty_scale IS
    'Clinical Frailty Scale score (1-9).';
COMMENT ON COLUMN grade.composite_risk IS
    'Composite perioperative risk: low, moderate, high, critical.';
COMMENT ON COLUMN grade.recommendation IS
    'Overall recommendation: proceed, optimise-first, mdt-review, cancel.';
COMMENT ON COLUMN grade.clinician_notes IS
    'Free-text clinician summary notes.';
COMMENT ON COLUMN grade.signed_at IS
    'Timestamp of clinician electronic signature.';
COMMENT ON COLUMN grade.graded_at IS
    'Timestamp when the engine last computed the result.';

COMMENT ON COLUMN grade.pre_operative_assessment_by_patient_id IS
    'Foreign key to the pre_operative_assessment_by_patient table.';
COMMENT ON COLUMN grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN grade.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN grade.deleted_at IS
    'Timestamp when this row was deleted.';
