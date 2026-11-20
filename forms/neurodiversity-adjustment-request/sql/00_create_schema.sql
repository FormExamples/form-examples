-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS neurodiversity_adjustment_request;

COMMENT ON SCHEMA neurodiversity_adjustment_request IS
    'Namespace for the Neurodiversity Adjustment Request form''s tables, functions and domains.';
