-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS united_states_standard_certificate_of_death;

COMMENT ON SCHEMA united_states_standard_certificate_of_death IS
    'Namespace for the US Standard Certificate of Death (NCHS 2003 revision) form''s tables, functions and domains.';
