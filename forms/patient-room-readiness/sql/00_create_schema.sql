-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS patient_room_readiness;

COMMENT ON SCHEMA patient_room_readiness IS
    'Namespace for the Patient Room Readiness form''s tables, functions and domains.';
