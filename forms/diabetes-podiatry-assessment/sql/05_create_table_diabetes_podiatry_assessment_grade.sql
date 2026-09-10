-- Computed per-foot and overall diabetic foot risk classification for a
-- diabetes-podiatry-assessment record, aligned with NICE NG19. The engine
-- classifies each foot (low / moderate / high) from its risk factors, then
-- takes the worst foot and applies patient-wide high-risk overrides (previous
-- ulceration, previous amputation, renal replacement therapy) and the
-- active/urgent override (active ulcer, suspected Charcot foot) to reach an
-- overall risk category, review pathway, and review interval.

CREATE TABLE diabetes_podiatry_assessment_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    diabetes_podiatry_assessment_id UUID NOT NULL UNIQUE
        REFERENCES diabetes_podiatry_assessment(id) ON DELETE CASCADE,

    right_foot_risk VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (right_foot_risk IN ('low', 'moderate', 'high', 'active-urgent', '')),
    left_foot_risk VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (left_foot_risk IN ('low', 'moderate', 'high', 'active-urgent', '')),
    overall_risk VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (overall_risk IN ('low', 'moderate', 'high', 'active-urgent', '')),
    review_pathway VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (review_pathway IN (
            'urgent-mdt-referral',
            'high-risk-review',
            'moderate-risk-review',
            'annual-review',
            ''
        )),
    referral VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (referral IN ('none', 'foot-protection-service', 'multidisciplinary-foot-team', 'urgent-mdt', '')),
    review_interval_months INTEGER,
    status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (status IN ('complete', 'incomplete', '')),

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_diabetes_podiatry_assessment_grade_updated_at
    BEFORE UPDATE ON diabetes_podiatry_assessment_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE diabetes_podiatry_assessment_grade IS
    'Computed per-foot and overall diabetic foot risk classification for a diabetes-podiatry-assessment record: per-foot risk, overall risk, review pathway, referral, review interval, and completeness status.';
COMMENT ON COLUMN diabetes_podiatry_assessment_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN diabetes_podiatry_assessment_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN diabetes_podiatry_assessment_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN diabetes_podiatry_assessment_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN diabetes_podiatry_assessment_grade.diabetes_podiatry_assessment_id IS
    'Foreign key to the parent diabetes-podiatry-assessment record (unique, 1:1).';
COMMENT ON COLUMN diabetes_podiatry_assessment_grade.right_foot_risk IS
    'Right-foot risk category from its own examination findings: low, moderate, high, or active-urgent.';
COMMENT ON COLUMN diabetes_podiatry_assessment_grade.left_foot_risk IS
    'Left-foot risk category from its own examination findings: low, moderate, high, or active-urgent.';
COMMENT ON COLUMN diabetes_podiatry_assessment_grade.overall_risk IS
    'Overall risk category: the worse of the two feet, raised to high by patient-wide factors (previous ulcer/amputation, dialysis) or to active-urgent by an active ulcer or suspected Charcot foot on either foot.';
COMMENT ON COLUMN diabetes_podiatry_assessment_grade.review_pathway IS
    'Review / referral pathway (most urgent wins): urgent-mdt-referral, high-risk-review, moderate-risk-review, or annual-review.';
COMMENT ON COLUMN diabetes_podiatry_assessment_grade.referral IS
    'Referral destination derived from the pathway: none, foot-protection-service, multidisciplinary-foot-team, or urgent-mdt.';
COMMENT ON COLUMN diabetes_podiatry_assessment_grade.review_interval_months IS
    'Recommended review interval in months (1, 3, 6, or 12); null for the urgent-mdt-referral pathway, which has no routine interval.';
COMMENT ON COLUMN diabetes_podiatry_assessment_grade.status IS
    'Completeness status: complete when both feet have a neuropathy and pulses status recorded; otherwise incomplete.';
COMMENT ON COLUMN diabetes_podiatry_assessment_grade.graded_at IS
    'Timestamp when the engine last computed the classification.';
