-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS medical_information_form_for_air_travel;

COMMENT ON SCHEMA medical_information_form_for_air_travel IS
    'Namespace for the Medical Information Form for Air Travel (MEDIF) form''s tables, functions and domains.';
