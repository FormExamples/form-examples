-- Computed AUDIT-C grading result. Stores the summed total (0-12), the
-- derived risk band, and whether the total meets the positive-screen
-- cut (>= 5).

CREATE TABLE audit_c_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    audit_c_id UUID NOT NULL UNIQUE
        REFERENCES audit_c(id) ON DELETE CASCADE,

    total_score INT,
    risk_band VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (risk_band IN ('lower', 'increasing', 'higher', 'possible-dependence', '')),
    positive_screen VARCHAR(3) NOT NULL DEFAULT ''
        CHECK (positive_screen IN ('yes', 'no', '')),

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_audit_c_grade_updated_at
    BEFORE UPDATE ON audit_c_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE audit_c_grade IS
    'Computed AUDIT-C grading result (1:1 with audit_c): summed total (0-12), derived risk band, and positive-screen indicator (total >= 5).';
COMMENT ON COLUMN audit_c_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN audit_c_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN audit_c_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN audit_c_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN audit_c_grade.audit_c_id IS
    'Foreign key to the parent assessment (unique, 1:1).';
COMMENT ON COLUMN audit_c_grade.total_score IS
    'Summed AUDIT-C score across the three consumption items (0-12); a missing item contributes 0.';
COMMENT ON COLUMN audit_c_grade.risk_band IS
    'Derived risk band: lower (0-4), increasing (5-7), higher (8-10), or possible-dependence (11-12).';
COMMENT ON COLUMN audit_c_grade.positive_screen IS
    'Positive-screen indicator: yes when total_score >= 5 (UK default cut), otherwise no.';
COMMENT ON COLUMN audit_c_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
