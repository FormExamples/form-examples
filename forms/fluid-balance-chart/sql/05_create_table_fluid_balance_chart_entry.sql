-- Timed intake and output line items for a fluid balance chart. Each recorded
-- volume is one row and cascades from the parent fluid_balance_chart. A row
-- carries the time it was recorded, its direction (intake or output), the fluid
-- category, an optional route or description, and the volume in millilitres.

CREATE TABLE fluid_balance_chart_entry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    fluid_balance_chart_id UUID NOT NULL REFERENCES fluid_balance_chart(id) ON DELETE CASCADE,

    entry_at TIMESTAMPTZ,
    direction VARCHAR(10) NOT NULL DEFAULT '' CHECK (direction IN ('intake', 'output', '')),
    category VARCHAR(20) NOT NULL DEFAULT '' CHECK (category IN ('oral', 'iv', 'enteral', 'blood-products', 'other-intake', 'urine', 'drains', 'vomit-ng', 'stool', 'insensible-other', '')),
    description TEXT NOT NULL DEFAULT '',
    volume_ml NUMERIC(8,2)
);

CREATE INDEX fluid_balance_chart_entry_chart_id_idx
    ON fluid_balance_chart_entry (fluid_balance_chart_id);

CREATE TRIGGER trigger_fluid_balance_chart_entry_updated_at
    BEFORE UPDATE ON fluid_balance_chart_entry
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE fluid_balance_chart_entry IS
    'Timed intake and output line items for a fluid balance chart; cascades from the parent chart.';
COMMENT ON COLUMN fluid_balance_chart_entry.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN fluid_balance_chart_entry.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN fluid_balance_chart_entry.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN fluid_balance_chart_entry.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN fluid_balance_chart_entry.fluid_balance_chart_id IS
    'Foreign key to the parent fluid balance chart.';
COMMENT ON COLUMN fluid_balance_chart_entry.entry_at IS
    'Date and time the volume was recorded.';
COMMENT ON COLUMN fluid_balance_chart_entry.direction IS
    'Direction of the volume: intake or output.';
COMMENT ON COLUMN fluid_balance_chart_entry.category IS
    'Fluid category: intake (oral, iv, enteral, blood-products, other-intake) or output (urine, drains, vomit-ng, stool, insensible-other).';
COMMENT ON COLUMN fluid_balance_chart_entry.description IS
    'Optional route or free-text description of the recorded volume.';
COMMENT ON COLUMN fluid_balance_chart_entry.volume_ml IS
    'Recorded volume in millilitres; null when not recorded.';
