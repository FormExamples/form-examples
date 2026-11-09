-- Name assessment_drug_allergy_items.drug_allergies_id as sql/ does.
ALTER TABLE "assessment_drug_allergy_items" RENAME COLUMN "assessment_drug_allergy_id" TO "drug_allergies_id";
ALTER TABLE "assessment_drug_allergy_items" RENAME CONSTRAINT "fk-assessment_drug_allergy_items-assessment_drug_allergy_id-to-assessment_drug_allergies" TO "fk-assessment_drug_allergy_items-drug_allergies_id-to-assessment_drug_allergies";
