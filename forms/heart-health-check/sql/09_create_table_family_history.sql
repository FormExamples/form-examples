CREATE TABLE heart_health_check.family_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES heart_health_check.assessment(id) ON DELETE CASCADE,
    family_cvd_under_60 VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (family_cvd_under_60 IN ('yes', 'no', '')),
    family_cvd_relationship VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (family_cvd_relationship IN ('parent', 'sibling', 'child', 'multiple', '')),
    family_diabetes_history VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (family_diabetes_history IN ('yes', 'no', ''))
);

CREATE TRIGGER trigger_family_history_updated_at
    BEFORE UPDATE ON heart_health_check.family_history
    FOR EACH ROW
    EXECUTE FUNCTION heart_health_check.set_updated_at();

COMMENT ON TABLE heart_health_check.family_history IS
    'Family history of cardiovascular disease and diabetes.';
COMMENT ON COLUMN heart_health_check.family_history.family_cvd_under_60 IS
    'Whether a first-degree relative had CVD under age 60.';
COMMENT ON COLUMN heart_health_check.family_history.family_cvd_relationship IS
    'Relationship of the affected relative.';
COMMENT ON COLUMN heart_health_check.family_history.family_diabetes_history IS
    'Whether there is a family history of diabetes.';

COMMENT ON COLUMN heart_health_check.family_history.assessment_id IS
    'Foreign key to the assessment table.';
COMMENT ON COLUMN heart_health_check.family_history.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN heart_health_check.family_history.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN heart_health_check.family_history.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN heart_health_check.family_history.deleted_at IS
    'Timestamp when this row was deleted.';
