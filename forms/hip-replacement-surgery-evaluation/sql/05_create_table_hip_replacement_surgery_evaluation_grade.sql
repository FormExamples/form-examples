-- Computed and signed-off grading result for one hip-replacement surgery
-- evaluation. Stores both the engine-computed values and the clinician-final
-- values with an override reason, so the override is auditable rather than
-- silent.

CREATE TABLE hip_replacement_surgery_evaluation_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    hip_replacement_surgery_evaluation_id UUID NOT NULL UNIQUE
        REFERENCES hip_replacement_surgery_evaluation(id) ON DELETE CASCADE,

    ohs_total INTEGER
        CHECK (ohs_total IS NULL OR ohs_total BETWEEN 0 AND 48),
    ohs_category VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (ohs_category IN ('severe', 'moderate', 'mild-to-moderate', 'satisfactory', '')),

    computed_candidacy VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (computed_candidacy IN ('strong-candidate', 'candidate', 'continue-conservative', 'not-indicated', 'mdt-review', '')),
    final_candidacy VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (final_candidacy IN ('strong-candidate', 'candidate', 'continue-conservative', 'not-indicated', 'mdt-review', '')),
    override_reason VARCHAR(500) NOT NULL DEFAULT '',

    clinician_notes TEXT NOT NULL DEFAULT '',
    signed_by_name VARCHAR(255) NOT NULL DEFAULT '',
    signed_at TIMESTAMPTZ,
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_hip_replacement_surgery_evaluation_grade_updated_at
    BEFORE UPDATE ON hip_replacement_surgery_evaluation_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE hip_replacement_surgery_evaluation_grade IS
    'Computed and signed-off grading result for one hip-replacement surgery evaluation. Stores both the engine-computed values and the clinician-final values with an override reason.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation_grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation_grade.hip_replacement_surgery_evaluation_id IS
    'Foreign key to the hip_replacement_surgery_evaluation table, unique because grading is one-to-one with the evaluation.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation_grade.ohs_total IS
    'Oxford Hip Score total, 0 to 48, being the sum of the 12 items, where 48 is the best outcome.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation_grade.ohs_category IS
    'Oxford Hip Score category computed by the engine: severe (0-19), moderate (20-29), mild-to-moderate (30-39), or satisfactory (40-48). This banding is this form''s operational convention; see spec/index.md.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation_grade.computed_candidacy IS
    'Surgical-candidacy recommendation computed by the engine from the Oxford Hip Score total, the Kellgren and Lawrence grade, and whether conservative measures are exhausted: strong-candidate, candidate, continue-conservative, not-indicated, or mdt-review.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation_grade.final_candidacy IS
    'Surgical-candidacy recommendation signed off by the clinician, which may equal or differ from the computed value.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation_grade.override_reason IS
    'Reason the clinician set a final candidacy differently from the computed value, mandatory when they differ.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation_grade.clinician_notes IS
    'Free-text clinician summary notes.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation_grade.signed_by_name IS
    'Name of the clinician who signed the evaluation.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation_grade.signed_at IS
    'Timestamp of the clinician electronic signature.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation_grade.graded_at IS
    'Timestamp when the engine last computed the result.';
