-- A flag belongs to a grade, as in sql/, not straight to the assessment.
-- Each flag moves to its assessment's live grade, or its latest deleted one.
-- An assessment flagged but never graded gets a draft grade first, deleted if
-- the assessment is, so no flag is lost.
INSERT INTO grades (assessment_id, deleted_at)
SELECT DISTINCT f.assessment_id, a.deleted_at
FROM grading_additional_flags f JOIN assessments a ON a.id = f.assessment_id
WHERE NOT EXISTS (SELECT 1 FROM grades g WHERE g.assessment_id = f.assessment_id);
ALTER TABLE "grading_additional_flags" ADD COLUMN "grade_id" uuid REFERENCES "grades" (id) ON DELETE CASCADE ON UPDATE CASCADE;
UPDATE grading_additional_flags f SET grade_id = (
    SELECT g.id FROM grades g WHERE g.assessment_id = f.assessment_id
    ORDER BY g.deleted_at IS NOT NULL, g.deleted_at DESC LIMIT 1
);
ALTER TABLE "grading_additional_flags" ALTER COLUMN "grade_id" SET NOT NULL;
ALTER TABLE "grading_additional_flags" DROP COLUMN "assessment_id";
