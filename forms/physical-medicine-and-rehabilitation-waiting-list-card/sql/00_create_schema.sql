-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS physical_medicine_and_rehabilitation_waiting_list_card;

COMMENT ON SCHEMA physical_medicine_and_rehabilitation_waiting_list_card IS
    'Namespace for the Physical Medicine and Rehabilitation Waiting List Card form''s tables, functions and domains.';
