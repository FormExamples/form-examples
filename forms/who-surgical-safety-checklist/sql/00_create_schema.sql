-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS who_surgical_safety_checklist;

COMMENT ON SCHEMA who_surgical_safety_checklist IS
    'Namespace for the WHO Surgical Safety Checklist form''s tables, functions and domains.';
