-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS return_to_work;

COMMENT ON SCHEMA return_to_work IS
    'Namespace for the Return to Work form''s tables, functions and domains.';
