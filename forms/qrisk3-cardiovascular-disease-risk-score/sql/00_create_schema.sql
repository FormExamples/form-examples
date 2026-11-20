-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS qrisk3_cardiovascular_disease_risk_score;

COMMENT ON SCHEMA qrisk3_cardiovascular_disease_risk_score IS
    'Namespace for the QRISK3 Cardiovascular Disease Risk Score form''s tables, functions and domains.';
