-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS waterlow_pressure_ulcer_risk_assessment;

COMMENT ON SCHEMA waterlow_pressure_ulcer_risk_assessment IS
    'Namespace for the Waterlow Pressure Ulcer Risk Assessment form''s tables, functions and domains.';
