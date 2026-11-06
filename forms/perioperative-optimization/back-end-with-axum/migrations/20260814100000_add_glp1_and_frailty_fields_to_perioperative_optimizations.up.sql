ALTER TABLE "perioperative_optimizations" ADD COLUMN "glp1_formulation" varchar NOT NULL DEFAULT '';

ALTER TABLE "perioperative_optimizations" ADD COLUMN "glp1_held_per_guideline" varchar NOT NULL DEFAULT '';

ALTER TABLE "perioperative_optimizations" ADD COLUMN "glp1_extended_clear_fluids_confirmed" varchar NOT NULL DEFAULT '';

ALTER TABLE "perioperative_optimizations" ADD COLUMN "glp1_gi_symptoms" varchar NOT NULL DEFAULT '';

ALTER TABLE "perioperative_optimizations" ADD COLUMN "glp1_gi_symptoms_details" varchar NOT NULL DEFAULT '';

ALTER TABLE "perioperative_optimizations" ADD COLUMN "glp1_gastric_ultrasound_performed" varchar NOT NULL DEFAULT '';

ALTER TABLE "perioperative_optimizations" ADD COLUMN "glp1_gastric_ultrasound_findings" varchar NOT NULL DEFAULT '';

ALTER TABLE "perioperative_optimizations" ADD COLUMN "protein_supplementation_recommended" varchar NOT NULL DEFAULT '';

ALTER TABLE "perioperative_optimizations" ADD COLUMN "fried_weakness" varchar NOT NULL DEFAULT '';

ALTER TABLE "perioperative_optimizations" ADD COLUMN "fried_slowness" varchar NOT NULL DEFAULT '';

ALTER TABLE "perioperative_optimizations" ADD COLUMN "fried_low_physical_activity" varchar NOT NULL DEFAULT '';

ALTER TABLE "perioperative_optimizations" ADD COLUMN "fried_exhaustion" varchar NOT NULL DEFAULT '';

ALTER TABLE "perioperative_optimizations" ADD COLUMN "fried_unintentional_weight_loss" varchar NOT NULL DEFAULT '';

ALTER TABLE "perioperative_optimizations" ADD COLUMN "risk_analysis_index_score" integer NULL;

ALTER TABLE "perioperative_optimizations" ADD COLUMN "mini_cog_performed" varchar NOT NULL DEFAULT '';

ALTER TABLE "perioperative_optimizations" ADD COLUMN "mini_cog_score" integer NULL;

ALTER TABLE "perioperative_optimization_grades" ADD COLUMN "fried_phenotype_score" integer NULL;

ALTER TABLE "perioperative_optimization_grades" ADD COLUMN "fried_frailty_category" varchar NOT NULL DEFAULT '';
