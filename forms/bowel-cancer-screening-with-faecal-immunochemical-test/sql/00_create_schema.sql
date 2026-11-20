-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS bowel_cancer_screening_with_faecal_immunochemical_test;

COMMENT ON SCHEMA bowel_cancer_screening_with_faecal_immunochemical_test IS
    'Namespace for the Bowel Cancer Screening with Faecal Immunochemical Test (FIT) form''s tables, functions and domains.';
