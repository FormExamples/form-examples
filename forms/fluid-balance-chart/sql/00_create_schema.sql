-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS fluid_balance_chart;

COMMENT ON SCHEMA fluid_balance_chart IS
    'Namespace for the Fluid Balance Chart form''s tables, functions and domains.';
