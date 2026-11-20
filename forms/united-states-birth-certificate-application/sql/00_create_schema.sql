-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS united_states_birth_certificate_application;

COMMENT ON SCHEMA united_states_birth_certificate_application IS
    'Namespace for the United States Birth Certificate Application form''s tables, functions and domains.';
