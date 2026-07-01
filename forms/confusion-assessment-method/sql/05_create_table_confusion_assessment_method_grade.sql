-- Computed CAM classification result. Stores the boolean delirium
-- status, the derived classification (present / absent /
-- unable-to-assess), the set of positive features that satisfied the
-- diagnostic algorithm, and the motoric subtype. This is a status /
-- classification result: there is no numeric total or band.

CREATE TABLE confusion_assessment_method_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    confusion_assessment_method_id UUID NOT NULL UNIQUE
        REFERENCES confusion_assessment_method(id) ON DELETE CASCADE,

    classification VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (classification IN ('present', 'absent', 'unable-to-assess', '')),
    delirium_present BOOLEAN,

    -- Which of the four features were positive (algorithm auditability).
    feature_1_positive BOOLEAN,
    feature_2_positive BOOLEAN,
    feature_3_positive BOOLEAN,
    feature_4_positive BOOLEAN,
    positive_features TEXT NOT NULL DEFAULT '',

    motoric_subtype VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (motoric_subtype IN ('hypoactive', 'hyperactive', 'mixed', 'normal', '')),

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_confusion_assessment_method_grade_updated_at
    BEFORE UPDATE ON confusion_assessment_method_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE confusion_assessment_method_grade IS
    'Computed CAM classification result (1:1): boolean delirium status, derived classification (present / absent / unable-to-assess), the positive-feature set, and the motoric subtype. Status result with no numeric total.';
COMMENT ON COLUMN confusion_assessment_method_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN confusion_assessment_method_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN confusion_assessment_method_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN confusion_assessment_method_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN confusion_assessment_method_grade.confusion_assessment_method_id IS
    'Foreign key to the parent assessment (unique, 1:1).';
COMMENT ON COLUMN confusion_assessment_method_grade.classification IS
    'Derived classification: present, absent, or unable-to-assess (empty when not yet graded).';
COMMENT ON COLUMN confusion_assessment_method_grade.delirium_present IS
    'Boolean result of the diagnostic algorithm: 1 AND 2 AND (3 OR 4). Null when unable-to-assess or not graded.';
COMMENT ON COLUMN confusion_assessment_method_grade.feature_1_positive IS
    'Whether feature 1 (acute onset and fluctuating course) was positive.';
COMMENT ON COLUMN confusion_assessment_method_grade.feature_2_positive IS
    'Whether feature 2 (inattention) was positive.';
COMMENT ON COLUMN confusion_assessment_method_grade.feature_3_positive IS
    'Whether feature 3 (disorganised thinking) was positive.';
COMMENT ON COLUMN confusion_assessment_method_grade.feature_4_positive IS
    'Whether feature 4 (altered level of consciousness) was positive.';
COMMENT ON COLUMN confusion_assessment_method_grade.positive_features IS
    'Comma-separated subset of {1,2,3,4} that were positive (e.g. "1,2,4"), for auditable reasoning.';
COMMENT ON COLUMN confusion_assessment_method_grade.motoric_subtype IS
    'Psychomotor subtype carried through to the result: hypoactive, hyperactive, mixed, or normal.';
COMMENT ON COLUMN confusion_assessment_method_grade.graded_at IS
    'Timestamp when the engine last computed the classification.';
