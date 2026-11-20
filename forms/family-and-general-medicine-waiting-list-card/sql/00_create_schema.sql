-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS family_and_general_medicine_waiting_list_card;

COMMENT ON SCHEMA family_and_general_medicine_waiting_list_card IS
    'Namespace for the Family and General Medicine Waiting List Card form''s tables, functions and domains.';
