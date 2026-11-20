-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS glasgow_blatchford_bleeding_score;

COMMENT ON SCHEMA glasgow_blatchford_bleeding_score IS
    'Namespace for the Glasgow-Blatchford Bleeding Score (GBS) form''s tables, functions and domains.';
