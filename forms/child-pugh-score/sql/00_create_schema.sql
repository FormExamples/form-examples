-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS child_pugh_score;

COMMENT ON SCHEMA child_pugh_score IS
    'Namespace for the Child-Pugh Score (Child-Turcotte-Pugh) form''s tables, functions and domains.';
