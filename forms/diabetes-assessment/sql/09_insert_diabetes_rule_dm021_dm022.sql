-- Seed the two additional diabetes rules for pre-proliferative retinopathy
-- and diabetic maculopathy, closing a real, verified rule-coverage gap:
-- `diabetes_rule` (05_create_table_diabetes_rule.sql) previously seeded only
-- 20 rows (DM-001 to DM-020) and had no dedicated rule for either
-- `retinopathyStatus` value, even though both are real, sight-threatening
-- findings distinct from 'background' (DM-008) and 'proliferative' (DM-004).
-- Both are graded 'high' concern, matching DM-004: per the National
-- Diabetic Eye Screening Programme's R1/R2/R3 grading and NICE NG28,
-- pre-proliferative (R2) and maculopathy (M1) both warrant the same urgent
-- ophthalmology referral pathway as proliferative retinopathy (R3), not the
-- routine annual re-screening that 'background' (R1) warrants.
INSERT INTO diabetes_rule (code, category, description, concern_level) VALUES
    ('DM-021', 'Eye', 'Pre-proliferative retinopathy detected', 'high'),
    ('DM-022', 'Eye', 'Diabetic maculopathy detected', 'high');

COMMENT ON TABLE diabetes_rule IS
    'Reference catalogue of all 22 diabetes assessment rules (DM-001 to DM-022). Seeded at deployment.';
