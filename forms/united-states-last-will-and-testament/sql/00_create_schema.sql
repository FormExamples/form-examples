-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS united_states_last_will_and_testament;

COMMENT ON SCHEMA united_states_last_will_and_testament IS
    'Namespace for the United States Last Will and Testament form''s tables, functions and domains.';
