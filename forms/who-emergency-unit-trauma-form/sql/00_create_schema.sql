-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS who_emergency_unit_trauma_form;

COMMENT ON SCHEMA who_emergency_unit_trauma_form IS
    'Namespace for the WHO Emergency Unit Form: Trauma form''s tables, functions and domains.';
