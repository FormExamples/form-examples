-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS timi_risk_score_for_acute_coronary_syndrome;

COMMENT ON SCHEMA timi_risk_score_for_acute_coronary_syndrome IS
    'Namespace for the TIMI Risk Score for Acute Coronary Syndrome (UA/NSTEMI) form''s tables, functions and domains.';
