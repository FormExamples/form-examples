-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS united_kingdom_driver_and_vehicle_licensing_agency_b1_form;

COMMENT ON SCHEMA united_kingdom_driver_and_vehicle_licensing_agency_b1_form IS
    'Namespace for the United Kingdom Driver and Vehicle Licensing Agency B1 Form form''s tables, functions and domains.';
