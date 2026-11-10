-- Name grades.assessment_id as sql/ does.
ALTER TABLE "grades" RENAME COLUMN "bone_marrow_donation_assessment_id" TO "assessment_id";
ALTER TABLE "grades" RENAME CONSTRAINT "fk-grades-bone_marrow_donation_assessment_id-to-bone_marrow_donation_assessments" TO "fk-grades-assessment_id-to-bone_marrow_donation_assessments";
