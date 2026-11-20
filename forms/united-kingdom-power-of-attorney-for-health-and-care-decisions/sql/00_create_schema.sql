-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS united_kingdom_power_of_attorney_for_health_and_care_decisions;

COMMENT ON SCHEMA united_kingdom_power_of_attorney_for_health_and_care_decisions IS
    'Namespace for the United Kingdom Lasting Power of Attorney for Health and Care Decisions form''s tables, functions and domains.';
