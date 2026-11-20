-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS pre_anaesthesia_assessment;

COMMENT ON SCHEMA pre_anaesthesia_assessment IS
    'Namespace for the Pre-Anaesthesia Assessment form''s tables, functions and domains.';
