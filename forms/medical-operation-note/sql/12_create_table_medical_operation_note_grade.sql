-- Computed and signed-off operative-risk grading result. Stores both
-- the engine-computed composite risk grade and the surgeon-final grade
-- with an override reason.

CREATE TABLE medical_operation_note_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    medical_operation_note_id UUID NOT NULL UNIQUE
        REFERENCES medical_operation_note(id) ON DELETE CASCADE,

    computed_composite_risk VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (computed_composite_risk IN ('routine', 'complicated', 'high-risk', 'critical', '')),
    final_composite_risk VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (final_composite_risk IN ('routine', 'complicated', 'high-risk', 'critical', '')),
    override_reason VARCHAR(500) NOT NULL DEFAULT '',

    worst_clavien_dindo_grade VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (worst_clavien_dindo_grade IN ('0', 'I', 'II', 'IIIa', 'IIIb', 'IVa', 'IVb', 'V', '')),
    asa_physical_status VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (asa_physical_status IN ('I', 'II', 'III', 'IV', 'V', 'VI', '')),
    blood_loss_band VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (blood_loss_band IN ('minimal', 'mild', 'moderate', 'severe', 'massive', '')),
    counts_agreed VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (counts_agreed IN ('yes', 'no', '')),
    never_event_suspected VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (never_event_suspected IN ('yes', 'no', '')),

    recommendation VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (recommendation IN ('routine-recovery', 'enhanced-monitoring', 'critical-care', 'urgent-review', 'datix-required', '')),
    surgeon_notes TEXT NOT NULL DEFAULT '',
    signed_at TIMESTAMPTZ,
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_medical_operation_note_grade_updated_at
    BEFORE UPDATE ON medical_operation_note_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE medical_operation_note_grade IS
    'Computed and signed-off operative-risk grading result. Stores both the engine-computed composite risk grade and the surgeon-final grade with an override reason.';
COMMENT ON COLUMN medical_operation_note_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_operation_note_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN medical_operation_note_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN medical_operation_note_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN medical_operation_note_grade.medical_operation_note_id IS
    'Foreign key to the parent operation note (unique, 1:1).';
COMMENT ON COLUMN medical_operation_note_grade.computed_composite_risk IS
    'Composite operative risk computed by the engine from operative-team data.';
COMMENT ON COLUMN medical_operation_note_grade.final_composite_risk IS
    'Composite operative risk signed off by the surgeon (may equal or differ from computed).';
COMMENT ON COLUMN medical_operation_note_grade.override_reason IS
    'Reason the surgeon set final differently from computed (mandatory when they differ).';
COMMENT ON COLUMN medical_operation_note_grade.worst_clavien_dindo_grade IS
    'Worst Clavien-Dindo grade across all complications recorded for this case.';
COMMENT ON COLUMN medical_operation_note_grade.asa_physical_status IS
    'ASA Physical Status carried over from pre-op assessment.';
COMMENT ON COLUMN medical_operation_note_grade.blood_loss_band IS
    'Blood loss band: minimal (<= 100 mL), mild (101-500 mL), moderate (501-1500 mL), severe (1501-3000 mL), massive (> 3000 mL).';
COMMENT ON COLUMN medical_operation_note_grade.counts_agreed IS
    'Whether swab, needle, and instrument final counts were all agreed.';
COMMENT ON COLUMN medical_operation_note_grade.never_event_suspected IS
    'Whether any never-event candidate is suspected.';
COMMENT ON COLUMN medical_operation_note_grade.recommendation IS
    'Overall recommendation: routine-recovery, enhanced-monitoring, critical-care, urgent-review, or datix-required.';
COMMENT ON COLUMN medical_operation_note_grade.surgeon_notes IS
    'Free-text surgeon summary notes for the report.';
COMMENT ON COLUMN medical_operation_note_grade.signed_at IS
    'Timestamp of surgeon electronic signature on the grade.';
COMMENT ON COLUMN medical_operation_note_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
