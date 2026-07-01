-- Safety flags that fire independently of the result class, each with a
-- priority and a suggested action for the reviewing clinician or screening
-- service.

CREATE TABLE bowel_cancer_screening_fit_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    bowel_cancer_screening_fit_grade_id UUID NOT NULL
        REFERENCES bowel_cancer_screening_fit_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (category IN (
            'positive-colonoscopy-referral',
            'symptomatic-suspected-cancer',
            'non-return',
            'spoilt-kit',
            'incomplete',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX bowel_cancer_screening_fit_grade_flag_grade_id_idx
    ON bowel_cancer_screening_fit_grade_flag (bowel_cancer_screening_fit_grade_id);

CREATE TRIGGER trigger_bowel_cancer_screening_fit_grade_flag_updated_at
    BEFORE UPDATE ON bowel_cancer_screening_fit_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE bowel_cancer_screening_fit_grade_flag IS
    'Safety flags that fire independently of the result class, with priority and a suggested action for the reviewing clinician or screening service.';
COMMENT ON COLUMN bowel_cancer_screening_fit_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN bowel_cancer_screening_fit_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN bowel_cancer_screening_fit_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN bowel_cancer_screening_fit_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN bowel_cancer_screening_fit_grade_flag.bowel_cancer_screening_fit_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN bowel_cancer_screening_fit_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-POSITIVE-COLONOSCOPY-001).';
COMMENT ON COLUMN bowel_cancer_screening_fit_grade_flag.category IS
    'Flag category: positive-colonoscopy-referral, symptomatic-suspected-cancer, non-return, spoilt-kit, incomplete, or other.';
COMMENT ON COLUMN bowel_cancer_screening_fit_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN bowel_cancer_screening_fit_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN bowel_cancer_screening_fit_grade_flag.suggested_action IS
    'Suggested clinical or service action (e.g. "refer for colonoscopy", "reissue FIT kit").';
