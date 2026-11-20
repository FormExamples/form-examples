-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS uk_nhs_digital_technology_assessment_criteria;

COMMENT ON SCHEMA uk_nhs_digital_technology_assessment_criteria IS
    'Namespace for the UK NHS Digital Technology Assessment Criteria (DTAC) form''s tables, functions and domains.';
