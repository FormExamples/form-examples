-- Computed and signed-off grading result for one dietetic assessment.
-- Stores both the engine-computed values and the dietitian-final values with
-- an override reason, so the override is auditable rather than silent.

CREATE TABLE dietic_assessment_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    dietic_assessment_id UUID NOT NULL UNIQUE
        REFERENCES dietic_assessment(id) ON DELETE CASCADE,

    must_bmi_score INTEGER
        CHECK (must_bmi_score IS NULL OR must_bmi_score BETWEEN 0 AND 2),
    must_weight_loss_score INTEGER
        CHECK (must_weight_loss_score IS NULL OR must_weight_loss_score BETWEEN 0 AND 2),
    must_acute_disease_score INTEGER
        CHECK (must_acute_disease_score IS NULL OR must_acute_disease_score IN (0, 2)),
    must_score INTEGER
        CHECK (must_score IS NULL OR must_score BETWEEN 0 AND 6),
    computed_must_risk VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (computed_must_risk IN ('low', 'medium', 'high', '')),
    final_must_risk VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (final_must_risk IN ('low', 'medium', 'high', '')),
    must_is_estimated BOOLEAN NOT NULL DEFAULT FALSE,

    glim_phenotypic_criteria VARCHAR(500) NOT NULL DEFAULT '',
    glim_etiologic_criteria VARCHAR(500) NOT NULL DEFAULT '',
    glim_diagnosis VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (glim_diagnosis IN ('none', 'moderate', 'severe', '')),

    nrs_2002_score INTEGER
        CHECK (nrs_2002_score IS NULL OR nrs_2002_score BETWEEN 0 AND 7),
    sarcf_score INTEGER
        CHECK (sarcf_score IS NULL OR sarcf_score BETWEEN 0 AND 10),
    scoff_score INTEGER
        CHECK (scoff_score IS NULL OR scoff_score BETWEEN 0 AND 5),
    refeeding_risk VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (refeeding_risk IN ('none', 'high', 'highest', '')),

    energy_requirement_kcal INTEGER
        CHECK (energy_requirement_kcal IS NULL OR energy_requirement_kcal BETWEEN 0 AND 10000),
    protein_requirement_g INTEGER
        CHECK (protein_requirement_g IS NULL OR protein_requirement_g BETWEEN 0 AND 500),

    computed_composite_risk VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (computed_composite_risk IN ('low', 'moderate', 'high', 'critical', '')),
    final_composite_risk VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (final_composite_risk IN ('low', 'moderate', 'high', 'critical', '')),
    override_reason VARCHAR(500) NOT NULL DEFAULT '',

    recommendation VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (recommendation IN ('routine-care', 'observe-and-rescreen', 'dietetic-treatment-plan', 'urgent-referral', 'discharge', '')),
    dietitian_notes TEXT NOT NULL DEFAULT '',
    signed_by_name VARCHAR(255) NOT NULL DEFAULT '',
    signed_at TIMESTAMPTZ,
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_dietic_assessment_grade_updated_at
    BEFORE UPDATE ON dietic_assessment_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE dietic_assessment_grade IS
    'Computed and signed-off grading result for one dietetic assessment. Stores both the engine-computed values and the dietitian-final values with an override reason.';
COMMENT ON COLUMN dietic_assessment_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN dietic_assessment_grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN dietic_assessment_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN dietic_assessment_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN dietic_assessment_grade.dietic_assessment_id IS
    'Foreign key to the dietic_assessment table, unique because grading is one-to-one with the assessment.';
COMMENT ON COLUMN dietic_assessment_grade.must_bmi_score IS
    'MUST step 1 body mass index component, 0 to 2, where body mass index above 20.0 scores 0, 18.5 to 20.0 scores 1, and below 18.5 scores 2.';
COMMENT ON COLUMN dietic_assessment_grade.must_weight_loss_score IS
    'MUST step 2 unplanned weight loss component, 0 to 2, where loss below 5 percent scores 0, 5 to 10 percent scores 1, and above 10 percent scores 2.';
