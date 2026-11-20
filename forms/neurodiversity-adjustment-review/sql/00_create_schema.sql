-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS neurodiversity_adjustment_review;

COMMENT ON SCHEMA neurodiversity_adjustment_review IS
    'Namespace for the Neurodiversity Adjustment Review form''s tables, functions and domains.';
