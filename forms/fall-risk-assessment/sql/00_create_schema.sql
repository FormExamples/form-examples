-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS fall_risk_assessment;

COMMENT ON SCHEMA fall_risk_assessment IS
    'Namespace for the Fall Risk Assessment form''s tables, functions and domains.';
