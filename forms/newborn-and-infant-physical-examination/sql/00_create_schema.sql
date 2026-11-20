-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS newborn_and_infant_physical_examination;

COMMENT ON SCHEMA newborn_and_infant_physical_examination IS
    'Namespace for the Newborn and Infant Physical Examination (NIPE) form''s tables, functions and domains.';
