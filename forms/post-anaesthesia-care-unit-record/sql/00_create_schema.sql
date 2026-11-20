-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS post_anaesthesia_care_unit_record;

COMMENT ON SCHEMA post_anaesthesia_care_unit_record IS
    'Namespace for the Post-Anaesthesia Care Unit (PACU) Record form''s tables, functions and domains.';
