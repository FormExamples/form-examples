-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS dyslexia_assessment;

COMMENT ON SCHEMA dyslexia_assessment IS
    'Namespace for the Dyslexia Assessment form''s tables, functions and domains.';
