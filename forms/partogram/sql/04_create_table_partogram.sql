-- Parent partogram labour record header. Records the recording context, the
-- patient identification and admission findings, and the active-phase start
-- time that anchors the alert and action reference lines. The ordered series
-- of timed intrapartum observations is held in a child table that cascades
-- from this parent.

CREATE TABLE partogram (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    clinician_name TEXT NOT NULL DEFAULT '',
    clinician_role VARCHAR(20) NOT NULL DEFAULT '' CHECK (clinician_role IN ('midwife', 'obstetrician', 'nurse', 'other', '')),
    care_setting VARCHAR(20) NOT NULL DEFAULT '' CHECK (care_setting IN ('labour-ward', 'birth-centre', 'triage', 'other', '')),
    active_phase_start_at TIMESTAMPTZ,

    patient_identifier TEXT NOT NULL DEFAULT '',
    age_band VARCHAR(10) NOT NULL DEFAULT '' CHECK (age_band IN ('under-18', '18-24', '25-34', '35-39', '40-plus', '')),
    parity VARCHAR(15) NOT NULL DEFAULT '' CHECK (parity IN ('nulliparous', 'multiparous', '')),
    gestation_weeks NUMERIC(4,1),

    membranes_on_admission VARCHAR(15) NOT NULL DEFAULT '' CHECK (membranes_on_admission IN ('intact', 'ruptured', '')),
    risk_factors TEXT NOT NULL DEFAULT '',
    planned_care TEXT NOT NULL DEFAULT ''
);

CREATE INDEX partogram_patient_id_idx
    ON partogram (patient_id);
CREATE INDEX partogram_clinician_id_idx
    ON partogram (clinician_id);

CREATE TRIGGER trigger_partogram_updated_at
    BEFORE UPDATE ON partogram
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE partogram IS
    'Parent partogram labour record header: recording context, patient identification, admission findings, and the active-phase start time that anchors the alert and action lines.';
COMMENT ON COLUMN partogram.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN partogram.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN partogram.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN partogram.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN partogram.patient_id IS
    'Foreign key to the patient this labour record is for (restricted delete).';
COMMENT ON COLUMN partogram.clinician_id IS
    'Foreign key to the recording clinician (restricted delete); optional.';
COMMENT ON COLUMN partogram.clinician_name IS
    'Name of the clinician recording the partogram, as entered on the record.';
COMMENT ON COLUMN partogram.clinician_role IS
    'Role of the recording clinician: midwife, obstetrician, nurse, or other.';
COMMENT ON COLUMN partogram.care_setting IS
    'Care setting: labour-ward, birth-centre, triage, or other.';
COMMENT ON COLUMN partogram.active_phase_start_at IS
    'Date and time the active phase began (cervical dilatation 4 cm); the reference time from which elapsed hours and the alert / action lines are computed.';
COMMENT ON COLUMN partogram.patient_identifier IS
    'Local patient identifier as entered on the record.';
COMMENT ON COLUMN partogram.age_band IS
    'Adult age band: under-18, 18-24, 25-34, 35-39, or 40-plus.';
COMMENT ON COLUMN partogram.parity IS
    'Parity: nulliparous (no previous birth) or multiparous.';
COMMENT ON COLUMN partogram.gestation_weeks IS
    'Completed weeks of gestation.';
COMMENT ON COLUMN partogram.membranes_on_admission IS
    'Membrane status on admission: intact or ruptured.';
COMMENT ON COLUMN partogram.risk_factors IS
    'Free-text noted risk factors for the labour.';
COMMENT ON COLUMN partogram.planned_care IS
    'Free-text planned care or management for the labour.';
