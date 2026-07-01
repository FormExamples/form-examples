-- Flags that fire independently of the risk zone and completeness status, each
-- with a priority and a suggested action for the clinician or governance team.

CREATE TABLE chronic_kidney_disease_review_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    chronic_kidney_disease_review_grade_id UUID NOT NULL
        REFERENCES chronic_kidney_disease_review_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (category IN (
            'very-high-risk-referral',
            'egfr-referral',
            'acr-referral',
            'rapid-decline',
            'hyperkalaemia',
            'anaemia',
            'uncontrolled-bp',
            'nephrotoxic-drug',
            'missing-acr',
            'incomplete',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX chronic_kidney_disease_review_grade_flag_grade_id_idx
    ON chronic_kidney_disease_review_grade_flag (chronic_kidney_disease_review_grade_id);

CREATE TRIGGER trigger_chronic_kidney_disease_review_grade_flag_updated_at
    BEFORE UPDATE ON chronic_kidney_disease_review_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE chronic_kidney_disease_review_grade_flag IS
    'Flags that fire independently of the risk zone and completeness status, with priority and a suggested action for the clinician or governance team.';
COMMENT ON COLUMN chronic_kidney_disease_review_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN chronic_kidney_disease_review_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN chronic_kidney_disease_review_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN chronic_kidney_disease_review_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN chronic_kidney_disease_review_grade_flag.chronic_kidney_disease_review_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN chronic_kidney_disease_review_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-VERY-HIGH-RISK-REFERRAL-001).';
COMMENT ON COLUMN chronic_kidney_disease_review_grade_flag.category IS
    'Flag category: very-high-risk-referral, egfr-referral, acr-referral, rapid-decline, hyperkalaemia, anaemia, uncontrolled-bp, nephrotoxic-drug, missing-acr, incomplete, or other.';
COMMENT ON COLUMN chronic_kidney_disease_review_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN chronic_kidney_disease_review_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN chronic_kidney_disease_review_grade_flag.suggested_action IS
    'Suggested clinical or governance action (e.g. "refer to nephrology", "recheck potassium and review RAAS blockade").';