COMMENT ON COLUMN dietic_assessment_grade.must_acute_disease_score IS
    'MUST step 3 acute disease effect component, 0 or 2, scoring 2 when the patient is acutely ill and there has been or is likely to be no nutritional intake for more than 5 days.';
COMMENT ON COLUMN dietic_assessment_grade.must_score IS
    'MUST total score, 0 to 6, being the sum of the three component scores.';
COMMENT ON COLUMN dietic_assessment_grade.computed_must_risk IS
    'MUST risk category computed by the engine, where 0 is low, 1 is medium, and 2 or more is high.';
COMMENT ON COLUMN dietic_assessment_grade.final_must_risk IS
    'MUST risk category signed off by the dietitian, which may equal or differ from the computed value.';
COMMENT ON COLUMN dietic_assessment_grade.must_is_estimated IS
    'Whether the MUST score relies on an estimate, such as a mid-upper-arm circumference fallback when weighing was declined, in which case the report states that the score is estimated.';
COMMENT ON COLUMN dietic_assessment_grade.glim_phenotypic_criteria IS
    'GLIM phenotypic criteria met, as a comma-separated list of criterion identifiers such as weight-loss, low-bmi, reduced-muscle-mass.';
COMMENT ON COLUMN dietic_assessment_grade.glim_etiologic_criteria IS
    'GLIM etiologic criteria met, as a comma-separated list of criterion identifiers such as reduced-intake, inflammation.';
COMMENT ON COLUMN dietic_assessment_grade.glim_diagnosis IS
    'GLIM malnutrition diagnosis: none, moderate, or severe, requiring at least one phenotypic criterion and at least one etiologic criterion.';
COMMENT ON COLUMN dietic_assessment_grade.nrs_2002_score IS
    'Nutritional Risk Screening 2002 total score, 0 to 7, where 3 or more indicates nutritional risk.';
COMMENT ON COLUMN dietic_assessment_grade.sarcf_score IS
    'SARC-F sarcopenia case-finding score, 0 to 10, where 4 or more indicates a risk of sarcopenia.';
COMMENT ON COLUMN dietic_assessment_grade.scoff_score IS
    'SCOFF disordered-eating screening score, 0 to 5, where 2 or more warrants further assessment.';
COMMENT ON COLUMN dietic_assessment_grade.refeeding_risk IS
    'Refeeding-syndrome risk per NICE CG32: none, high, or highest.';
COMMENT ON COLUMN dietic_assessment_grade.energy_requirement_kcal IS
    'Estimated daily energy requirement in kilocalories, as entered by the dietitian using the equation named on the assessment.';
COMMENT ON COLUMN dietic_assessment_grade.protein_requirement_g IS
    'Estimated daily protein requirement in grams, as entered by the dietitian.';
COMMENT ON COLUMN dietic_assessment_grade.computed_composite_risk IS
    'Composite nutrition risk computed by the engine using the max-grade algorithm across every instrument: low, moderate, high, or critical.';
COMMENT ON COLUMN dietic_assessment_grade.final_composite_risk IS
    'Composite nutrition risk signed off by the dietitian, which may equal or differ from the computed value.';
COMMENT ON COLUMN dietic_assessment_grade.override_reason IS
    'Reason the dietitian set a final value differently from the computed value, mandatory when they differ.';
COMMENT ON COLUMN dietic_assessment_grade.recommendation IS
    'Overall recommendation: routine-care, observe-and-rescreen, dietetic-treatment-plan, urgent-referral, or discharge.';
COMMENT ON COLUMN dietic_assessment_grade.dietitian_notes IS
    'Free-text dietitian summary notes.';
COMMENT ON COLUMN dietic_assessment_grade.signed_by_name IS
    'Name of the registered dietitian who signed the assessment.';
COMMENT ON COLUMN dietic_assessment_grade.signed_at IS
    'Timestamp of the dietitian electronic signature.';
COMMENT ON COLUMN dietic_assessment_grade.graded_at IS
    'Timestamp when the engine last computed the result.';
