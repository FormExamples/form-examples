-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS newborn_blood_spot_screening;

COMMENT ON SCHEMA newborn_blood_spot_screening IS
    'Namespace for the Newborn Blood Spot Screening form''s tables, functions and domains.';
