-- Red-flag issues that fire alongside the MELD score, with priority and
-- a suggested action for the clinical team.

CREATE TABLE model_for_end_stage_liver_disease_score_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    model_for_end_stage_liver_disease_score_grade_id UUID NOT NULL
        REFERENCES model_for_end_stage_liver_disease_score_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (category IN (
            'transplant-referral',
            'urgent-review',
            'on-dialysis',
            'hyponatraemia',
            'coagulopathy',
            'incomplete',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX model_for_end_stage_liver_disease_score_grade_flag_grade_id_idx
    ON model_for_end_stage_liver_disease_score_grade_flag (model_for_end_stage_liver_disease_score_grade_id);

CREATE TRIGGER trigger_model_for_end_stage_liver_disease_score_grade_flag_updated_at
    BEFORE UPDATE ON model_for_end_stage_liver_disease_score_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE model_for_end_stage_liver_disease_score_grade_flag IS
    'Red-flag issues that fire alongside the MELD score, with priority and a suggested action for the clinical team.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score_grade_flag.model_for_end_stage_liver_disease_score_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-TRANSPLANT-REFERRAL-001).';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score_grade_flag.category IS
    'Flag category: transplant-referral, urgent-review, on-dialysis, hyponatraemia, coagulopathy, incomplete, or other.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score_grade_flag.suggested_action IS
    'Suggested clinical action (e.g. "discuss with a transplant centre").';
