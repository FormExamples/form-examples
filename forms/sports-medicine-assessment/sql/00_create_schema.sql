-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS sports_medicine_assessment;

COMMENT ON SCHEMA sports_medicine_assessment IS
    'Namespace for the Sports Medicine Assessment form''s tables, functions and domains.';
