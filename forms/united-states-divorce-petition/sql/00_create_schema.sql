-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS united_states_divorce_petition;

COMMENT ON SCHEMA united_states_divorce_petition IS
    'Namespace for the United States Divorce Petition form''s tables, functions and domains.';
