CREATE TABLE grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES assessment(id) ON DELETE CASCADE,
    total_symptom_score INTEGER NOT NULL DEFAULT 0
        CHECK (total_symptom_score >= 0),
    dermatological_score INTEGER NOT NULL DEFAULT 0
        CHECK (dermatological_score >= 0),
    gastrointestinal_score INTEGER NOT NULL DEFAULT 0
        CHECK (gastrointestinal_score >= 0),
    cardiovascular_score INTEGER NOT NULL DEFAULT 0
        CHECK (cardiovascular_score >= 0),
    respiratory_score INTEGER NOT NULL DEFAULT 0
        CHECK (respiratory_score >= 0),
    neurological_score INTEGER NOT NULL DEFAULT 0
        CHECK (neurological_score >= 0),
    organ_system_count INTEGER NOT NULL DEFAULT 0
        CHECK (organ_system_count >= 0 AND organ_system_count <= 5),
    severity_level VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (severity_level IN ('mild', 'moderate', 'severe', '')),
    trigger_count INTEGER NOT NULL DEFAULT 0
        CHECK (trigger_count >= 0),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE grade IS
    'Computed MCAS symptom grading result across multiple organ systems. One-to-one child of assessment.';
COMMENT ON COLUMN grade.assessment_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN grade.total_symptom_score IS
    'Total cumulative symptom severity score across all organ systems.';
COMMENT ON COLUMN grade.dermatological_score IS
    'Symptom severity score for dermatological system.';
COMMENT ON COLUMN grade.gastrointestinal_score IS
    'Symptom severity score for gastrointestinal system.';
COMMENT ON COLUMN grade.cardiovascular_score IS
    'Symptom severity score for cardiovascular system.';
COMMENT ON COLUMN grade.respiratory_score IS
    'Symptom severity score for respiratory system.';
COMMENT ON COLUMN grade.neurological_score IS
    'Symptom severity score for neurological system.';
COMMENT ON COLUMN grade.organ_system_count IS
    'Number of organ systems affected (0-5).';
COMMENT ON COLUMN grade.severity_level IS
    'Overall severity classification: mild, moderate, or severe.';
COMMENT ON COLUMN grade.trigger_count IS
    'Number of identified symptom triggers.';
COMMENT ON COLUMN grade.graded_at IS
    'Timestamp when the grading was computed.';

COMMENT ON COLUMN grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN grade.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN grade.deleted_at IS
    'Timestamp when this row was deleted.';
