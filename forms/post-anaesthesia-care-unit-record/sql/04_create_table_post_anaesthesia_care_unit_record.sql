-- Main post-anaesthesia care unit (PACU) recovery record: recovery
-- context, patient identification, the five Modified Aldrete parameter
-- inputs (activity, respiration, circulation, consciousness, oxygen
-- saturation), airway / pain / PONV observations, and the optional
-- PADSS criterion inputs used for day-surgery discharge. The computed
-- grade, fired rules, and flags live in dedicated child tables.

CREATE TABLE post_anaesthesia_care_unit_record (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Step 1: recovery context
    nurse_name VARCHAR(255) NOT NULL DEFAULT '',
    nurse_role VARCHAR(20) NOT NULL DEFAULT '' CHECK (nurse_role IN ('recovery-nurse', 'odp', 'anaesthetist', 'other', '')),
    anaesthetist_name VARCHAR(255) NOT NULL DEFAULT '',
    admitted_at TIMESTAMPTZ,
    anaesthetic_technique VARCHAR(20) NOT NULL DEFAULT '' CHECK (anaesthetic_technique IN ('general', 'regional', 'sedation', 'combined', '')),
    procedure TEXT NOT NULL DEFAULT '',

    -- Step 2: patient identification
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    age_band VARCHAR(10) NOT NULL DEFAULT '' CHECK (age_band IN ('16-39', '40-59', '60-74', '75-plus', '')),
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),
    asa_status VARCHAR(5) NOT NULL DEFAULT '' CHECK (asa_status IN ('I', 'II', 'III', 'IV', 'V', '')),
    baseline_systolic_bp NUMERIC(4,0),
    ambulatory_case VARCHAR(5) NOT NULL DEFAULT '' CHECK (ambulatory_case IN ('yes', 'no', '')),

    -- Steps 3-7: Modified Aldrete parameter inputs (each maps to a 0/1/2 level)
    activity VARCHAR(20) NOT NULL DEFAULT '' CHECK (activity IN ('all-four', 'two', 'none', '')),
    respiration VARCHAR(20) NOT NULL DEFAULT '' CHECK (respiration IN ('deep-cough', 'limited', 'apnoeic', '')),
    circulation VARCHAR(20) NOT NULL DEFAULT '' CHECK (circulation IN ('within-20', 'within-50', 'over-50', '')),
    consciousness VARCHAR(20) NOT NULL DEFAULT '' CHECK (consciousness IN ('awake', 'arousable', 'unresponsive', '')),
    oxygen_saturation VARCHAR(20) NOT NULL DEFAULT '' CHECK (oxygen_saturation IN ('room-air', 'needs-o2', 'low-on-o2', '')),

    -- Step 8: airway, pain and PONV
    airway_status VARCHAR(20) NOT NULL DEFAULT '' CHECK (airway_status IN ('patent', 'oral-airway', 'other', '')),
    pain_score NUMERIC(3,0),
    ponv_severity VARCHAR(20) NOT NULL DEFAULT '' CHECK (ponv_severity IN ('none', 'mild', 'moderate', 'severe', '')),
    analgesia_given TEXT NOT NULL DEFAULT '',
    antiemetics_given TEXT NOT NULL DEFAULT '',

    -- Step 9: PADSS criterion inputs (optional; ambulatory cases only, each 0/1/2)
    padss_vital_signs VARCHAR(20) NOT NULL DEFAULT '' CHECK (padss_vital_signs IN ('within-20', 'within-40', 'over-40', '')),
    padss_ambulation VARCHAR(20) NOT NULL DEFAULT '' CHECK (padss_ambulation IN ('steady', 'with-assistance', 'unable', '')),
    padss_nausea_vomiting VARCHAR(20) NOT NULL DEFAULT '' CHECK (padss_nausea_vomiting IN ('minimal', 'moderate', 'severe', '')),
    padss_pain VARCHAR(20) NOT NULL DEFAULT '' CHECK (padss_pain IN ('minimal', 'moderate', 'severe', '')),
    padss_surgical_bleeding VARCHAR(20) NOT NULL DEFAULT '' CHECK (padss_surgical_bleeding IN ('minimal', 'moderate', 'severe', '')),

    -- Step 10: clinician free-text recovery note
    recovery_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX post_anaesthesia_care_unit_record_patient_id_idx
    ON post_anaesthesia_care_unit_record (patient_id);
CREATE INDEX post_anaesthesia_care_unit_record_clinician_id_idx
    ON post_anaesthesia_care_unit_record (clinician_id);

CREATE TRIGGER trigger_post_anaesthesia_care_unit_record_updated_at
    BEFORE UPDATE ON post_anaesthesia_care_unit_record
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE post_anaesthesia_care_unit_record IS
    'Main PACU recovery record: recovery context, patient identification, the five Modified Aldrete parameter inputs, airway / pain / PONV observations, and the optional PADSS criterion inputs for day-surgery discharge.';
COMMENT ON COLUMN post_anaesthesia_care_unit_record.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN post_anaesthesia_care_unit_record.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN post_anaesthesia_care_unit_record.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN post_anaesthesia_care_unit_record.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN post_anaesthesia_care_unit_record.patient_id IS
    'Foreign key to the patient in recovery (delete restricted).';
COMMENT ON COLUMN post_anaesthesia_care_unit_record.clinician_id IS
    'Foreign key to the recording recovery clinician (optional; delete restricted).';
