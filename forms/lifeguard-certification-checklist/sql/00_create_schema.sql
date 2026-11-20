-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS lifeguard_certification_checklist;

COMMENT ON SCHEMA lifeguard_certification_checklist IS
    'Namespace for the Lifeguard Certification Checklist form''s tables, functions and domains.';
