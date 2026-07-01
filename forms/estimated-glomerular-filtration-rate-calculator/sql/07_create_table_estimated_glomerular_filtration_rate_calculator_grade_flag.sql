-- Safety-critical flags that fire independently of the CKD G-stage, with a
-- priority and a suggested action for the assessing clinician.

CREATE TABLE estimated_glomerular_filtration_rate_calculator_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    estimated_glomerular_filtration_rate_calculator_grade_id UUID NOT NULL
        REFERENCES estimated_glomerular_filtration_rate_calculator_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (category IN (
            'g5-nephrology-referral',
            'g4-nephrology-referral',
            'drug-dosing-review',
            'acute-drop-aki',
            'reduced-function',
            'confirm-ckd',
            'incomplete',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX estimated_glomerular_filtration_rate_calculator_grade_flag_grade_id_idx
    ON estimated_glomerular_filtration_rate_calculator_grade_flag (estimated_glomerular_filtration_rate_calculator_grade_id);

CREATE TRIGGER trigger_estimated_glomerular_filtration_rate_calculator_grade_flag_updated_at
    BEFORE UPDATE ON estimated_glomerular_filtration_rate_calculator_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE estimated_glomerular_filtration_rate_calculator_grade_flag IS
    'Safety-critical flags that fire independently of the CKD G-stage, with priority and a suggested action for the assessing clinician.';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator_grade_flag.estimated_glomerular_filtration_rate_calculator_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-G5-NEPHROLOGY-REFERRAL-001).';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator_grade_flag.category IS
    'Flag category: g5-nephrology-referral, g4-nephrology-referral, drug-dosing-review, acute-drop-aki, reduced-function, confirm-ckd, incomplete, or other.';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator_grade_flag.suggested_action IS
    'Suggested clinical action (e.g. "refer to nephrology per NICE NG203").';
