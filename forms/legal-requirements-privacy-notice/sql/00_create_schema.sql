-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS legal_requirements_privacy_notice;

COMMENT ON SCHEMA legal_requirements_privacy_notice IS
    'Namespace for the Legal Requirements Privacy Notice form''s tables, functions and domains.';
