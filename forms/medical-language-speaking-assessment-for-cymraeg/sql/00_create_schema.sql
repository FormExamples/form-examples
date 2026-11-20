-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS medical_language_speaking_assessment_for_cymraeg;

COMMENT ON SCHEMA medical_language_speaking_assessment_for_cymraeg IS
    'Namespace for the Medical Language Speaking Assessment for Cymraeg form''s tables, functions and domains.';
