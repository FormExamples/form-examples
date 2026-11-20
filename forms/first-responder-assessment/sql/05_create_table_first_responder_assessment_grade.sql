CREATE TABLE first_responder_assessment.grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES first_responder_assessment.assessment(id) ON DELETE CASCADE,
    physical_fitness_level VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (physical_fitness_level IN ('not-competent', 'developing', 'competent', 'expert', '')),
    clinical_skills_level VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (clinical_skills_level IN ('not-competent', 'developing', 'competent', 'expert', '')),
    equipment_vehicle_level VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (equipment_vehicle_level IN ('not-competent', 'developing', 'competent', 'expert', '')),
    communication_level VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (communication_level IN ('not-competent', 'developing', 'competent', 'expert', '')),
    psychological_level VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (psychological_level IN ('not-competent', 'developing', 'competent', 'expert', '')),
    overall_competency VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (overall_competency IN ('not-competent', 'developing', 'competent', 'expert', '')),
    overall_fitness VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (overall_fitness IN ('fit-for-duty', 'fit-with-restrictions', 'temporarily-unfit', 'permanently-unfit', '')),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON first_responder_assessment.grade
    FOR EACH ROW
    EXECUTE FUNCTION first_responder_assessment.set_updated_at();

COMMENT ON TABLE first_responder_assessment.grade IS
    'Computed first responder competency grading result. Domain competency levels and overall fitness decision. One-to-one child of assessment.';
COMMENT ON COLUMN first_responder_assessment.grade.assessment_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN first_responder_assessment.grade.physical_fitness_level IS
    'Aggregated physical fitness competency level.';
COMMENT ON COLUMN first_responder_assessment.grade.clinical_skills_level IS
    'Aggregated clinical skills competency level.';
COMMENT ON COLUMN first_responder_assessment.grade.equipment_vehicle_level IS
    'Aggregated equipment and vehicle competency level.';
COMMENT ON COLUMN first_responder_assessment.grade.communication_level IS
    'Aggregated communication competency level.';
COMMENT ON COLUMN first_responder_assessment.grade.psychological_level IS
    'Aggregated psychological readiness competency level.';
COMMENT ON COLUMN first_responder_assessment.grade.overall_competency IS
    'Overall competency across all domains.';
COMMENT ON COLUMN first_responder_assessment.grade.overall_fitness IS
    'Overall fitness decision: fit-for-duty, fit-with-restrictions, temporarily-unfit, permanently-unfit, or empty.';
COMMENT ON COLUMN first_responder_assessment.grade.graded_at IS
    'Timestamp when the grading was computed.';

COMMENT ON COLUMN first_responder_assessment.grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN first_responder_assessment.grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN first_responder_assessment.grade.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN first_responder_assessment.grade.deleted_at IS
    'Timestamp when this row was deleted.';
