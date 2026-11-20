-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS body_mass_index_and_body_surface_area_calculator;

COMMENT ON SCHEMA body_mass_index_and_body_surface_area_calculator IS
    'Namespace for the Body Mass Index and Body Surface Area Calculator form''s tables, functions and domains.';
