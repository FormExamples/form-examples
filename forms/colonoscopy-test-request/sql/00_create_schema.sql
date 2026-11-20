-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS colonoscopy_test_request;

COMMENT ON SCHEMA colonoscopy_test_request IS
    'Namespace for the Colonoscopy Test Request form''s tables, functions and domains.';
