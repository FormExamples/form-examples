-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS ward_round_note;

COMMENT ON SCHEMA ward_round_note IS
    'Namespace for the Ward Round Note form''s tables, functions and domains.';
