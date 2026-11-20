-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS nursing_care_plan;

COMMENT ON SCHEMA nursing_care_plan IS
    'Namespace for the Nursing Care Plan form''s tables, functions and domains.';
