-- Timed intrapartum observation rows. Each row is one assessment at a
-- wall-clock time and cascades from the parent partogram. A row may record any
-- of the observation groups: labour progress (dilatation, descent),
-- contractions, fetal heart rate, liquor and moulding, maternal vitals, urine,
-- and drugs / oxytocin. The progress engine reads this ordered series to plot
-- points against the alert and action lines and to raise threshold flags.

CREATE TABLE partogram_observation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    partogram_id UUID NOT NULL REFERENCES partogram(id) ON DELETE CASCADE,

    observed_at TIMESTAMPTZ,
    cervical_dilatation_cm NUMERIC(3,1) CHECK (cervical_dilatation_cm IS NULL OR cervical_dilatation_cm BETWEEN 0 AND 10),
    descent_fifths NUMERIC(2,1) CHECK (descent_fifths IS NULL OR descent_fifths BETWEEN 0 AND 5),

    contractions_per_10_min NUMERIC(3,0),
    contraction_duration_band VARCHAR(10) NOT NULL DEFAULT '' CHECK (contraction_duration_band IN ('<20s', '20-40s', '>40s', '')),
    contraction_strength VARCHAR(10) NOT NULL DEFAULT '' CHECK (contraction_strength IN ('mild', 'moderate', 'strong', '')),

    fetal_heart_rate INTEGER,
    liquor_state VARCHAR(15) NOT NULL DEFAULT '' CHECK (liquor_state IN ('intact', 'clear', 'meconium', 'blood-stained', 'absent', '')),
    moulding VARCHAR(5) NOT NULL DEFAULT '' CHECK (moulding IN ('0', '+', '++', '+++', '')),

    systolic_blood_pressure INTEGER,
    diastolic_blood_pressure INTEGER,
    pulse INTEGER,
    temperature NUMERIC(4,1),

    urine_volume_ml NUMERIC(6,0),
    urine_protein VARCHAR(10) NOT NULL DEFAULT '' CHECK (urine_protein IN ('negative', 'trace', '+', '++', '+++', '')),
    urine_ketones VARCHAR(10) NOT NULL DEFAULT '' CHECK (urine_ketones IN ('negative', 'trace', '+', '++', '+++', '')),
    urine_glucose VARCHAR(10) NOT NULL DEFAULT '' CHECK (urine_glucose IN ('negative', 'trace', '+', '++', '+++', '')),

    oxytocin_rate NUMERIC(6,1),
    drugs_and_fluids TEXT NOT NULL DEFAULT ''
);

CREATE INDEX partogram_observation_partogram_id_idx
    ON partogram_observation (partogram_id);

CREATE TRIGGER trigger_partogram_observation_updated_at
    BEFORE UPDATE ON partogram_observation
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE partogram_observation IS
    'Timed intrapartum observation rows for a partogram: labour progress, contractions, fetal heart rate, liquor and moulding, maternal vitals, urine, and drugs / oxytocin.';
COMMENT ON COLUMN partogram_observation.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN partogram_observation.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN partogram_observation.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN partogram_observation.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN partogram_observation.partogram_id IS
    'Foreign key to the parent partogram labour record.';
COMMENT ON COLUMN partogram_observation.observed_at IS
    'Wall-clock date and time the observation was taken.';
COMMENT ON COLUMN partogram_observation.cervical_dilatation_cm IS
    'Cervical dilatation in centimetres (0-10), plotted against the alert and action lines.';
COMMENT ON COLUMN partogram_observation.descent_fifths IS
    'Descent of the fetal head in fifths palpable above the pelvic brim (5 down to 0).';
COMMENT ON COLUMN partogram_observation.contractions_per_10_min IS
    'Uterine contraction frequency: number of contractions in 10 minutes.';
COMMENT ON COLUMN partogram_observation.contraction_duration_band IS
    'Contraction duration band: <20s, 20-40s, or >40s.';
COMMENT ON COLUMN partogram_observation.contraction_strength IS
    'Contraction strength on palpation: mild, moderate, or strong.';
COMMENT ON COLUMN partogram_observation.fetal_heart_rate IS
    'Fetal heart rate in beats per minute.';
COMMENT ON COLUMN partogram_observation.liquor_state IS
    'Amniotic fluid (liquor) state: intact, clear, meconium, blood-stained, or absent.';
COMMENT ON COLUMN partogram_observation.moulding IS
    'Degree of fetal skull moulding: 0, +, ++, or +++.';
COMMENT ON COLUMN partogram_observation.systolic_blood_pressure IS
    'Maternal systolic blood pressure in mmHg.';
COMMENT ON COLUMN partogram_observation.diastolic_blood_pressure IS
    'Maternal diastolic blood pressure in mmHg.';
COMMENT ON COLUMN partogram_observation.pulse IS
    'Maternal pulse in beats per minute.';
COMMENT ON COLUMN partogram_observation.temperature IS
    'Maternal temperature in degrees Celsius.';
COMMENT ON COLUMN partogram_observation.urine_volume_ml IS
    'Volume of urine passed in millilitres.';
COMMENT ON COLUMN partogram_observation.urine_protein IS
    'Urine protein dipstick: negative, trace, +, ++, or +++.';
COMMENT ON COLUMN partogram_observation.urine_ketones IS
    'Urine ketones (acetone) dipstick: negative, trace, +, ++, or +++.';
COMMENT ON COLUMN partogram_observation.urine_glucose IS
    'Urine glucose dipstick: negative, trace, +, ++, or +++.';
COMMENT ON COLUMN partogram_observation.oxytocin_rate IS
    'Oxytocin infusion rate (drops per minute or mU/min).';
COMMENT ON COLUMN partogram_observation.drugs_and_fluids IS
    'Free-text record of other drugs and intravenous fluids given.';
