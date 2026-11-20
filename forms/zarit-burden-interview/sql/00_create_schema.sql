-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS zarit_burden_interview;

COMMENT ON SCHEMA zarit_burden_interview IS
    'Namespace for the Zarit Burden Interview (ZBI) form''s tables, functions and domains.';
