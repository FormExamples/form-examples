-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS first_aid_training_checklist;

COMMENT ON SCHEMA first_aid_training_checklist IS
    'Namespace for the First Aid Training Checklist form''s tables, functions and domains.';
