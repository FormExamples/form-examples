-- Timed physiological observations charted during the anaesthetic. Each
-- observation is one row and cascades from the parent anaesthetic_record.
-- Carries the observation time and the values monitored at that time. At
-- least one observation row is a critical mandatory item for completeness;
-- values are checked against configured limits for the physiological-
-- derangement safety flag.

CREATE TABLE anaesthetic_record_timed_observation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    anaesthetic_record_id UUID NOT NULL REFERENCES anaesthetic_record(id) ON DELETE CASCADE,

    observed_at TIMESTAMPTZ,
    systolic_blood_pressure NUMERIC(5,1) CHECK (systolic_blood_pressure IS NULL OR systolic_blood_pressure >= 0),
    diastolic_blood_pressure NUMERIC(5,1) CHECK (diastolic_blood_pressure IS NULL OR diastolic_blood_pressure >= 0),
    heart_rate NUMERIC(5,1) CHECK (heart_rate IS NULL OR heart_rate >= 0),
    spo2 NUMERIC(5,1) CHECK (spo2 IS NULL OR spo2 BETWEEN 0 AND 100),
    end_tidal_co2 NUMERIC(5,1) CHECK (end_tidal_co2 IS NULL OR end_tidal_co2 >= 0),
    temperature NUMERIC(4,1) CHECK (temperature IS NULL OR temperature >= 0),
    agent_percent NUMERIC(4,1) CHECK (agent_percent IS NULL OR agent_percent >= 0),
    fresh_gas_flow_l NUMERIC(4,1) CHECK (fresh_gas_flow_l IS NULL OR fresh_gas_flow_l >= 0)
);

CREATE INDEX anaesthetic_record_timed_observation_record_id_idx
    ON anaesthetic_record_timed_observation (anaesthetic_record_id);

CREATE TRIGGER trigger_anaesthetic_record_timed_observation_updated_at
    BEFORE UPDATE ON anaesthetic_record_timed_observation
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE anaesthetic_record_timed_observation IS
    'Timed physiological observations charted during the anaesthetic: time plus monitored values.';
COMMENT ON COLUMN anaesthetic_record_timed_observation.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN anaesthetic_record_timed_observation.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN anaesthetic_record_timed_observation.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN anaesthetic_record_timed_observation.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN anaesthetic_record_timed_observation.anaesthetic_record_id IS
    'Foreign key to the parent anaesthetic record.';
COMMENT ON COLUMN anaesthetic_record_timed_observation.observed_at IS
    'Timestamp of the timed observation.';
COMMENT ON COLUMN anaesthetic_record_timed_observation.systolic_blood_pressure IS
    'Systolic blood pressure in mmHg.';
COMMENT ON COLUMN anaesthetic_record_timed_observation.diastolic_blood_pressure IS
    'Diastolic blood pressure in mmHg.';
COMMENT ON COLUMN anaesthetic_record_timed_observation.heart_rate IS
    'Heart rate in beats per minute.';
COMMENT ON COLUMN anaesthetic_record_timed_observation.spo2 IS
    'Peripheral oxygen saturation (SpO2) as a percentage.';
COMMENT ON COLUMN anaesthetic_record_timed_observation.end_tidal_co2 IS
    'End-tidal carbon dioxide in kPa.';
COMMENT ON COLUMN anaesthetic_record_timed_observation.temperature IS
    'Core temperature in degrees Celsius.';
COMMENT ON COLUMN anaesthetic_record_timed_observation.agent_percent IS
    'Inspired or expired volatile agent concentration as a percentage.';
COMMENT ON COLUMN anaesthetic_record_timed_observation.fresh_gas_flow_l IS
    'Fresh gas flow in litres per minute.';
