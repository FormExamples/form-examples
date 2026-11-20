-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS x_ray_test_result;

COMMENT ON SCHEMA x_ray_test_result IS
    'Namespace for the X-Ray Test Result form''s tables, functions and domains.';
