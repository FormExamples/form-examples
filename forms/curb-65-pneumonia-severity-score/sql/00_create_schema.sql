-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS curb_65_pneumonia_severity_score;

COMMENT ON SCHEMA curb_65_pneumonia_severity_score IS
    'Namespace for the CURB-65 Pneumonia Severity Score form''s tables, functions and domains.';
