-- Safety-critical flags that fire independently of the MUST score, with a
-- priority and a suggested action for the dietetic or nutrition-support team.
-- Flags are never suppressed by a dietitian override of the risk category.

CREATE TABLE dietic_assessment_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    dietic_assessment_grade_id UUID NOT NULL
        REFERENCES dietic_assessment_grade(id) ON DELETE CASCADE,
    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (category IN (
            'high-malnutrition-risk',
            'severe-underweight',
            'severe-weight-loss',
            'refeeding-syndrome-risk',
            'dysphagia-aspiration-risk',
            'inadequate-oral-intake',
            'micronutrient-deficiency',
            'electrolyte-derangement',
            'dehydration-risk',
            'food-insecurity',
            'disordered-eating-concern',
            'pressure-ulcer',
            'sarcopenia-risk',
            'uncontrolled-diabetes',
            'renal-dietary-conflict',
            'drug-nutrient-interaction',
            'allergy-anaphylaxis-risk',
            'enteral-tube-complication',
            'alcohol-excess',
            'pregnancy-lactation',
            'paediatric',
            'capacity-concern',
            'safeguarding',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX dietic_assessment_grade_flag_grade_id_index
    ON dietic_assessment_grade_flag (dietic_assessment_grade_id);

CREATE TRIGGER trigger_dietic_assessment_grade_flag_updated_at
    BEFORE UPDATE ON dietic_assessment_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE dietic_assessment_grade_flag IS
    'Safety-critical flags that fire independently of the MUST score, with a priority and a suggested action for the dietetic or nutrition-support team.';
COMMENT ON COLUMN dietic_assessment_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN dietic_assessment_grade_flag.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN dietic_assessment_grade_flag.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN dietic_assessment_grade_flag.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN dietic_assessment_grade_flag.dietic_assessment_grade_id IS
    'Foreign key to the parent dietic_assessment_grade table.';
COMMENT ON COLUMN dietic_assessment_grade_flag.flag_id IS
    'Stable flag identifier, such as F-REFEEDING-SYNDROME-RISK-001.';
COMMENT ON COLUMN dietic_assessment_grade_flag.category IS
    'Flag category, such as refeeding-syndrome-risk or dysphagia-aspiration-risk.';
COMMENT ON COLUMN dietic_assessment_grade_flag.priority IS
    'Priority: low, medium, or high.';
COMMENT ON COLUMN dietic_assessment_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN dietic_assessment_grade_flag.suggested_action IS
    'Suggested clinical action, such as "check potassium, phosphate, and magnesium before feeding".';
