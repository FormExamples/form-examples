-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS outpatient_outcome;

COMMENT ON SCHEMA outpatient_outcome IS
    'Namespace for the Outpatient Outcome Report form''s tables, functions and domains.';
