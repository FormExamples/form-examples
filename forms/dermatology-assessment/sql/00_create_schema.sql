-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS dermatology_assessment;

COMMENT ON SCHEMA dermatology_assessment IS
    'Namespace for the Dermatology Assessment form''s tables, functions and domains.';
