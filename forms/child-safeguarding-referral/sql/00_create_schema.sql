-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS child_safeguarding_referral;

COMMENT ON SCHEMA child_safeguarding_referral IS
    'Namespace for the Child Safeguarding Referral form''s tables, functions and domains.';
