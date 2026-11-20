-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS partogram;

COMMENT ON SCHEMA partogram IS
    'Namespace for the Partogram (Partograph) form''s tables, functions and domains.';
