-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS united_states_social_security_card_application;

COMMENT ON SCHEMA united_states_social_security_card_application IS
    'Namespace for the United States Social Security Card Application (Form SS-5) form''s tables, functions and domains.';
