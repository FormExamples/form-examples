-- Computed and signed-off grading result for one knee replacement surgery
-- evaluation. Stores both the engine-computed values and the clinician-final
-- values with an override reason, so the override is auditable rather than
-- silent.

CREATE TABLE knee_replacement_surgery_evaluation_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    knee_replacement_surgery_evaluation_id UUID NOT NULL UNIQUE
        REFERENCES knee_replacement_surgery_evaluation(id) ON DELETE CASCADE,

    oks_total INTEGER
        CHECK (oks_total IS NULL OR oks_total BETWEEN 0 AND 48),
    computed_oks_category VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (computed_oks_category IN ('severe', 'moderate', 'mild-to-moderate', 'satisfactory', '')),
    final_oks_category VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (final_oks_category IN ('severe', 'moderate', 'mild-to-moderate', 'satisfactory', '')),

    max_kellgren_lawrence_grade SMALLINT
        CHECK (max_kellgren_lawrence_grade IS NULL OR max_kellgren_lawrence_grade BETWEEN 0 AND 4),

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

CREATE TRIGGER trigger_knee_replacement_surgery_evaluation_grade_updated_at
    BEFORE UPDATE ON knee_replacement_surgery_evaluation_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE knee_replacement_surgery_evaluation_grade IS
    'Computed and signed-off grading result for one knee replacement surgery evaluation. Stores both the engine-computed values and the clinician-final values with an override reason.';
COMMENT ON COLUMN knee_replacement_surgery_evaluation_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN knee_replacement_surgery_evaluation_grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN knee_replacement_surgery_evaluation_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN knee_replacement_surgery_evaluation_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN knee_replacement_surgery_evaluation_grade.knee_replacement_surgery_evaluation_id IS
    'Foreign key to the knee_replacement_surgery_evaluation table, unique because grading is one-to-one with the evaluation.';
COMMENT ON COLUMN knee_replacement_surgery_evaluation_grade.oks_total IS
    'Oxford Knee Score total, 0 to 48, being the sum of the twelve item scores. 48 is the best possible outcome.';
COMMENT ON COLUMN knee_replacement_surgery_evaluation_grade.computed_oks_category IS
    'Oxford Knee Score category computed by the engine: severe (0-19), moderate (20-29), mild-to-moderate (30-39), or satisfactory (40-48).';
COMMENT ON COLUMN knee_replacement_surgery_evaluation_grade.final_oks_category IS
    'Oxford Knee Score category signed off by the clinician, which may equal or differ from the computed value.';
COMMENT ON COLUMN knee_replacement_surgery_evaluation_grade.max_kellgren_lawrence_grade IS
    'Highest Kellgren-Lawrence radiographic grade across the medial, lateral, and patellofemoral compartments, 0 to 4.';
COMMENT ON COLUMN knee_replacement_surgery_evaluation_grade.computed_candidacy IS
    'Surgical candidacy recommendation computed by the engine: strong-candidate, candidate, continue-conservative, not-indicated, or mdt-review.';
COMMENT ON COLUMN knee_replacement_surgery_evaluation_grade.final_candidacy IS
    'Surgical candidacy recommendation signed off by the clinician, which may equal or differ from the computed value.';
COMMENT ON COLUMN knee_replacement_surgery_evaluation_grade.override_reason IS
    'Reason the clinician set a final candidacy differently from the computed value, mandatory when they differ.';
COMMENT ON COLUMN knee_replacement_surgery_evaluation_grade.clinician_notes IS
    'Free-text clinician summary notes.';
COMMENT ON COLUMN knee_replacement_surgery_evaluation_grade.signed_by_name IS
    'Name of the clinician who signed the evaluation.';
COMMENT ON COLUMN knee_replacement_surgery_evaluation_grade.signed_at IS
    'Timestamp of the clinician electronic signature.';
COMMENT ON COLUMN knee_replacement_surgery_evaluation_grade.graded_at IS
    'Timestamp when the engine last computed the result.';
