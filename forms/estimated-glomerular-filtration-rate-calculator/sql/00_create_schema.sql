-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS estimated_glomerular_filtration_rate_calculator;

COMMENT ON SCHEMA estimated_glomerular_filtration_rate_calculator IS
    'Namespace for the Estimated Glomerular Filtration Rate (eGFR) Calculator form''s tables, functions and domains.';
