-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS dexa_bone_density_test_request;

COMMENT ON SCHEMA dexa_bone_density_test_request IS
    'Namespace for the DEXA Bone Density Test Request form''s tables, functions and domains.';
