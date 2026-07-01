-- Computed legal-completeness and classification result for a Mental Health
-- Act assessment. The engine validates that the documentation required by the
-- recommended section is complete (valid / incomplete) and classifies the
-- recommended-section and urgency. It makes no automated detention decision;
-- the prescribed statutory forms remain the definitive legal record.

CREATE TABLE mental_health_act_assessment_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    mental_health_act_assessment_id UUID NOT NULL UNIQUE
        REFERENCES mental_health_act_assessment(id) ON DELETE CASCADE,

    completeness_status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (completeness_status IN ('valid', 'incomplete', '')),
    recommended_section_class VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (recommended_section_class IN (
            'section-2',
            'section-3',
            'section-4',
            'section-5-2',
            'section-5-4',
            'section-136',
            'none',
            ''
        )),
    urgency VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (urgency IN ('routine', 'urgent', 'emergency', '')),

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_mental_health_act_assessment_grade_updated_at
    BEFORE UPDATE ON mental_health_act_assessment_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE mental_health_act_assessment_grade IS
    'Computed legal-completeness and classification result for a Mental Health Act assessment: completeness status (valid/incomplete), recommended-section class, and urgency class. No automated detention decision is made.';
COMMENT ON COLUMN mental_health_act_assessment_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN mental_health_act_assessment_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN mental_health_act_assessment_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN mental_health_act_assessment_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN mental_health_act_assessment_grade.mental_health_act_assessment_id IS
    'Foreign key to the parent assessment (unique, 1:1).';
COMMENT ON COLUMN mental_health_act_assessment_grade.completeness_status IS
    'Legal-completeness status: valid or incomplete.';
COMMENT ON COLUMN mental_health_act_assessment_grade.recommended_section_class IS
    'Recommended-section classification: section-2, section-3, section-4, section-5-2, section-5-4, section-136, or none.';
COMMENT ON COLUMN mental_health_act_assessment_grade.urgency IS
    'Urgency classification: routine, urgent, or emergency.';
COMMENT ON COLUMN mental_health_act_assessment_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
