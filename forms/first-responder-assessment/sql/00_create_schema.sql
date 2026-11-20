-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS first_responder_assessment;

COMMENT ON SCHEMA first_responder_assessment IS
    'Namespace for the First Responder Assessment form''s tables, functions and domains.';
