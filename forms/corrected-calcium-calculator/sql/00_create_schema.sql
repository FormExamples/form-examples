-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS corrected_calcium_calculator;

COMMENT ON SCHEMA corrected_calcium_calculator IS
    'Namespace for the Corrected Calcium Calculator form''s tables, functions and domains.';
