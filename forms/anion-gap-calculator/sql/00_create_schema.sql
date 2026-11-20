-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS anion_gap_calculator;

COMMENT ON SCHEMA anion_gap_calculator IS
    'Namespace for the Anion Gap Calculator form''s tables, functions and domains.';
