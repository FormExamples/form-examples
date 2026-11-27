-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS medical_human_leukocyte_and_disease_association_request;

COMMENT ON SCHEMA medical_human_leukocyte_and_disease_association_request IS
    'Namespace for the Medical Human Leukocyte and Disease Association Request form''s tables, functions and domains.';
