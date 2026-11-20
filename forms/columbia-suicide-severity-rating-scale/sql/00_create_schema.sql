-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS columbia_suicide_severity_rating_scale;

COMMENT ON SCHEMA columbia_suicide_severity_rating_scale IS
    'Namespace for the Columbia Suicide Severity Rating Scale (C-SSRS) form''s tables, functions and domains.';
