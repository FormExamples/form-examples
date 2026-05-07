CREATE TABLE grading_additional_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    grade_id UUID NOT NULL
        REFERENCES grade(id) ON DELETE CASCADE,
    flag_id VARCHAR(30) NOT NULL,
    category VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    priority VARCHAR(10) NOT NULL
        CHECK (priority IN ('high', 'medium', 'low'))
);

CREATE INDEX index_grading_additional_flag_result
    ON grading_additional_flag(grade_id);

COMMENT ON TABLE grading_additional_flag IS
    'Additional clinical flags raised during the Heart Health Check grading. Many-to-one child of grade.';
COMMENT ON COLUMN grading_additional_flag.flag_id IS
    'Flag identifier (e.g. FLAG-BP-001).';
COMMENT ON COLUMN grading_additional_flag.category IS
    'Clinical category of the flag (e.g. Blood Pressure, Eligibility).';
COMMENT ON COLUMN grading_additional_flag.message IS
    'Human-readable description of the flagged issue.';
COMMENT ON COLUMN grading_additional_flag.priority IS
    'Flag priority: high, medium, or low.';

COMMENT ON COLUMN grading_additional_flag.grade_id IS
    'Foreign key to the grade table.';
COMMENT ON COLUMN grading_additional_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN grading_additional_flag.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN grading_additional_flag.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN grading_additional_flag.deleted_at IS
    'Timestamp when this row was deleted.';
