-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS alcohol_use_disorders_identification_test_consumption;

COMMENT ON SCHEMA alcohol_use_disorders_identification_test_consumption IS
    'Namespace for the Alcohol Use Disorders Identification Test — Consumption (AUDIT-C) form''s tables, functions and domains.';
