-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS bone_marrow_donation_assessment;

COMMENT ON SCHEMA bone_marrow_donation_assessment IS
    'Namespace for the Bone Marrow Donation Assessment form''s tables, functions and domains.';
