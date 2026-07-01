-- Flagged issues that fire independently of the completeness status, with a
-- priority and a suggested action for the AMHP, clinician, or governance team.

CREATE TABLE mental_health_act_assessment_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    mental_health_act_assessment_grade_id UUID NOT NULL
        REFERENCES mental_health_act_assessment_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (category IN (
            'criteria-not-met',
            'missing-second-recommendation',
            's12-doctor-absent',
            'least-restrictive-concern',
            'appropriate-treatment-unavailable',
            'nearest-relative-not-consulted',
            'time-limit-exceeded',
            'no-prior-acquaintance',
            'no-bed-identified',
            'incomplete',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX mental_health_act_assessment_grade_flag_grade_id_idx
    ON mental_health_act_assessment_grade_flag (mental_health_act_assessment_grade_id);

CREATE TRIGGER trigger_mental_health_act_assessment_grade_flag_updated_at
    BEFORE UPDATE ON mental_health_act_assessment_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE mental_health_act_assessment_grade_flag IS
    'Flagged issues that fire independently of the completeness status, with priority and a suggested action for the AMHP, clinician, or governance team.';
COMMENT ON COLUMN mental_health_act_assessment_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN mental_health_act_assessment_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN mental_health_act_assessment_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN mental_health_act_assessment_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN mental_health_act_assessment_grade_flag.mental_health_act_assessment_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN mental_health_act_assessment_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-CRITERIA-NOT-MET-001).';
COMMENT ON COLUMN mental_health_act_assessment_grade_flag.category IS
    'Flag category: criteria-not-met, missing-second-recommendation, s12-doctor-absent, least-restrictive-concern, appropriate-treatment-unavailable, nearest-relative-not-consulted, time-limit-exceeded, no-prior-acquaintance, no-bed-identified, incomplete, or other.';
COMMENT ON COLUMN mental_health_act_assessment_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN mental_health_act_assessment_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN mental_health_act_assessment_grade_flag.suggested_action IS
    'Suggested action (e.g. "obtain a second medical recommendation", "document a less restrictive alternative").';
