-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS pet_scan_test_request;

COMMENT ON SCHEMA pet_scan_test_request IS
    'Namespace for the PET Scan Test Request form''s tables, functions and domains.';
