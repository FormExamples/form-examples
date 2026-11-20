-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS eye_vision_test_request;

COMMENT ON SCHEMA eye_vision_test_request IS
    'Namespace for the Eye Vision Test Request form''s tables, functions and domains.';
