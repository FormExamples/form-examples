-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS hospital_discharge;

COMMENT ON SCHEMA hospital_discharge IS
    'Namespace for the Hospital Discharge form''s tables, functions and domains.';
