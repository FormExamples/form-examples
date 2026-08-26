-- Safety-critical flags that fire independently of the surgical readiness band,
-- with a priority and a suggested action. Flags are never suppressed by a
-- clinician override of the readiness band -- see ../doc/safety-case-notes.md
-- hazard H-07.

CREATE TABLE perioperative_optimization_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    perioperative_optimization_grade_id UUID NOT NULL
        REFERENCES perioperative_optimization_grade(id) ON DELETE CASCADE,
    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (category IN (
            'severe-anaemia',
            'iron-deficiency-untreated',
            'hba1c-above-threshold',
            'undiagnosed-diabetes',
            'sglt2-inhibitor-not-held',
            'glp1-agonist-aspiration-risk',
            'anticoagulation-plan-missing',
            'insufficient-time-to-optimize',
            'active-smoker-major-surgery',
            'alcohol-dependence-risk',
            'high-malnutrition-risk',
            'poor-functional-capacity',
            'severe-frailty',
            'uncontrolled-hypertension',
            'cardiac-optimization-required',
            'respiratory-optimization-required',
            'osa-unassessed',
            'renal-optimization-required',
            'prior-anaesthetic-complication',
            'cognitive-assessment-indicated',
            'sarcopenia-risk',
            'dehydration-aki-risk',
            'rebound-glycaemic-risk',
            'psychological-support-required',
            'social-support-gap',
            'capacity-concern',
            'pregnancy',
            'paediatric',
            'safeguarding',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    domain VARCHAR(30) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX perioperative_optimization_grade_flag_grade_id_index
    ON perioperative_optimization_grade_flag (perioperative_optimization_grade_id);

CREATE INDEX perioperative_optimization_grade_flag_category_index
    ON perioperative_optimization_grade_flag (category);

CREATE TRIGGER trigger_perioperative_optimization_grade_flag_updated_at
    BEFORE UPDATE ON perioperative_optimization_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE perioperative_optimization_grade_flag IS
    'Safety-critical flags that fire independently of the surgical readiness band, with a priority and a suggested action for the perioperative team.';
COMMENT ON COLUMN perioperative_optimization_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN perioperative_optimization_grade_flag.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN perioperative_optimization_grade_flag.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN perioperative_optimization_grade_flag.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN perioperative_optimization_grade_flag.perioperative_optimization_grade_id IS
    'Foreign key to the parent perioperative_optimization_grade table.';
COMMENT ON COLUMN perioperative_optimization_grade_flag.flag_id IS
    'Stable flag identifier, such as F-SGLT2-INHIBITOR-NOT-HELD-001.';
COMMENT ON COLUMN perioperative_optimization_grade_flag.category IS
    'Flag category, such as sglt2-inhibitor-not-held or insufficient-time-to-optimize.';
COMMENT ON COLUMN perioperative_optimization_grade_flag.priority IS
    'Priority: low, medium, or high.';
COMMENT ON COLUMN perioperative_optimization_grade_flag.domain IS
    'Optimization domain the flag relates to, where it belongs to one, so a dashboard can group flags by domain.';
COMMENT ON COLUMN perioperative_optimization_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN perioperative_optimization_grade_flag.suggested_action IS
    'Suggested clinical action, such as "agree a hold-and-restart plan with the prescriber before admission".';
