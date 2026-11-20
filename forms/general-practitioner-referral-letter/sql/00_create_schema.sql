-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS general_practitioner_referral_letter;

COMMENT ON SCHEMA general_practitioner_referral_letter IS
    'Namespace for the General Practitioner Referral Letter form''s tables, functions and domains.';
