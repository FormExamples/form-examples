-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request;

COMMENT ON SCHEMA medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request IS
    'Namespace for the Medical Haematopoietic Stem Cell Transplant Patients/Donors HLA Typing Request form''s tables, functions and domains.';
