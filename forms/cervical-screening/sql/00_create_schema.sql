-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS cervical_screening;

COMMENT ON SCHEMA cervical_screening IS
    'Namespace for the Cervical Screening record form''s tables, functions and domains.';
