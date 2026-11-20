-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS recommended_summary_plan_for_emergency_care_and_treatment;

COMMENT ON SCHEMA recommended_summary_plan_for_emergency_care_and_treatment IS
    'Namespace for the Recommended Summary Plan for Emergency Care and Treatment (ReSPECT) form''s tables, functions and domains.';
