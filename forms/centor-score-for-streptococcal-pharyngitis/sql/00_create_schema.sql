-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS centor_score_for_streptococcal_pharyngitis;

COMMENT ON SCHEMA centor_score_for_streptococcal_pharyngitis IS
    'Namespace for the Centor Score for Streptococcal Pharyngitis form''s tables, functions and domains.';
