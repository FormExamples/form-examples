-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS recognition_of_stroke_in_the_emergency_room;

COMMENT ON SCHEMA recognition_of_stroke_in_the_emergency_room IS
    'Namespace for the Recognition Of Stroke In the Emergency Room (ROSIER) form''s tables, functions and domains.';
