ALTER TABLE "grading_additional_flags" DROP CONSTRAINT IF EXISTS "grading_additional_flags_priority_check";
ALTER TABLE "grading_fired_rules" DROP CONSTRAINT IF EXISTS "grading_fired_rules_severity_level_check";
ALTER TABLE "grades" DROP CONSTRAINT IF EXISTS "grades_sections_total_check";
ALTER TABLE "grades" DROP CONSTRAINT IF EXISTS "grades_sections_complete_check";
ALTER TABLE "grades" DROP CONSTRAINT IF EXISTS "grades_completeness_status_check";
ALTER TABLE "assessments" DROP CONSTRAINT IF EXISTS "assessments_status_check";
ALTER TABLE "clinicians" DROP CONSTRAINT IF EXISTS "clinicians_registration_body_check";
ALTER TABLE "clinicians" DROP CONSTRAINT IF EXISTS "clinicians_role_check";
