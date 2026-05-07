CREATE TABLE pre_operative_assessment_by_clinician_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    pre_operative_assessment_by_clinician_id UUID NOT NULL UNIQUE
        REFERENCES pre_operative_assessment_by_clinician(id) ON DELETE CASCADE,
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

CREATE TRIGGER trigger_pre_operative_assessment_by_clinician_grade_updated_at
    BEFORE UPDATE ON grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE pre_operative_assessment_by_clinician_grade IS
    'Computed and signed-off grading result. Stores both the engine-computed ASA grade and the clinician-final grade with an override reason.';
COMMENT ON COLUMN pre_operative_assessment_by_clinician_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN pre_operative_assessment_by_clinician_grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN pre_operative_assessment_by_clinician_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN pre_operative_assessment_by_clinician_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN pre_operative_assessment_by_clinician_grade.pre_operative_assessment_by_clinician_id IS
    'Foreign key to the pre_operative_assessment_by_clinician table.';
COMMENT ON COLUMN pre_operative_assessment_by_clinician_grade.assessment_id IS
    'Foreign key to the parent assessment (unique, 1:1).';
COMMENT ON COLUMN pre_operative_assessment_by_clinician_grade.computed_asa_grade IS
    'ASA grade computed by the engine from clinician-observed data.';
COMMENT ON COLUMN pre_operative_assessment_by_clinician_grade.final_asa_grade IS
    'ASA grade signed off by the clinician (may equal or differ from computed).';
COMMENT ON COLUMN pre_operative_assessment_by_clinician_grade.asa_emergency_suffix IS
    'Emergency suffix: E if the procedure is emergency, empty otherwise.';
COMMENT ON COLUMN pre_operative_assessment_by_clinician_grade.override_reason IS
    'Reason the clinician set final differently from computed (mandatory when they differ).';
COMMENT ON COLUMN pre_operative_assessment_by_clinician_grade.mallampati_class IS
    'Mallampati airway class as per step 4.';
COMMENT ON COLUMN pre_operative_assessment_by_clinician_grade.rcri_score IS
    'Revised Cardiac Risk Index score (0-6).';
COMMENT ON COLUMN pre_operative_assessment_by_clinician_grade.stopbang_score IS
    'STOP-BANG score (0-8).';
COMMENT ON COLUMN pre_operative_assessment_by_clinician_grade.frailty_scale IS
    'Clinical Frailty Scale score (1-9).';
COMMENT ON COLUMN pre_operative_assessment_by_clinician_grade.composite_risk IS
    'Composite perioperative risk: low, moderate, high, critical.';
COMMENT ON COLUMN pre_operative_assessment_by_clinician_grade.recommendation IS
    'Overall recommendation: proceed, optimise-first, mdt-review, cancel.';
COMMENT ON COLUMN pre_operative_assessment_by_clinician_grade.clinician_notes IS
    'Free-text clinician summary notes.';
COMMENT ON COLUMN pre_operative_assessment_by_clinician_grade.signed_at IS
    'Timestamp of clinician electronic signature.';
COMMENT ON COLUMN pre_operative_assessment_by_clinician_grade.graded_at IS
    'Timestamp when the engine last computed the result.';

