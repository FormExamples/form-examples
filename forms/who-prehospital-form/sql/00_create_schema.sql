-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS who_prehospital_form;

COMMENT ON SCHEMA who_prehospital_form IS
    'Namespace for the WHO Prehospital Form form''s tables, functions and domains.';
