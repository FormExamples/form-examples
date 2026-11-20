-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS hospital_performance_indicators;

COMMENT ON SCHEMA hospital_performance_indicators IS
    'Namespace for the Hospital Performance Indicators form''s tables, functions and domains.';
