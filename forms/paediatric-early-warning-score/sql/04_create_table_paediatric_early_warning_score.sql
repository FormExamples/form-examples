-- Main paediatric early warning score (PEWS) observation record: the raw
-- physiological observations captured at a single set of measurements, plus
-- the recording context (age band, care setting, observation timestamp) and
-- the two documented-concern override triggers. The age band is selected
-- first and drives the normal ranges for the rate parameters. Per-parameter
-- sub-scores, the aggregate total, escalation band, fired rules, and flags
-- live in dedicated child tables. Raw numeric observations use NULL when a
-- measurement was not recorded.

CREATE TABLE paediatric_early_warning_score (
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
    care_setting VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (care_setting IN ('ward', 'childrens-assessment-unit', 'emergency-department', 'other', '')),

    -- Age band: selected first; sets the normal ranges for the rate parameters
    age_band VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (age_band IN ('neonate', 'infant', 'young-child', 'child', 'adolescent', '')),

    -- Respiratory domain: rate (scored vs age band), effort/recession, SpO2, oxygen
    respiratory_rate INTEGER,
    respiratory_effort VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (respiratory_effort IN ('none', 'mild', 'moderate', 'severe', '')),
    oxygen_saturation INTEGER,
    supplemental_oxygen VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (supplemental_oxygen IN ('room-air', 'low-flow', 'high-flow', '')),

    -- Cardiovascular domain: heart rate (scored vs age band), capillary refill/colour
    heart_rate INTEGER,
    capillary_refill VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (capillary_refill IN ('under-2s', '2-3s', '3-4s', 'over-4s', '')),

    -- Behaviour / neurological domain: ACVPU
    consciousness_acvpu VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (consciousness_acvpu IN ('alert', 'voice', 'pain', 'unresponsive', '')),

    -- Override triggers (documented concern)
    nurse_concern VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (nurse_concern IN ('yes', 'no', '')),
    parent_concern VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (parent_concern IN ('yes', 'no', '')),

    clinical_notes TEXT NOT NULL DEFAULT ''
);

CREATE INDEX paediatric_early_warning_score_patient_id_idx
    ON paediatric_early_warning_score (patient_id);
CREATE INDEX paediatric_early_warning_score_clinician_id_idx
    ON paediatric_early_warning_score (clinician_id);

CREATE TRIGGER trigger_paediatric_early_warning_score_updated_at
    BEFORE UPDATE ON paediatric_early_warning_score
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE paediatric_early_warning_score IS
    'Main PEWS observation record: raw physiological observations for a single measurement set plus recording context (age band, care setting, observation timestamp) and the documented-concern override triggers. Sub-scores, aggregate, escalation band, rules, and flags live in child tables.';
COMMENT ON COLUMN paediatric_early_warning_score.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN paediatric_early_warning_score.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN paediatric_early_warning_score.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN paediatric_early_warning_score.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN paediatric_early_warning_score.patient_id IS
    'Foreign key to the child observed (RESTRICT: patients are not deleted while observations exist).';
COMMENT ON COLUMN paediatric_early_warning_score.clinician_id IS
    'Foreign key to the clinician who recorded the observation set (RESTRICT); NULL until assigned.';
COMMENT ON COLUMN paediatric_early_warning_score.status IS
    'Workflow status: draft, submitted, amended, or signed.';
COMMENT ON COLUMN paediatric_early_warning_score.observation_at IS
    'Date and time the observation set was taken; NULL when not yet recorded.';
COMMENT ON COLUMN paediatric_early_warning_score.care_setting IS
    'Care setting where the observations were recorded: ward, childrens-assessment-unit, emergency-department, or other.';
COMMENT ON COLUMN paediatric_early_warning_score.age_band IS
    'Age band selected first; sets the normal respiratory-rate and heart-rate ranges: neonate (0-<1 month), infant (1-11 months), young-child (1-4 years), child (5-11 years), or adolescent (>=12 years).';
COMMENT ON COLUMN paediatric_early_warning_score.respiratory_rate IS
    'Respiratory rate in breaths per minute, scored against the age-band normal range; NULL when not recorded.';
COMMENT ON COLUMN paediatric_early_warning_score.respiratory_effort IS
    'Respiratory effort / recession: none, mild, moderate, or severe (grunting).';
COMMENT ON COLUMN paediatric_early_warning_score.oxygen_saturation IS
    'Oxygen saturation (SpO2) as a percentage; NULL when not recorded.';
COMMENT ON COLUMN paediatric_early_warning_score.supplemental_oxygen IS
    'Supplemental-oxygen requirement: room-air, low-flow, or high-flow.';
COMMENT ON COLUMN paediatric_early_warning_score.heart_rate IS
    'Heart rate in beats per minute, scored against the age-band normal range; NULL when not recorded.';
COMMENT ON COLUMN paediatric_early_warning_score.capillary_refill IS
    'Capillary refill time / colour: under-2s, 2-3s, 3-4s, or over-4s.';
COMMENT ON COLUMN paediatric_early_warning_score.consciousness_acvpu IS
    'Consciousness level on the ACVPU scale: alert, voice, pain, or unresponsive.';
COMMENT ON COLUMN paediatric_early_warning_score.nurse_concern IS
    'Documented nurse / staff concern: an independent escalation trigger.';
COMMENT ON COLUMN paediatric_early_warning_score.parent_concern IS
    'Documented parent / carer concern: an independent escalation trigger.';
COMMENT ON COLUMN paediatric_early_warning_score.clinical_notes IS
    'Free-text clinical notes accompanying the observation set.';
