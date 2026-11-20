-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS hypertension_review;

COMMENT ON SCHEMA hypertension_review IS
    'Namespace for the Hypertension Annual Review form''s tables, functions and domains.';
