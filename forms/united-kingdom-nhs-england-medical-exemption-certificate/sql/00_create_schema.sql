-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS united_kingdom_nhs_england_medical_exemption_certificate;

COMMENT ON SCHEMA united_kingdom_nhs_england_medical_exemption_certificate IS
    'Namespace for the UK NHS England Medical Exemption Certificate (FP92A) form''s tables, functions and domains.';
