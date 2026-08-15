-- Safety-critical flags that fire independently of the risk band, with a
-- priority and a suggested action. Flags are never suppressed by an
-- assessor override of the risk band.

CREATE TABLE health_screening_questionnaire_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    health_screening_questionnaire_grade_id UUID NOT NULL
        REFERENCES health_screening_questionnaire_grade(id) ON DELETE CASCADE,
    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(45) NOT NULL DEFAULT ''
        CHECK (category IN (
            'urgent-cardiac-symptom',
            'parq-positive-medical-clearance-needed',
            'alcohol-higher-risk',
            'family-history-premature-cardiac-event',
            'unexplained-weight-loss',
            'occupational-restriction-indicated',
            'vaccination-gap',
            'paediatric',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX health_screening_questionnaire_grade_flag_grade_id_index
    ON health_screening_questionnaire_grade_flag (health_screening_questionnaire_grade_id);

CREATE TRIGGER trigger_health_screening_questionnaire_grade_flag_updated_at
    BEFORE UPDATE ON health_screening_questionnaire_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE health_screening_questionnaire_grade_flag IS
    'Safety-critical flags that fire independently of the risk band, with a priority and a suggested action. Flags are never suppressed by an assessor override.';
COMMENT ON COLUMN health_screening_questionnaire_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN health_screening_questionnaire_grade_flag.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN health_screening_questionnaire_grade_flag.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN health_screening_questionnaire_grade_flag.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN health_screening_questionnaire_grade_flag.health_screening_questionnaire_grade_id IS
    'Foreign key to the parent health_screening_questionnaire_grade table.';
COMMENT ON COLUMN health_screening_questionnaire_grade_flag.flag_id IS
    'Stable flag identifier, such as F-URGENT-CARDIAC-SYMPTOM-001.';
COMMENT ON COLUMN health_screening_questionnaire_grade_flag.category IS
    'Flag category, such as urgent-cardiac-symptom or parq-positive-medical-clearance-needed.';
COMMENT ON COLUMN health_screening_questionnaire_grade_flag.priority IS
    'Priority: low, medium, or high.';
COMMENT ON COLUMN health_screening_questionnaire_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN health_screening_questionnaire_grade_flag.suggested_action IS
    'Suggested action, such as "same-day GP or emergency review".';
