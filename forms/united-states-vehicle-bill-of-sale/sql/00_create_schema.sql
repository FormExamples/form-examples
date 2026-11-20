-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS united_states_vehicle_bill_of_sale;

COMMENT ON SCHEMA united_states_vehicle_bill_of_sale IS
    'Namespace for the United States Vehicle Bill of Sale form''s tables, functions and domains.';
