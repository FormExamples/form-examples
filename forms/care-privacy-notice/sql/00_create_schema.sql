-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS care_privacy_notice;

COMMENT ON SCHEMA care_privacy_notice IS
    'Namespace for the Care Privacy Notice form''s tables, functions and domains.';
