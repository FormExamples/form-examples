-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS post_operative_report;

COMMENT ON SCHEMA post_operative_report IS
    'Namespace for the Post-Operative Report form''s tables, functions and domains.';
