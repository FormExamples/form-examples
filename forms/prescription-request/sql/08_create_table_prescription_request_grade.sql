CREATE TABLE grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    prescription_request_id UUID NOT NULL UNIQUE
        REFERENCES prescription_request(id) ON DELETE CASCADE,
    priority_level VARCHAR(10) NOT NULL DEFAULT 'routine'
        CHECK (priority_level IN ('routine', 'urgent', 'emergency')),
    rule_count INTEGER NOT NULL DEFAULT 0
        CHECK (rule_count >= 0),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE grade IS
    'Computed priority classification result for the prescription request. One-to-one child of prescription_request.';
COMMENT ON COLUMN grade.priority_level IS 'Overall priority: routine, urgent, or emergency.';
COMMENT ON COLUMN grade.rule_count IS 'Total number of classification rules that fired.';
COMMENT ON COLUMN grade.graded_at IS 'Timestamp when the priority classification was computed.';
--rollback DROP TABLE grade;

COMMENT ON COLUMN grade.prescription_request_id IS
    'Foreign key to the prescription_request table.';
COMMENT ON COLUMN grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN grade.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN grade.deleted_at IS
    'Timestamp when this row was deleted.';
