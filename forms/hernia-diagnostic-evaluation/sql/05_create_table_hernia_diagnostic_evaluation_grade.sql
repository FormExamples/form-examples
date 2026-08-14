-- Computed and signed-off classification and urgency result for one hernia
-- diagnostic evaluation. Stores both the engine-computed values and the
-- clinician-final values with an override reason, so the override is
-- auditable rather than silent.

CREATE TABLE hernia_diagnostic_evaluation_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    hernia_diagnostic_evaluation_id UUID NOT NULL UNIQUE
        REFERENCES hernia_diagnostic_evaluation(id) ON DELETE CASCADE,

    hernia_type VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (hernia_type IN ('inguinal', 'femoral', 'umbilical', 'epigastric', 'incisional', 'paraumbilical', 'spigelian', 'other', '')),
    hernia_subtype VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (hernia_subtype IN ('direct', 'indirect', 'pantaloon', 'uncertain', 'not-applicable', '')),
    ehs_classification VARCHAR(100) NOT NULL DEFAULT '',
    ehs_size_grade VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (ehs_size_grade IN ('1', '2', '3', '')),
    reducibility_status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (reducibility_status IN ('reducible', 'irreducible', 'incarcerated', '')),

    computed_urgency VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (computed_urgency IN ('routine', 'soon', 'urgent', 'emergency', '')),
    final_urgency VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (final_urgency IN ('routine', 'soon', 'urgent', 'emergency', '')),
    override_reason VARCHAR(500) NOT NULL DEFAULT '',

    recommendation VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (recommendation IN ('watchful-waiting', 'elective-repair-referral', 'urgent-referral', 'emergency-referral', 'conservative', '')),
    clinician_notes TEXT NOT NULL DEFAULT '',
    signed_by_name VARCHAR(255) NOT NULL DEFAULT '',
    signed_at TIMESTAMPTZ,
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_hernia_diagnostic_evaluation_grade_updated_at
    BEFORE UPDATE ON hernia_diagnostic_evaluation_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE hernia_diagnostic_evaluation_grade IS
    'Computed and signed-off classification and urgency result for one hernia diagnostic evaluation. Stores both the engine-computed values and the clinician-final values with an override reason.';
COMMENT ON COLUMN hernia_diagnostic_evaluation_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN hernia_diagnostic_evaluation_grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN hernia_diagnostic_evaluation_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN hernia_diagnostic_evaluation_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN hernia_diagnostic_evaluation_grade.hernia_diagnostic_evaluation_id IS
    'Foreign key to the hernia_diagnostic_evaluation table, unique because grading is one-to-one with the evaluation.';
COMMENT ON COLUMN hernia_diagnostic_evaluation_grade.hernia_type IS
    'Hernia type as classified by the engine from the clinical classification step.';
COMMENT ON COLUMN hernia_diagnostic_evaluation_grade.hernia_subtype IS
    'European Hernia Society inguinal subtype when the hernia type is inguinal, otherwise not-applicable.';
COMMENT ON COLUMN hernia_diagnostic_evaluation_grade.ehs_classification IS
    'Human-readable European Hernia Society classification string, such as "Inguinal, indirect, right, EHS grade 2 (2-4cm)".';
COMMENT ON COLUMN hernia_diagnostic_evaluation_grade.ehs_size_grade IS
    'European Hernia Society size grade carried through from the classification step: 1, 2, or 3.';
COMMENT ON COLUMN hernia_diagnostic_evaluation_grade.reducibility_status IS
    'Reducibility status carried through from the reducibility assessment step.';
COMMENT ON COLUMN hernia_diagnostic_evaluation_grade.computed_urgency IS
    'Urgency band computed by the engine: routine, soon, urgent, or emergency. Emergency is forced by any positive red flag.';
COMMENT ON COLUMN hernia_diagnostic_evaluation_grade.final_urgency IS
    'Urgency band signed off by the clinician, which may equal or differ from the computed value.';
COMMENT ON COLUMN hernia_diagnostic_evaluation_grade.override_reason IS
    'Reason the clinician set a final urgency differently from the computed value, mandatory when they differ.';
COMMENT ON COLUMN hernia_diagnostic_evaluation_grade.recommendation IS
    'Overall recommendation derived from the final urgency band, mirroring the management_plan options.';
COMMENT ON COLUMN hernia_diagnostic_evaluation_grade.clinician_notes IS
    'Free-text clinician summary notes.';
COMMENT ON COLUMN hernia_diagnostic_evaluation_grade.signed_by_name IS
    'Name of the clinician who signed the evaluation.';
COMMENT ON COLUMN hernia_diagnostic_evaluation_grade.signed_at IS
    'Timestamp of the clinician electronic signature.';
COMMENT ON COLUMN hernia_diagnostic_evaluation_grade.graded_at IS
    'Timestamp when the engine last computed the result.';
