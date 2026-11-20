-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS breast_screening;

COMMENT ON SCHEMA breast_screening IS
    'Namespace for the Breast Screening Record (NHS Breast Screening Programme) form''s tables, functions and domains.';
