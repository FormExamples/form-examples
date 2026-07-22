-- One row per answered checkpoint within an inspection round. 97
-- checkpoints are catalogued in ../spec/index.md; item_code carries the
-- checkpoint's stable dotted identifier from that catalogue (e.g. '1.1',
-- '6.1.1', '20.10', or a bare section number such as '15' for the five
-- areas with no sub-items). A normalised child table is used instead of
-- one wide column per checkpoint, since 97 checkpoints would need ~200
-- flat columns.

CREATE TABLE hospital_daily_monitoring_checklist_item (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    hospital_daily_monitoring_checklist_id UUID NOT NULL REFERENCES hospital_daily_monitoring_checklist(id) ON DELETE CASCADE,
    item_code VARCHAR(10) NOT NULL,
    section_number INTEGER NOT NULL CHECK (section_number BETWEEN 1 AND 22),
    section_title VARCHAR(255) NOT NULL DEFAULT '',
    item_text TEXT NOT NULL DEFAULT '',
    status VARCHAR(20) NOT NULL DEFAULT '' CHECK (status IN ('satisfactory', 'needs-attention', 'not-applicable', '')),
    remarks TEXT NOT NULL DEFAULT '',

    UNIQUE (hospital_daily_monitoring_checklist_id, item_code)
);

CREATE TRIGGER trigger_hospital_daily_monitoring_checklist_item_updated_at
    BEFORE UPDATE ON hospital_daily_monitoring_checklist_item
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE hospital_daily_monitoring_checklist_item IS
    'One answered checkpoint (of 97) within a daily-monitoring inspection round.';
COMMENT ON COLUMN hospital_daily_monitoring_checklist_item.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN hospital_daily_monitoring_checklist_item.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN hospital_daily_monitoring_checklist_item.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN hospital_daily_monitoring_checklist_item.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN hospital_daily_monitoring_checklist_item.hospital_daily_monitoring_checklist_id IS
    'Foreign key to the parent inspection round.';
COMMENT ON COLUMN hospital_daily_monitoring_checklist_item.item_code IS
    'Stable dotted checkpoint identifier from spec/index.md, e.g. 1.1, 6.1.1, 20.10, or a bare section number such as 15.';
COMMENT ON COLUMN hospital_daily_monitoring_checklist_item.section_number IS
    'Top-level area number (1-22) this checkpoint belongs to.';
COMMENT ON COLUMN hospital_daily_monitoring_checklist_item.section_title IS
    'Top-level area title (e.g. OPD, Causality, Diagnostic Facility) mirrored from the catalogue for reporting convenience.';
COMMENT ON COLUMN hospital_daily_monitoring_checklist_item.item_text IS
    'Full checkpoint text mirrored from the catalogue for reporting convenience.';
COMMENT ON COLUMN hospital_daily_monitoring_checklist_item.status IS
    'Checkpoint status: satisfactory, needs-attention, not-applicable, or unanswered.';
COMMENT ON COLUMN hospital_daily_monitoring_checklist_item.remarks IS
    'Optional free-text remark, most useful when status is needs-attention.';

CREATE INDEX hospital_daily_monitoring_checklist_item_checklist_id_idx
    ON hospital_daily_monitoring_checklist_item (hospital_daily_monitoring_checklist_id);
CREATE INDEX hospital_daily_monitoring_checklist_item_status_idx
    ON hospital_daily_monitoring_checklist_item (status);
