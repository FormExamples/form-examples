-- Flags that fire independently of the control class and completeness status,
-- each with a priority and a suggested action for the clinician or governance
-- team.

CREATE TABLE hypertension_review_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    hypertension_review_grade_id UUID NOT NULL
        REFERENCES hypertension_review_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (category IN (
            'severe-hypertension',
            'uncontrolled-bp',
            'missing-bloods',
            'missing-acr',
            'high-cv-risk-untreated',
            'adherence-concern',
            'postural-drop',
            'incomplete',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX hypertension_review_grade_flag_grade_id_idx
    ON hypertension_review_grade_flag (hypertension_review_grade_id);

CREATE TRIGGER trigger_hypertension_review_grade_flag_updated_at
    BEFORE UPDATE ON hypertension_review_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE hypertension_review_grade_flag IS
    'Flags that fire independently of the control class and completeness status, with priority and a suggested action for the clinician or governance team.';
COMMENT ON COLUMN hypertension_review_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN hypertension_review_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN hypertension_review_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN hypertension_review_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN hypertension_review_grade_flag.hypertension_review_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN hypertension_review_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-SEVERE-HYPERTENSION-001).';
COMMENT ON COLUMN hypertension_review_grade_flag.category IS
    'Flag category: severe-hypertension, uncontrolled-bp, missing-bloods, missing-acr, high-cv-risk-untreated, adherence-concern, postural-drop, incomplete, or other.';
COMMENT ON COLUMN hypertension_review_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN hypertension_review_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN hypertension_review_grade_flag.suggested_action IS
    'Suggested clinical or governance action (e.g. "arrange same-day assessment", "step up antihypertensive medication").';
