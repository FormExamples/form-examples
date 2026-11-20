-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS epilepsy_review;

COMMENT ON SCHEMA epilepsy_review IS
    'Namespace for the Epilepsy Annual Review form''s tables, functions and domains.';
