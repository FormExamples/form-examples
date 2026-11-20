-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS allergy_assessment;

COMMENT ON SCHEMA allergy_assessment IS
    'Namespace for the Allergy Assessment form''s tables, functions and domains.';
