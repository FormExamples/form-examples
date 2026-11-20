-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS architecture_decision_record;

COMMENT ON SCHEMA architecture_decision_record IS
    'Namespace for the Architecture Decision Record (Tyree & Akerman) form''s tables, functions and domains.';
