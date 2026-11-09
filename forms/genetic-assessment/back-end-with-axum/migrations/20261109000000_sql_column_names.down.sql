-- Name assessment_cancer_history_items.cancer_history_id as sql/ does.
ALTER TABLE "assessment_cancer_history_items" RENAME CONSTRAINT "fk-assessment_cancer_history_items-cancer_history_id-to-assessment_cancer_histories" TO "fk-assessment_cancer_history_items-assessment_cancer_history_id-to-assessment_cancer_histories";
ALTER TABLE "assessment_cancer_history_items" RENAME COLUMN "cancer_history_id" TO "assessment_cancer_history_id";
