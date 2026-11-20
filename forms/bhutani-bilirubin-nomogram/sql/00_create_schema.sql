-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS bhutani_bilirubin_nomogram;

COMMENT ON SCHEMA bhutani_bilirubin_nomogram IS
    'Namespace for the Bhutani Bilirubin Nomogram form''s tables, functions and domains.';
