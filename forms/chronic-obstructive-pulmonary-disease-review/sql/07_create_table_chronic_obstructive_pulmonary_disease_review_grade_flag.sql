-- Flags that fire independently of the grades, each with a priority and a
-- suggested action for the clinician or governance team.

CREATE TABLE chronic_obstructive_pulmonary_disease_review_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    chronic_obstructive_pulmonary_disease_review_grade_id UUID NOT NULL
        REFERENCES chronic_obstructive_pulmonary_disease_review_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (category IN (
            'escalate-therapy',
            'smoking-cessation',
            'poor-inhaler-technique',
            'missing-vaccinations',
            'pulmonary-rehab',
            'incomplete',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX chronic_obstructive_pulmonary_disease_review_grade_flag_grade_id_idx
    ON chronic_obstructive_pulmonary_disease_review_grade_flag (chronic_obstructive_pulmonary_disease_review_grade_id);

CREATE TRIGGER trigger_chronic_obstructive_pulmonary_disease_review_grade_flag_updated_at
    BEFORE UPDATE ON chronic_obstructive_pulmonary_disease_review_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE chronic_obstructive_pulmonary_disease_review_grade_flag IS
    'Flags that fire independently of the grades, with priority and a suggested action for the clinician or governance team.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review_grade_flag.chronic_obstructive_pulmonary_disease_review_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-SMOKING-CESSATION-001).';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review_grade_flag.category IS
    'Flag category: escalate-therapy, smoking-cessation, poor-inhaler-technique, missing-vaccinations, pulmonary-rehab, incomplete, or other.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN chronic_obstructive_pulmonary_disease_review_grade_flag.suggested_action IS
    'Suggested clinical or governance action (e.g. "refer to stop-smoking support", "recall for missing vaccinations").';
