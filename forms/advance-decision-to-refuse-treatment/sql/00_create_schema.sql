-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS advance_decision_to_refuse_treatment;

COMMENT ON SCHEMA advance_decision_to_refuse_treatment IS
    'Namespace for the Advance Decision to Refuse Treatment form''s tables, functions and domains.';
