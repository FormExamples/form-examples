-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS cardiopulmonary_resuscitation_training;

COMMENT ON SCHEMA cardiopulmonary_resuscitation_training IS
    'Namespace for the Cardiopulmonary Resuscitation Training form''s tables, functions and domains.';
