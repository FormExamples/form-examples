-- Point each flag at its grade's assessment again.
ALTER TABLE "grading_additional_flags" ADD COLUMN "assessment_id" uuid REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE;
UPDATE grading_additional_flags f SET assessment_id = g.assessment_id FROM grades g WHERE g.id = f.grade_id;
ALTER TABLE "grading_additional_flags" ALTER COLUMN "assessment_id" SET NOT NULL;
ALTER TABLE "grading_additional_flags" DROP COLUMN "grade_id";
