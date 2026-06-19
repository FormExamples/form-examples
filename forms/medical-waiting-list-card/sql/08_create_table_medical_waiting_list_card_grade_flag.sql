-- Safety / operational flags that fire independently of the Waiting Time Status.

CREATE TABLE medical_waiting_list_card_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    medical_waiting_list_card_grade_id UUID NOT NULL
        REFERENCES medical_waiting_list_card_grade(id) ON DELETE CASCADE,
    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (category IN (
            'breach-risk',
            'long-waiter-52-week',
            'priority-1-escalation',
            'two-week-wait-cancer',
            'missing-appointment',
            'accessibility-unmet',
            'interpreter-required',
            'contact-details-missing',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_medical_waiting_list_card_grade_flag_updated_at
    BEFORE UPDATE ON medical_waiting_list_card_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE INDEX index_medical_waiting_list_card_grade_flag_grade_id
    ON medical_waiting_list_card_grade_flag(medical_waiting_list_card_grade_id);

COMMENT ON TABLE medical_waiting_list_card_grade_flag IS
    'Safety / operational flags that fire independently of the Waiting Time Status, with priority and a suggested action for the booking team.';
COMMENT ON COLUMN medical_waiting_list_card_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_waiting_list_card_grade_flag.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN medical_waiting_list_card_grade_flag.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN medical_waiting_list_card_grade_flag.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN medical_waiting_list_card_grade_flag.medical_waiting_list_card_grade_id IS
    'Foreign key to the parent grade row.';
COMMENT ON COLUMN medical_waiting_list_card_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-BREACH-RISK-001).';
COMMENT ON COLUMN medical_waiting_list_card_grade_flag.category IS
    'Flag category.';
COMMENT ON COLUMN medical_waiting_list_card_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN medical_waiting_list_card_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN medical_waiting_list_card_grade_flag.suggested_action IS
    'Suggested action (e.g. "contact patient to confirm next appointment").';
