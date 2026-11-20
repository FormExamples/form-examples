-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS united_states_property_tax_exemption_application;

COMMENT ON SCHEMA united_states_property_tax_exemption_application IS
    'Namespace for the United States Property Tax Exemption Application form''s tables, functions and domains.';
