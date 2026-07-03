CREATE TABLE pre_operative_assessment_by_clinician_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    pre_operative_assessment_by_clinician_grade_id UUID NOT NULL
        REFERENCES pre_operative_assessment_by_clinician_grade(id) ON DELETE CASCADE,
    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (category IN (
            'difficult-airway',
            'severe-cardiac',
            'severe-respiratory',
            'severe-renal',
            'severe-hepatic',
            'severe-anaemia',
            'coagulopathy',
            'uncontrolled-diabetes',
            'severe-frailty',
            'recent-covid-19',
            'fasting-violation',
            'missing-crossmatch',
            'high-risk-medication',
            'capacity-concern',
            'paediatric',
            'pregnancy',
            'safeguarding',
            'malignant-hyperthermia',
            'latex-allergy',
            'sux-apnoea',
            'pseudocholinesterase-deficiency',
            'malnutrition-risk',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_pre_operative_assessment_by_clinician_grade_flag_grade_id
    ON pre_operative_assessment_by_clinician_grade_flag(pre_operative_assessment_by_clinician_grade_id);

CREATE TRIGGER trigger_pre_operative_assessment_by_clinician_grade_flag_updated_at
    BEFORE UPDATE ON pre_operative_assessment_by_clinician_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE pre_operative_assessment_by_clinician_grade_flag IS
    'Safety-critical flags that fire independently of the ASA grade, with priority and a suggested action for the perioperative team.';
COMMENT ON COLUMN pre_operative_assessment_by_clinician_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN pre_operative_assessment_by_clinician_grade_flag.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN pre_operative_assessment_by_clinician_grade_flag.updated_at IS
    'Timestamp when this row was updated most-recently.';
COMMENT ON COLUMN pre_operative_assessment_by_clinician_grade_flag.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN pre_operative_assessment_by_clinician_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-DIFFICULT-AIRWAY-001).';
COMMENT ON COLUMN pre_operative_assessment_by_clinician_grade_flag.category IS
    'Flag category.';
COMMENT ON COLUMN pre_operative_assessment_by_clinician_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN pre_operative_assessment_by_clinician_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN pre_operative_assessment_by_clinician_grade_flag.suggested_action IS
    'Suggested clinical action (e.g. "prepare difficult-airway trolley").';

COMMENT ON COLUMN pre_operative_assessment_by_clinician_grade_flag.pre_operative_assessment_by_clinician_grade_id IS
    'Foreign key to the pre_operative_assessment_by_clinician_grade table.';
