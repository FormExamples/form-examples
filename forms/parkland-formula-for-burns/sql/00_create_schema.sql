-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS parkland_formula_for_burns;

COMMENT ON SCHEMA parkland_formula_for_burns IS
    'Namespace for the Parkland Formula for Burns form''s tables, functions and domains.';
