-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS apgar_score;

COMMENT ON SCHEMA apgar_score IS
    'Namespace for the Apgar Score form''s tables, functions and domains.';
