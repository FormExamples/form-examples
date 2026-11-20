-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS casualty_card_form;

COMMENT ON SCHEMA casualty_card_form IS
    'Namespace for the Casualty Card Form form''s tables, functions and domains.';
