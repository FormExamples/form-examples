-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS ottawa_knee_rule;

COMMENT ON SCHEMA ottawa_knee_rule IS
    'Namespace for the Ottawa Knee Rule form''s tables, functions and domains.';
