ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "hospital_number" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "indication_for_surgery" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "anaesthetist_name" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "previous_surgeries" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "previous_anaesthetic_issues" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "previous_anaesthetic_issues_details" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "family_history_anaesthetic_complications" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "family_history_anaesthetic_complications_details" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "urinalysis_findings" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "living_situation" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "support_at_home" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "mobility_status" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "falls_risk_within_year" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "vte_risk_level" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "covid_screening_result" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "discharge_destination" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "follow_up_requirements" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "social_services_involvement" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "reablement_physiotherapy_needs" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "consent_status" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "interpreter_required" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "discussion_procedure" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "discussion_anaesthetic" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "discussion_risks_benefits" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "discussion_alternatives" varchar NOT NULL DEFAULT '';
