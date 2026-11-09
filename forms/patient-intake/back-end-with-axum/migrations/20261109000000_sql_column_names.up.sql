-- Name assessment_medication_items.medications_id as sql/ does.
ALTER TABLE "assessment_medication_items" RENAME COLUMN "assessment_medication_id" TO "medications_id";
ALTER TABLE "assessment_medication_items" RENAME CONSTRAINT "fk-assessment_medication_items-assessment_medication_id-to-assessment_medications" TO "fk-assessment_medication_items-medications_id-to-assessment_medications";
