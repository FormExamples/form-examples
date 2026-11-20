-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS neurodiversity_adjustment_response;

COMMENT ON SCHEMA neurodiversity_adjustment_response IS
    'Namespace for the Neurodiversity Adjustment Response form''s tables, functions and domains.';
