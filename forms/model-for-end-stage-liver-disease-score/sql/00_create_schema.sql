-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS model_for_end_stage_liver_disease_score;

COMMENT ON SCHEMA model_for_end_stage_liver_disease_score IS
    'Namespace for the Model for End-Stage Liver Disease (MELD) Score form''s tables, functions and domains.';
