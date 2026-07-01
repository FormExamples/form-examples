-- Safety-critical flags that fire independently of the BMI category, with a
-- priority and a suggested action for the recording clinician.

CREATE TABLE body_mass_index_and_body_surface_area_calculator_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    body_mass_index_and_body_surface_area_calculator_grade_id UUID NOT NULL
        REFERENCES body_mass_index_and_body_surface_area_calculator_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (category IN (
            'severe-obesity',
            'underweight',
            'extreme-value',
            'asian-high-risk',
            'asian-increased-risk',
            'incomplete',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX body_mass_index_and_body_surface_area_calculator_grade_flag_grade_id_idx
    ON body_mass_index_and_body_surface_area_calculator_grade_flag (body_mass_index_and_body_surface_area_calculator_grade_id);

CREATE TRIGGER trigger_body_mass_index_and_body_surface_area_calculator_grade_flag_updated_at
    BEFORE UPDATE ON body_mass_index_and_body_surface_area_calculator_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE body_mass_index_and_body_surface_area_calculator_grade_flag IS
    'Safety-critical flags that fire independently of the BMI category, with priority and a suggested action for the recording clinician.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator_grade_flag.body_mass_index_and_body_surface_area_calculator_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-SEVERE-OBESITY-001).';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator_grade_flag.category IS
    'Flag category: severe-obesity, underweight, extreme-value, asian-high-risk, asian-increased-risk, incomplete, or other.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator_grade_flag.suggested_action IS
    'Suggested clinical action (e.g. "consider specialist weight-management referral").';
