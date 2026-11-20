-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS heart_failure_review;

COMMENT ON SCHEMA heart_failure_review IS
    'Namespace for the Heart Failure Annual Review form''s tables, functions and domains.';
