-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS history_and_physical_examination;

COMMENT ON SCHEMA history_and_physical_examination IS
    'Namespace for the History and Physical Examination (H&P) form''s tables, functions and domains.';
