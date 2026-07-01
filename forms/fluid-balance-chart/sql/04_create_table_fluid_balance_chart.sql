-- Parent fluid balance chart header. Records the charting context, patient
-- identification, charting period, and patient weight (which enables the
-- mL/kg/h urine output rate). Timed intake and output volumes are held in the
-- fluid_balance_chart_entry child table that cascades from this parent, and the
-- computed grade cascades 1:1 from it.

CREATE TABLE fluid_balance_chart (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    clinician_name TEXT NOT NULL DEFAULT '',
    clinician_role VARCHAR(30) NOT NULL DEFAULT '' CHECK (clinician_role IN ('nurse', 'doctor', 'healthcare-assistant', 'other', '')),
    patient_identifier TEXT NOT NULL DEFAULT '',
    ward_or_unit TEXT NOT NULL DEFAULT '',

    chart_start_at TIMESTAMPTZ,
    chart_period_hours NUMERIC(6,2),
    weight_kg NUMERIC(5,1),
    clinical_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX fluid_balance_chart_patient_id_idx
    ON fluid_balance_chart (patient_id);
CREATE INDEX fluid_balance_chart_clinician_id_idx
    ON fluid_balance_chart (clinician_id);

CREATE TRIGGER trigger_fluid_balance_chart_updated_at
    BEFORE UPDATE ON fluid_balance_chart
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE fluid_balance_chart IS
    'Parent fluid balance chart header: charting context, patient identification, charting period, and patient weight enabling the mL/kg/h urine output rate.';
COMMENT ON COLUMN fluid_balance_chart.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN fluid_balance_chart.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN fluid_balance_chart.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN fluid_balance_chart.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN fluid_balance_chart.patient_id IS
    'Foreign key to the patient this chart is for (restricted delete).';
COMMENT ON COLUMN fluid_balance_chart.clinician_id IS
    'Foreign key to the charting clinician (restricted delete); optional.';
COMMENT ON COLUMN fluid_balance_chart.clinician_name IS
    'Name of the charting clinician as entered on the chart.';
COMMENT ON COLUMN fluid_balance_chart.clinician_role IS
    'Role of the charting clinician: nurse, doctor, healthcare-assistant, or other.';
COMMENT ON COLUMN fluid_balance_chart.patient_identifier IS
    'Local patient identifier as entered on the chart.';
COMMENT ON COLUMN fluid_balance_chart.ward_or_unit IS
    'Ward or unit name where the chart is being kept.';
COMMENT ON COLUMN fluid_balance_chart.chart_start_at IS
    'Date and time the charting period starts.';
COMMENT ON COLUMN fluid_balance_chart.chart_period_hours IS
    'Charting period in hours (default 24); used to scale balance thresholds and compute the mL/kg/h rate.';
COMMENT ON COLUMN fluid_balance_chart.weight_kg IS
    'Patient weight in kilograms; enables the urine output rate in mL/kg/h.';
COMMENT ON COLUMN fluid_balance_chart.clinical_note IS
    'Free-text summary note for the chart.';
