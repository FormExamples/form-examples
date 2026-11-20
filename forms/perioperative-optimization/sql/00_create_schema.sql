-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS perioperative_optimization;

COMMENT ON SCHEMA perioperative_optimization IS
    'Namespace for the Perioperative Optimization form''s tables, functions and domains.';
