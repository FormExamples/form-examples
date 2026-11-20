-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS united_states_health_care_power_of_attorney;

COMMENT ON SCHEMA united_states_health_care_power_of_attorney IS
    'Namespace for the United States Health Care Power of Attorney form''s tables, functions and domains.';
