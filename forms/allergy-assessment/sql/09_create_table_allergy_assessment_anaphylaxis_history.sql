CREATE TABLE allergy_assessment.assessment_anaphylaxis_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES allergy_assessment.assessment(id) ON DELETE CASCADE,
    has_anaphylaxis_history VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (has_anaphylaxis_history IN ('yes', 'no', '')),
    number_of_episodes INTEGER
        CHECK (number_of_episodes IS NULL OR number_of_episodes >= 0),
    adrenaline_auto_injector_prescribed VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (adrenaline_auto_injector_prescribed IN ('yes', 'no', '')),
    action_plan_in_place VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (action_plan_in_place IN ('yes', 'no', ''))
);

CREATE TRIGGER trigger_assessment_anaphylaxis_history_updated_at
    BEFORE UPDATE ON allergy_assessment.assessment_anaphylaxis_history
    FOR EACH ROW
    EXECUTE FUNCTION allergy_assessment.set_updated_at();

COMMENT ON TABLE allergy_assessment.assessment_anaphylaxis_history IS
    'Anaphylaxis history section including auto-injector and action plan status. One-to-one child of assessment.';

-- Individual anaphylaxis episode items (one-to-many child)

COMMENT ON COLUMN allergy_assessment.assessment_anaphylaxis_history.assessment_id IS
    'Foreign key to the assessment table.';
COMMENT ON COLUMN allergy_assessment.assessment_anaphylaxis_history.has_anaphylaxis_history IS
    'Has anaphylaxis history. One of: yes, no.';
COMMENT ON COLUMN allergy_assessment.assessment_anaphylaxis_history.number_of_episodes IS
    'Number of episodes.';
COMMENT ON COLUMN allergy_assessment.assessment_anaphylaxis_history.adrenaline_auto_injector_prescribed IS
    'Adrenaline auto injector prescribed. One of: yes, no.';
COMMENT ON COLUMN allergy_assessment.assessment_anaphylaxis_history.action_plan_in_place IS
    'Action plan in place. One of: yes, no.';
COMMENT ON COLUMN allergy_assessment.assessment_anaphylaxis_history.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN allergy_assessment.assessment_anaphylaxis_history.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN allergy_assessment.assessment_anaphylaxis_history.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN allergy_assessment.assessment_anaphylaxis_history.deleted_at IS
    'Timestamp when this row was deleted.';
