-- Name assessment_medication_items.current_medications_id as sql/ does.
ALTER TABLE "assessment_medication_items" RENAME CONSTRAINT "fk-assessment_medication_items-current_medications_id-to-assessment_current_medications" TO "fk-assessment_medication_items-assessment_current_medication_id-to-assessment_current_medications";
ALTER TABLE "assessment_medication_items" RENAME COLUMN "current_medications_id" TO "assessment_current_medication_id";
