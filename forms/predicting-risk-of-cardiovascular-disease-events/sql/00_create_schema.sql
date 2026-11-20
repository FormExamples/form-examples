-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS predicting_risk_of_cardiovascular_disease_events;

COMMENT ON SCHEMA predicting_risk_of_cardiovascular_disease_events IS
    'Namespace for the Predicting Risk of Cardiovascular Disease Events (PREVENT) form''s tables, functions and domains.';
