-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS screening_program_privacy_notice;

COMMENT ON SCHEMA screening_program_privacy_notice IS
    'Namespace for the Screening Program Privacy Notice form''s tables, functions and domains.';
