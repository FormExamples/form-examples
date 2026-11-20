-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS who_acute_referral_form;

COMMENT ON SCHEMA who_acute_referral_form IS
    'Namespace for the WHO Acute Referral Form form''s tables, functions and domains.';
