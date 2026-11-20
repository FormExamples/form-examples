-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS four_a_test_for_delirium;

COMMENT ON SCHEMA four_a_test_for_delirium IS
    'Namespace for the 4AT — Rapid Delirium and Cognitive-Impairment Screen form''s tables, functions and domains.';
