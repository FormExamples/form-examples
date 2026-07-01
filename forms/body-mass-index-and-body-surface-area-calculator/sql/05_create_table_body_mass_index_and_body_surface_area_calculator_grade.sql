-- Computed anthropometry result. Stores the body mass index and its WHO adult
-- weight-status category, plus both body-surface-area values (Mosteller and
-- Du Bois), 1:1 with the parent calculation record.

CREATE TABLE body_mass_index_and_body_surface_area_calculator_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    body_mass_index_and_body_surface_area_calculator_id UUID NOT NULL UNIQUE
        REFERENCES body_mass_index_and_body_surface_area_calculator(id) ON DELETE CASCADE,

    bmi NUMERIC(6,3),
    bmi_category VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (bmi_category IN ('underweight', 'normal', 'overweight', 'obese-class-1', 'obese-class-2', 'obese-class-3', '')),
    bsa_mosteller NUMERIC(5,3),
    bsa_du_bois NUMERIC(5,3),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_body_mass_index_and_body_surface_area_calculator_grade_updated_at
    BEFORE UPDATE ON body_mass_index_and_body_surface_area_calculator_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE body_mass_index_and_body_surface_area_calculator_grade IS
    'Computed anthropometry result: body mass index and its WHO adult weight-status category, plus both body-surface-area values (1:1 with the parent calculation record).';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator_grade.body_mass_index_and_body_surface_area_calculator_id IS
    'Foreign key to the parent calculation record (unique, 1:1).';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator_grade.bmi IS
    'Body mass index in kg/m^2 at full precision (null when either input is missing); rounded to 1 decimal place for display.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator_grade.bmi_category IS
    'WHO adult weight-status category: underweight, normal, overweight, obese-class-1, obese-class-2, or obese-class-3.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator_grade.bsa_mosteller IS
    'Body surface area in m^2 by the Mosteller formula (null when either input is missing).';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator_grade.bsa_du_bois IS
    'Body surface area in m^2 by the Du Bois formula (null when either input is missing).';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator_grade.graded_at IS
    'Timestamp when the engine last computed the result.';
