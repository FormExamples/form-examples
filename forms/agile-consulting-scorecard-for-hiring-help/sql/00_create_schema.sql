-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS agile_consulting_scorecard_for_hiring_help;

COMMENT ON SCHEMA agile_consulting_scorecard_for_hiring_help IS
    'Namespace for the Agile consulting scorecard for hiring help form''s tables, functions and domains.';
