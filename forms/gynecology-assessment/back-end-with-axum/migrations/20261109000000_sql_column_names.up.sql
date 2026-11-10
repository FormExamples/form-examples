-- Name assessment_current_medication_items.current_medications_id as sql/ does.
ALTER TABLE "assessment_current_medication_items" RENAME COLUMN "assessment_current_medication_id" TO "current_medications_id";
ALTER TABLE "assessment_current_medication_items" RENAME CONSTRAINT "fk-assessment_current_medication_items-assessment_current_medication_id-to-assessment_current_medications" TO "fk-assessment_current_medication_items-current_medications_id-to-assessment_current_medications";
