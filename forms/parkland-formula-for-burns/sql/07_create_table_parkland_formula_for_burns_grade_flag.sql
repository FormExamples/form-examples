-- Safety-critical red flags that fire independently of the arithmetic, with a
-- priority and a suggested action for the assessing clinician.

CREATE TABLE parkland_formula_for_burns_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    parkland_formula_for_burns_grade_id UUID NOT NULL
        REFERENCES parkland_formula_for_burns_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (category IN (
            'major-burn-referral',
            'inhalation-airway',
            'escharotomy',
            'resuscitation-overdue',
            'titrate-to-urine-output',
            'special-mechanism',
            'incomplete',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX parkland_formula_for_burns_grade_flag_grade_id_idx
    ON parkland_formula_for_burns_grade_flag (parkland_formula_for_burns_grade_id);

CREATE TRIGGER trigger_parkland_formula_for_burns_grade_flag_updated_at
    BEFORE UPDATE ON parkland_formula_for_burns_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE parkland_formula_for_burns_grade_flag IS
    'Safety-critical red flags that fire independently of the arithmetic, with priority and a suggested action for the assessing clinician.';
COMMENT ON COLUMN parkland_formula_for_burns_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN parkland_formula_for_burns_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN parkland_formula_for_burns_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN parkland_formula_for_burns_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN parkland_formula_for_burns_grade_flag.parkland_formula_for_burns_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN parkland_formula_for_burns_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-MAJOR-BURN-REFERRAL-001).';
COMMENT ON COLUMN parkland_formula_for_burns_grade_flag.category IS
    'Flag category: major-burn-referral, inhalation-airway, escharotomy, resuscitation-overdue, titrate-to-urine-output, special-mechanism, incomplete, or other.';
COMMENT ON COLUMN parkland_formula_for_burns_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN parkland_formula_for_burns_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN parkland_formula_for_burns_grade_flag.suggested_action IS
    'Suggested clinical action (e.g. "refer to a specialist burns service and commence formal resuscitation").';
