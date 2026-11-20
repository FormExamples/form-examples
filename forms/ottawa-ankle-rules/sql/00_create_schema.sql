-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS ottawa_ankle_rules;

COMMENT ON SCHEMA ottawa_ankle_rules IS
    'Namespace for the Ottawa Ankle Rules (and Ottawa Foot Rules) form''s tables, functions and domains.';
