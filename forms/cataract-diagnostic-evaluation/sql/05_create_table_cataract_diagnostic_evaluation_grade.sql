-- Computed and signed-off grading result for one cataract diagnostic
-- evaluation. Stores both the engine-computed values and the
-- clinician-final values with an override reason, so the override is
-- auditable rather than silent.

CREATE TABLE cataract_diagnostic_evaluation_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    cataract_diagnostic_evaluation_id UUID NOT NULL UNIQUE
        REFERENCES cataract_diagnostic_evaluation(id) ON DELETE CASCADE,

    computed_locs_iii_severity_right VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (computed_locs_iii_severity_right IN ('mild', 'moderate', 'severe', '')),
    computed_locs_iii_severity_left VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (computed_locs_iii_severity_left IN ('mild', 'moderate', 'severe', '')),

    computed_surgical_candidacy VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (computed_surgical_candidacy IN ('not-indicated', 'consider', 'indicated', 'urgent-referral', '')),
    final_surgical_candidacy VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (final_surgical_candidacy IN ('not-indicated', 'consider', 'indicated', 'urgent-referral', '')),
    override_reason VARCHAR(500) NOT NULL DEFAULT '',

    functional_impact_score INTEGER
        CHECK (functional_impact_score IS NULL OR functional_impact_score BETWEEN 0 AND 12),

    clinician_notes TEXT NOT NULL DEFAULT '',
    signed_by_name VARCHAR(255) NOT NULL DEFAULT '',
    signed_at TIMESTAMPTZ,
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_cataract_diagnostic_evaluation_grade_updated_at
    BEFORE UPDATE ON cataract_diagnostic_evaluation_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE cataract_diagnostic_evaluation_grade IS
    'Computed and signed-off grading result for one cataract diagnostic evaluation. Stores both the engine-computed values and the clinician-final values with an override reason.';
COMMENT ON COLUMN cataract_diagnostic_evaluation_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN cataract_diagnostic_evaluation_grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN cataract_diagnostic_evaluation_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN cataract_diagnostic_evaluation_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN cataract_diagnostic_evaluation_grade.cataract_diagnostic_evaluation_id IS
    'Foreign key to the cataract_diagnostic_evaluation table, unique because grading is one-to-one with the evaluation.';
COMMENT ON COLUMN cataract_diagnostic_evaluation_grade.computed_locs_iii_severity_right IS
    'LOCS III severity band computed for the right eye from the four LOCS III subscores, per this form''s own severity-band simplification: mild, moderate, or severe.';
COMMENT ON COLUMN cataract_diagnostic_evaluation_grade.computed_locs_iii_severity_left IS
    'LOCS III severity band computed for the left eye from the four LOCS III subscores, per this form''s own severity-band simplification: mild, moderate, or severe.';
COMMENT ON COLUMN cataract_diagnostic_evaluation_grade.computed_surgical_candidacy IS
    'Surgical-candidacy recommendation computed by the engine from LOCS III severity, best-corrected visual acuity, and glare testing: not-indicated, consider, indicated, or urgent-referral.';
COMMENT ON COLUMN cataract_diagnostic_evaluation_grade.final_surgical_candidacy IS
    'Surgical-candidacy recommendation signed off by the clinician, which may equal or differ from the computed value.';
COMMENT ON COLUMN cataract_diagnostic_evaluation_grade.override_reason IS
    'Mandatory reason recorded when the clinician overrides the computed surgical-candidacy recommendation.';
COMMENT ON COLUMN cataract_diagnostic_evaluation_grade.functional_impact_score IS
    'Functional/quality-of-life composite score, 0 to 12, being the sum of the three 0-4 self-report sub-scores for reading, driving, and daily activities.';
COMMENT ON COLUMN cataract_diagnostic_evaluation_grade.clinician_notes IS
    'Free-text clinician notes on the overall evaluation.';
COMMENT ON COLUMN cataract_diagnostic_evaluation_grade.signed_by_name IS
    'Name of the clinician who signed off the evaluation.';
COMMENT ON COLUMN cataract_diagnostic_evaluation_grade.signed_at IS
    'Timestamp when the evaluation was signed off.';
COMMENT ON COLUMN cataract_diagnostic_evaluation_grade.graded_at IS
    'Timestamp when the engine computed this grading result.';
