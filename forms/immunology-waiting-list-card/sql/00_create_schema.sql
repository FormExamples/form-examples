-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS immunology_waiting_list_card;

COMMENT ON SCHEMA immunology_waiting_list_card IS
    'Namespace for the Immunology Waiting List Card form''s tables, functions and domains.';
