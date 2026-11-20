-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS rockall_score_for_upper_gastrointestinal_bleeding;

COMMENT ON SCHEMA rockall_score_for_upper_gastrointestinal_bleeding IS
    'Namespace for the Rockall Score for Upper Gastrointestinal Bleeding form''s tables, functions and domains.';
