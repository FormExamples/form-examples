-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS clinical_neurophysiology_waiting_list_card;

COMMENT ON SCHEMA clinical_neurophysiology_waiting_list_card IS
    'Namespace for the Clinical Neurophysiology Waiting List Card form''s tables, functions and domains.';
