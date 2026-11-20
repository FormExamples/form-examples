-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS united_kingdom_vehicle_registration_application;

COMMENT ON SCHEMA united_kingdom_vehicle_registration_application IS
    'Namespace for the United Kingdom Vehicle Registration Application form''s tables, functions and domains.';
