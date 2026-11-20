-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS otolaryngology_assessment;

COMMENT ON SCHEMA otolaryngology_assessment IS
    'Namespace for the Otolaryngology Assessment form''s tables, functions and domains.';
