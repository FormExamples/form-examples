-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS pulmonary_embolism_rule_out_criteria;

COMMENT ON SCHEMA pulmonary_embolism_rule_out_criteria IS
    'Namespace for the Pulmonary Embolism Rule-out Criteria (PERC) form''s tables, functions and domains.';
