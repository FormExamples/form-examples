-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS research_and_planning_privacy_notice;

COMMENT ON SCHEMA research_and_planning_privacy_notice IS
    'Namespace for the Research and Planning Privacy Notice form''s tables, functions and domains.';
