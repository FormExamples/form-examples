-- Non-statutory ambiguity and risk flags raised alongside the validity result.
-- These do not block submission but surface concerns to the donor / solicitor
-- (capacity-concern, coercion-concern, ADRT conflict, foreign domicile, …).

CREATE TABLE lpa_validity_additional_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    lpa_validity_id UUID NOT NULL
        REFERENCES lpa_validity(id) ON DELETE CASCADE,
    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (category IN (
            'donor-capacity-concern',
            'coercion-concern',
            'adrt-conflict',
            'foreign-domicile',
            'solicitor-recommended',
            'replacement-trigger-ambiguous',
            'bilingual-donor',
            'attorney-bankrupt',
            'multiple-lpas-detected',
            'opg-historical-rejection',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description TEXT NOT NULL DEFAULT '',
    suggested_action TEXT NOT NULL DEFAULT ''
);

CREATE INDEX index_lpa_validity_additional_flag_validity_id ON lpa_validity_additional_flag(lpa_validity_id);

CREATE TRIGGER trigger_lpa_validity_additional_flag_updated_at
    BEFORE UPDATE ON lpa_validity_additional_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE lpa_validity_additional_flag IS
    'Non-statutory ambiguity and risk flags surfaced alongside the validity result.';
COMMENT ON COLUMN lpa_validity_additional_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN lpa_validity_additional_flag.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN lpa_validity_additional_flag.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN lpa_validity_additional_flag.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN lpa_validity_additional_flag.lpa_validity_id IS
    'Foreign key to the parent validity result.';
COMMENT ON COLUMN lpa_validity_additional_flag.flag_id IS
    'Stable flag identifier (e.g. F-CAPACITY-CONCERN-001).';
COMMENT ON COLUMN lpa_validity_additional_flag.category IS
    'Flag category.';
COMMENT ON COLUMN lpa_validity_additional_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN lpa_validity_additional_flag.description IS
    'Human-readable description of what the flag indicates.';
COMMENT ON COLUMN lpa_validity_additional_flag.suggested_action IS
    'Suggested next step (e.g. "request a capacity assessment under MCA s.2").';
