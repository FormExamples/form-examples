-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS electrocardiogram_test_request;

COMMENT ON SCHEMA electrocardiogram_test_request IS
    'Namespace for the Electrocardiogram Test Request form''s tables, functions and domains.';
