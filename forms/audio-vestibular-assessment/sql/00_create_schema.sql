-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS audio_vestibular_assessment;

COMMENT ON SCHEMA audio_vestibular_assessment IS
    'Namespace for the Audio-Vestibular Assessment form''s tables, functions and domains.';
