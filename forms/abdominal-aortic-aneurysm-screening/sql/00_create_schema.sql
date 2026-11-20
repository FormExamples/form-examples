-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS abdominal_aortic_aneurysm_screening;

COMMENT ON SCHEMA abdominal_aortic_aneurysm_screening IS
    'Namespace for the Abdominal Aortic Aneurysm (AAA) Screening form''s tables, functions and domains.';
