ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "on_glp1_receptor_agonist" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "glp1_agonist_name" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "glp1_formulation" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "glp1_last_dose_at" timestamp with time zone NULL;

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "glp1_held_per_guideline" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "glp1_extended_clear_fluids_confirmed" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "glp1_gi_symptoms" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "glp1_gi_symptoms_details" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "glp1_gastric_ultrasound_performed" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "glp1_gastric_ultrasound_findings" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "glp1_full_stomach_precautions_planned" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "glp1_notes" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "fried_weakness" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "fried_slowness" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "fried_low_physical_activity" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "fried_exhaustion" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "fried_unintentional_weight_loss" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "risk_analysis_index_score" integer NULL;

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "mini_cog_performed" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "mini_cog_score" integer NULL;

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "prehabilitation_indicated" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "prehabilitation_type" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "prehabilitation_start_date" date NULL;

ALTER TABLE "pre_operative_assessment_by_clinicians" ADD COLUMN "protein_supplementation_recommended" varchar NOT NULL DEFAULT '';

ALTER TABLE "pre_operative_assessment_by_clinician_grades" ADD COLUMN "fried_phenotype_score" integer NULL;

ALTER TABLE "pre_operative_assessment_by_clinician_grades" ADD COLUMN "fried_frailty_category" varchar NOT NULL DEFAULT '';
