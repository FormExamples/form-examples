-- Main MEWS observation record: the raw physiological observations
-- captured at a single set of vital-sign measurements, plus the
-- recording context (care setting, ward/location, observation
-- timestamp) and the optional previous aggregate used only for the
-- deteriorating-trend flag. Per-parameter sub-scores, the aggregate
-- total, risk band, fired rules, and safety flags live in dedicated
-- child tables. Raw numeric observations use NULL when a measurement
-- was not recorded.

CREATE TABLE modified_early_warning_score (
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
    care_setting VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (care_setting IN ('acute-ward', 'admissions-unit', 'assessment-unit', 'other', '')),
    ward_or_location VARCHAR(255) NOT NULL DEFAULT '',

    -- Parameter 1: systolic blood pressure (mmHg)
    systolic_blood_pressure INTEGER,

    -- Parameter 2: heart rate (beats/min)
    heart_rate INTEGER,

    -- Parameter 3: respiratory rate (breaths/min)
    respiratory_rate INTEGER,

    -- Parameter 4: temperature (degrees Celsius)
    temperature NUMERIC(4,1),

    -- Parameter 5: consciousness (AVPU)
    consciousness_avpu VARCHAR(1) NOT NULL DEFAULT ''
        CHECK (consciousness_avpu IN ('A', 'V', 'P', 'U', '')),

    -- Optional trend input: aggregate from the previous observation set,
    -- used only to compute the deteriorating-trend flag; never part of
    -- the aggregate itself.
    previous_mews_score INTEGER,

    clinical_notes TEXT NOT NULL DEFAULT ''
);

CREATE INDEX modified_early_warning_score_patient_id_idx
    ON modified_early_warning_score (patient_id);
CREATE INDEX modified_early_warning_score_clinician_id_idx
    ON modified_early_warning_score (clinician_id);

CREATE TRIGGER trigger_modified_early_warning_score_updated_at
    BEFORE UPDATE ON modified_early_warning_score
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE modified_early_warning_score IS
    'Main MEWS observation record: raw physiological observations for a single vital-sign set plus recording context (care setting, ward/location, observation timestamp) and the optional previous aggregate for the deteriorating-trend flag. Sub-scores, aggregate, risk band, rules, and flags live in child tables.';
COMMENT ON COLUMN modified_early_warning_score.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN modified_early_warning_score.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN modified_early_warning_score.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN modified_early_warning_score.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN modified_early_warning_score.patient_id IS
    'Foreign key to the patient observed (RESTRICT: patients are not deleted while observations exist).';
COMMENT ON COLUMN modified_early_warning_score.clinician_id IS
    'Foreign key to the clinician who recorded the observation set (RESTRICT); NULL until assigned.';
COMMENT ON COLUMN modified_early_warning_score.status IS
    'Workflow status: draft, submitted, amended, or signed.';
COMMENT ON COLUMN modified_early_warning_score.observation_at IS
    'Date and time the observation set was taken; NULL when not yet recorded.';
COMMENT ON COLUMN modified_early_warning_score.care_setting IS
    'Care setting where the observations were recorded: acute-ward, admissions-unit, assessment-unit, or other.';
COMMENT ON COLUMN modified_early_warning_score.ward_or_location IS
    'Ward or bed location where the observations were recorded.';
COMMENT ON COLUMN modified_early_warning_score.systolic_blood_pressure IS
    'Systolic blood pressure in mmHg; NULL when not recorded.';
COMMENT ON COLUMN modified_early_warning_score.heart_rate IS
    'Heart rate in beats per minute; NULL when not recorded.';
COMMENT ON COLUMN modified_early_warning_score.respiratory_rate IS
    'Respiratory rate in breaths per minute; NULL when not recorded.';
COMMENT ON COLUMN modified_early_warning_score.temperature IS
    'Body temperature in degrees Celsius; NULL when not recorded.';
COMMENT ON COLUMN modified_early_warning_score.consciousness_avpu IS
    'Consciousness level on the AVPU scale: A (alert), V (voice), P (pain), U (unresponsive).';
COMMENT ON COLUMN modified_early_warning_score.previous_mews_score IS
    'Aggregate MEWS from the previous observation set, used only to compute the deteriorating-trend flag; NULL when unavailable and never part of this aggregate.';
COMMENT ON COLUMN modified_early_warning_score.clinical_notes IS
    'Free-text clinical notes accompanying the observation set.';
