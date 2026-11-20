-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS glasgow_coma_scale;

COMMENT ON SCHEMA glasgow_coma_scale IS
    'Namespace for the Glasgow Coma Scale form''s tables, functions and domains.';
