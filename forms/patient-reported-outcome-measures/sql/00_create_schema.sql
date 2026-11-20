-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS patient_reported_outcome_measures;

COMMENT ON SCHEMA patient_reported_outcome_measures IS
    'Namespace for the Patient-Reported Outcome Measures form''s tables, functions and domains.';
