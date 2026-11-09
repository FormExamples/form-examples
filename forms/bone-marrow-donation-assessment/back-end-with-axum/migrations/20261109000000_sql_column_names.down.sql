-- Name grades.assessment_id as sql/ does.
ALTER TABLE "grades" RENAME CONSTRAINT "fk-grades-assessment_id-to-bone_marrow_donation_assessments" TO "fk-grades-bone_marrow_donation_assessment_id-to-bone_marrow_donation_assessments";
ALTER TABLE "grades" RENAME COLUMN "assessment_id" TO "bone_marrow_donation_assessment_id";
