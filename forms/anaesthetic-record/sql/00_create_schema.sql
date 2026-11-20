-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS anaesthetic_record;

COMMENT ON SCHEMA anaesthetic_record IS
    'Namespace for the Anaesthetic Record form''s tables, functions and domains.';