COMMENT ON COLUMN post_anaesthesia_care_unit_record.nurse_name IS
    'Name of the recording recovery nurse as documented on the record.';
COMMENT ON COLUMN post_anaesthesia_care_unit_record.nurse_role IS
    'Role of the recording staff member: recovery-nurse, odp, anaesthetist, or other.';
COMMENT ON COLUMN post_anaesthesia_care_unit_record.anaesthetist_name IS
    'Name of the supervising anaesthetist responsible for the case.';
COMMENT ON COLUMN post_anaesthesia_care_unit_record.admitted_at IS
    'Date and time of admission to the post-anaesthesia care unit.';
COMMENT ON COLUMN post_anaesthesia_care_unit_record.anaesthetic_technique IS
    'Anaesthetic technique used: general, regional, sedation, or combined.';
COMMENT ON COLUMN post_anaesthesia_care_unit_record.procedure IS
    'Operation or procedure performed before recovery.';
COMMENT ON COLUMN post_anaesthesia_care_unit_record.patient_identifier IS
    'Local patient identifier as recorded on the record.';
COMMENT ON COLUMN post_anaesthesia_care_unit_record.age_band IS
    'Adult age band: 16-39, 40-59, 60-74, or 75-plus.';
COMMENT ON COLUMN post_anaesthesia_care_unit_record.sex IS
    'Patient sex recorded for the record: female, male, intersex, or unknown.';
COMMENT ON COLUMN post_anaesthesia_care_unit_record.asa_status IS
    'ASA physical status (I-V) carried over from the pre-anaesthetic assessment.';
COMMENT ON COLUMN post_anaesthesia_care_unit_record.baseline_systolic_bp IS
    'Pre-anaesthetic baseline systolic blood pressure in mmHg, used as the circulation reference.';
COMMENT ON COLUMN post_anaesthesia_care_unit_record.ambulatory_case IS
    'Whether this is a day-surgery (ambulatory) case: yes enables PADSS street-fitness scoring.';
COMMENT ON COLUMN post_anaesthesia_care_unit_record.activity IS
    'Aldrete activity parameter: all-four (moves all four limbs, 2), two (moves two limbs, 1), or none (unable to move, 0).';
COMMENT ON COLUMN post_anaesthesia_care_unit_record.respiration IS
    'Aldrete respiration parameter: deep-cough (breathes deeply and coughs freely, 2), limited (dyspnoea or limited breathing, 1), or apnoeic (0).';
COMMENT ON COLUMN post_anaesthesia_care_unit_record.circulation IS
    'Aldrete circulation parameter versus baseline systolic BP: within-20 (within 20 mmHg, 2), within-50 (within 20-50 mmHg, 1), or over-50 (more than 50 mmHg, 0).';
COMMENT ON COLUMN post_anaesthesia_care_unit_record.consciousness IS
    'Aldrete consciousness parameter: awake (fully awake, 2), arousable (arousable on calling, 1), or unresponsive (0).';
COMMENT ON COLUMN post_anaesthesia_care_unit_record.oxygen_saturation IS
    'Aldrete oxygen-saturation parameter: room-air (SpO2 > 92% on room air, 2), needs-o2 (needs oxygen to maintain SpO2 > 90%, 1), or low-on-o2 (SpO2 < 90% even with oxygen, 0).';
COMMENT ON COLUMN post_anaesthesia_care_unit_record.airway_status IS
    'Airway status in recovery: patent, oral-airway (oral/nasal airway in situ), or other support.';
COMMENT ON COLUMN post_anaesthesia_care_unit_record.pain_score IS
    'Pain score on the verbal / numeric rating scale (0-10).';
COMMENT ON COLUMN post_anaesthesia_care_unit_record.ponv_severity IS
    'Post-operative nausea and vomiting severity: none, mild, moderate, or severe.';
COMMENT ON COLUMN post_anaesthesia_care_unit_record.analgesia_given IS
    'Free-text record of analgesics administered in the PACU.';
COMMENT ON COLUMN post_anaesthesia_care_unit_record.antiemetics_given IS
    'Free-text record of antiemetics administered in the PACU.';
COMMENT ON COLUMN post_anaesthesia_care_unit_record.padss_vital_signs IS
    'PADSS vital-signs criterion versus baseline: within-20 (within 20%, 2), within-40 (20-40%, 1), or over-40 (more than 40%, 0).';
COMMENT ON COLUMN post_anaesthesia_care_unit_record.padss_ambulation IS
    'PADSS ambulation criterion: steady (steady gait, no dizziness, 2), with-assistance (needs assistance, 1), or unable (unable / dizzy, 0).';
COMMENT ON COLUMN post_anaesthesia_care_unit_record.padss_nausea_vomiting IS
    'PADSS nausea-and-vomiting criterion: minimal (2), moderate (1), or severe (0).';
COMMENT ON COLUMN post_anaesthesia_care_unit_record.padss_pain IS
    'PADSS pain criterion: minimal (2), moderate (1), or severe (0).';
COMMENT ON COLUMN post_anaesthesia_care_unit_record.padss_surgical_bleeding IS
    'PADSS surgical-bleeding criterion: minimal (2), moderate (1), or severe (0).';
COMMENT ON COLUMN post_anaesthesia_care_unit_record.recovery_note IS
    'Free-text recovery note recorded with the assessment.';
