-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS has_bled_score_for_major_bleeding_risk;

COMMENT ON SCHEMA has_bled_score_for_major_bleeding_risk IS
    'Namespace for the HAS-BLED Score for Major Bleeding Risk form''s tables, functions and domains.';
