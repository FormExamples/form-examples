-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS edinburgh_postnatal_depression_scale;

COMMENT ON SCHEMA edinburgh_postnatal_depression_scale IS
    'Namespace for the Edinburgh Postnatal Depression Scale (EPDS) form''s tables, functions and domains.';
