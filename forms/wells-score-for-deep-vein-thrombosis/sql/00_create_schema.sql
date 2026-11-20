-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS wells_score_for_deep_vein_thrombosis;

COMMENT ON SCHEMA wells_score_for_deep_vein_thrombosis IS
    'Namespace for the Wells Score for Deep Vein Thrombosis (DVT) form''s tables, functions and domains.';
