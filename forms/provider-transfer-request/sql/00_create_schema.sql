-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS provider_transfer_request;

COMMENT ON SCHEMA provider_transfer_request IS
    'Namespace for the Provider Transfer Request form''s tables, functions and domains.';
