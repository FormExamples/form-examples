ALTER TABLE "grading_additional_flags" DROP CONSTRAINT IF EXISTS "grading_additional_flags_priority_check";
ALTER TABLE "grading_fired_rules" DROP CONSTRAINT IF EXISTS "grading_fired_rules_rule_concern_level_check";
ALTER TABLE "grades" DROP CONSTRAINT IF EXISTS "grades_control_score_check";
ALTER TABLE "grades" DROP CONSTRAINT IF EXISTS "grades_control_level_check";
ALTER TABLE "diabetes_rules" DROP CONSTRAINT IF EXISTS "diabetes_rules_concern_level_check";
ALTER TABLE "assessments" DROP CONSTRAINT IF EXISTS "assessments_status_check";
ALTER TABLE "clinicians" DROP CONSTRAINT IF EXISTS "clinicians_registration_body_check";
ALTER TABLE "clinicians" DROP CONSTRAINT IF EXISTS "clinicians_role_check";
