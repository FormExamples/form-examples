-- Main NEWS2 observation record: the raw physiological observations
-- captured at a single set of vital-sign measurements, plus the
-- recording context (ward/location, observation timestamp, SpO2 scale,
-- and supplemental-oxygen details). Per-parameter subscores, the
-- aggregate total, risk band, fired rules, and safety flags live in
-- dedicated child tables. Raw numeric observations use NULL when a
-- measurement was not recorded.

CREATE TABLE national_early_warning_score_2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'amended', 'signed')),

    -- Recording context
    observation_at TIMESTAMPTZ,
    ward_or_location VARCHAR(255) NOT NULL DEFAULT '',

    -- SpO2 scale selection and Scale 2 clinician endorsement
    spo2_scale VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (spo2_scale IN ('scale-1', 'scale-2', '')),
    spo2_scale2_endorsed VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (spo2_scale2_endorsed IN ('yes', 'no', '')),

    -- Parameter 1: respiration rate (breaths/min)
    respiratory_rate INTEGER,

    -- Parameter 2: oxygen saturation (%)
    spo2 INTEGER,

    -- Parameter 3: air or supplemental oxygen
    on_oxygen VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (on_oxygen IN ('air', 'oxygen', '')),
    oxygen_device VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (oxygen_device IN ('nasal-cannula', 'simple-face-mask', 'venturi-mask', 'non-rebreather-mask', 'humidified', 'cpap', 'niv', 'tracheostomy', 'ventilator', 'other', '')),
    oxygen_flow_rate_l_min NUMERIC(4,1),
    inspired_oxygen_fraction_percent INTEGER,

    -- Parameter 4: systolic blood pressure (mmHg)
    systolic_blood_pressure INTEGER,

    -- Parameter 5: pulse (beats/min)
    pulse INTEGER,

    -- Parameter 6: consciousness (ACVPU)
    consciousness_acvpu VARCHAR(1) NOT NULL DEFAULT ''
        CHECK (consciousness_acvpu IN ('A', 'C', 'V', 'P', 'U', '')),

    -- Parameter 7: temperature (degrees Celsius)
    temperature NUMERIC(4,1),

    -- Clinical context affecting scope of NEWS2 validity
    is_under_16 VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (is_under_16 IN ('yes', 'no', '')),
    is_pregnant VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (is_pregnant IN ('yes', 'no', '')),
    has_spinal_cord_injury VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (has_spinal_cord_injury IN ('yes', 'no', '')),

    clinical_notes TEXT NOT NULL DEFAULT ''
);

CREATE INDEX national_early_warning_score_2_patient_id_idx
    ON national_early_warning_score_2 (patient_id);
CREATE INDEX national_early_warning_score_2_clinician_id_idx
    ON national_early_warning_score_2 (clinician_id);

CREATE TRIGGER trigger_national_early_warning_score_2_updated_at
    BEFORE UPDATE ON national_early_warning_score_2
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE national_early_warning_score_2 IS
    'Main NEWS2 observation record: raw physiological observations for a single vital-sign set plus recording context (ward/location, observation timestamp, SpO2 scale, supplemental-oxygen details). Subscores, aggregate, risk band, rules, and flags live in child tables.';
COMMENT ON COLUMN national_early_warning_score_2.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN national_early_warning_score_2.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN national_early_warning_score_2.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN national_early_warning_score_2.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN national_early_warning_score_2.patient_id IS
    'Foreign key to the patient observed (RESTRICT: patients are not deleted while observations exist).';
COMMENT ON COLUMN national_early_warning_score_2.clinician_id IS
    'Foreign key to the clinician who recorded the observation set (RESTRICT); NULL until assigned.';
COMMENT ON COLUMN national_early_warning_score_2.status IS
    'Workflow status: draft, submitted, amended, or signed.';
COMMENT ON COLUMN national_early_warning_score_2.observation_at IS
    'Date and time the observation set was taken; NULL when not yet recorded.';
COMMENT ON COLUMN national_early_warning_score_2.ward_or_location IS
    'Ward or clinical location where the observations were recorded.';
COMMENT ON COLUMN national_early_warning_score_2.spo2_scale IS
    'SpO2 scoring scale: scale-1 (default) or scale-2 (prescribed 88-92% target, e.g. hypercapnic respiratory failure).';
COMMENT ON COLUMN national_early_warning_score_2.spo2_scale2_endorsed IS
    'Whether a clinician has endorsed use of Scale 2 for this patient.';
COMMENT ON COLUMN national_early_warning_score_2.respiratory_rate IS
    'Respiration rate in breaths per minute; NULL when not recorded.';
COMMENT ON COLUMN national_early_warning_score_2.spo2 IS
    'Oxygen saturation as a percentage; NULL when not recorded.';
COMMENT ON COLUMN national_early_warning_score_2.on_oxygen IS
    'Whether the patient is breathing air or receiving supplemental oxygen.';
COMMENT ON COLUMN national_early_warning_score_2.oxygen_device IS
    'Supplemental-oxygen delivery device when on oxygen.';
COMMENT ON COLUMN national_early_warning_score_2.oxygen_flow_rate_l_min IS
    'Supplemental-oxygen flow rate in litres per minute; NULL when not recorded.';
COMMENT ON COLUMN national_early_warning_score_2.inspired_oxygen_fraction_percent IS
    'Fraction of inspired oxygen (FiO2) as a percentage; NULL when not recorded.';
COMMENT ON COLUMN national_early_warning_score_2.systolic_blood_pressure IS
    'Systolic blood pressure in mmHg; NULL when not recorded.';
COMMENT ON COLUMN national_early_warning_score_2.pulse IS
    'Pulse rate in beats per minute; NULL when not recorded.';
COMMENT ON COLUMN national_early_warning_score_2.consciousness_acvpu IS
    'Consciousness level on the ACVPU scale: A (alert), C (new confusion), V (voice), P (pain), U (unresponsive).';
COMMENT ON COLUMN national_early_warning_score_2.temperature IS
    'Body temperature in degrees Celsius; NULL when not recorded.';
COMMENT ON COLUMN national_early_warning_score_2.is_under_16 IS
    'Whether the patient is under 16 years old (NEWS2 not validated; raises out-of-scope flag).';
COMMENT ON COLUMN national_early_warning_score_2.is_pregnant IS
    'Whether the patient is pregnant (NEWS2 not validated; raises out-of-scope flag).';
COMMENT ON COLUMN national_early_warning_score_2.has_spinal_cord_injury IS
    'Whether the patient has a spinal-cord injury (NEWS2 not validated; raises out-of-scope flag).';
COMMENT ON COLUMN national_early_warning_score_2.clinical_notes IS
    'Free-text clinical notes accompanying the observation set.';
