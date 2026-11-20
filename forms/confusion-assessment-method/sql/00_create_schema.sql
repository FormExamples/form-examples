-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS confusion_assessment_method;

COMMENT ON SCHEMA confusion_assessment_method IS
    'Namespace for the Confusion Assessment Method (CAM) form''s tables, functions and domains.';
