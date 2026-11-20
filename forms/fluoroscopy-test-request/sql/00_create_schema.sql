-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS fluoroscopy_test_request;

COMMENT ON SCHEMA fluoroscopy_test_request IS
    'Namespace for the Fluoroscopy Test Request form''s tables, functions and domains.';
