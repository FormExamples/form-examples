-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS cha2ds2_vasc_score_for_atrial_fibrillation_stroke_risk;

COMMENT ON SCHEMA cha2ds2_vasc_score_for_atrial_fibrillation_stroke_risk IS
    'Namespace for the CHA2DS2-VASc Score for Atrial Fibrillation Stroke Risk form''s tables, functions and domains.';
