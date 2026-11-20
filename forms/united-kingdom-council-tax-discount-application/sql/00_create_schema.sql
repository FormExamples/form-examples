-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS united_kingdom_council_tax_discount_application;

COMMENT ON SCHEMA united_kingdom_council_tax_discount_application IS
    'Namespace for the United Kingdom Council Tax Discount Application form''s tables, functions and domains.';
