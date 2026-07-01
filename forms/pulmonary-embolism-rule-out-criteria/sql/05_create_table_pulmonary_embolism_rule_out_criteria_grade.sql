-- Computed PERC classification result. PERC is a rule-out gestalt tool, not a
-- graded severity score: the output is a binary status, not a number. Stores the
-- engine-computed classification (perc-negative / perc-positive), whether all
-- eight criteria were satisfied, and whether PERC was applicable (pre-test
-- probability low). One-to-one with the parent assessment.

CREATE TABLE pulmonary_embolism_rule_out_criteria_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    pulmonary_embolism_rule_out_criteria_id UUID NOT NULL UNIQUE
        REFERENCES pulmonary_embolism_rule_out_criteria(id) ON DELETE CASCADE,

    classification VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (classification IN ('perc-negative', 'perc-positive', '')),
    all_criteria_satisfied VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (all_criteria_satisfied IN ('yes', 'no', '')),
    applicable VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (applicable IN ('yes', 'no', '')),
    recommended_pathway TEXT NOT NULL DEFAULT '',
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_pulmonary_embolism_rule_out_criteria_grade_updated_at
    BEFORE UPDATE ON pulmonary_embolism_rule_out_criteria_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE pulmonary_embolism_rule_out_criteria_grade IS
    'Computed PERC classification result: binary classification, all-criteria-satisfied flag, applicability, and recommended pathway. One-to-one with the parent assessment.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria_grade.pulmonary_embolism_rule_out_criteria_id IS
    'Foreign key to the parent assessment (unique, 1:1).';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria_grade.classification IS
    'Binary PERC classification: perc-negative (PE excluded without further testing) or perc-positive (proceed to D-dimer / imaging).';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria_grade.all_criteria_satisfied IS
    'Whether all eight criteria were satisfied (yes) or at least one failed (no).';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria_grade.applicable IS
    'Whether PERC was applicable (yes when pre-test probability is low; otherwise no).';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria_grade.recommended_pathway IS
    'Recommended pathway: no further testing when perc-negative, otherwise D-dimer and/or imaging per local policy.';
COMMENT ON COLUMN pulmonary_embolism_rule_out_criteria_grade.graded_at IS
    'Timestamp when the engine last computed the classification.';
