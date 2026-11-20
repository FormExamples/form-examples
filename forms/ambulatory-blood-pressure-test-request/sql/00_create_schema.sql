-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS ambulatory_blood_pressure_test_request;

COMMENT ON SCHEMA ambulatory_blood_pressure_test_request IS
    'Namespace for the Ambulatory Blood Pressure Test Request form''s tables, functions and domains.';
