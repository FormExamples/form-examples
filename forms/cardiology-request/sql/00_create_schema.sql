-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS cardiology_request;

COMMENT ON SCHEMA cardiology_request IS
    'Namespace for the Cardiology Request form''s tables, functions and domains.';
