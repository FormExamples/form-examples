-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS hormone_replacement_therapy_assessment;

COMMENT ON SCHEMA hormone_replacement_therapy_assessment IS
    'Namespace for the Hormone Replacement Therapy Assessment form''s tables, functions and domains.';
