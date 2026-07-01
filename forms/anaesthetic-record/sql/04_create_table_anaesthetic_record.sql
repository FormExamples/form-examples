-- Main anaesthetic record: the contemporaneous intra-operative anaesthesia
-- chart. Holds case identification, pre-induction checks, ASA and airway
-- assessment, airway management, monitoring, anaesthetic technique, fluids
-- and blood loss, regional / neuraxial technique, recovery handover, and
-- sign-off. Drug administrations, timed physiological observations, and
-- intra-operative events live in dedicated child tables.

CREATE TABLE anaesthetic_record (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Case identification
    theatre VARCHAR(100) NOT NULL DEFAULT '',
    operation_date DATE,
    anaesthetist_name VARCHAR(255) NOT NULL DEFAULT '',
    assistant_name VARCHAR(255) NOT NULL DEFAULT '',
    surgeon_name VARCHAR(255) NOT NULL DEFAULT '',
    planned_procedure TEXT NOT NULL DEFAULT '',
    urgency VARCHAR(20) NOT NULL DEFAULT '' CHECK (urgency IN ('elective', 'urgent', 'emergency', 'immediate', '')),

    -- Pre-induction checks
    machine_checked VARCHAR(5) NOT NULL DEFAULT '' CHECK (machine_checked IN ('yes', 'no', '')),
    who_sign_in VARCHAR(5) NOT NULL DEFAULT '' CHECK (who_sign_in IN ('yes', 'no', '')),
    who_time_out VARCHAR(5) NOT NULL DEFAULT '' CHECK (who_time_out IN ('yes', 'no', '')),
    consent_confirmed VARCHAR(5) NOT NULL DEFAULT '' CHECK (consent_confirmed IN ('yes', 'no', '')),
    fasting_confirmed VARCHAR(5) NOT NULL DEFAULT '' CHECK (fasting_confirmed IN ('yes', 'no', '')),
    iv_access TEXT NOT NULL DEFAULT '',
    allergy_band_checked VARCHAR(5) NOT NULL DEFAULT '' CHECK (allergy_band_checked IN ('yes', 'no', '')),
    documented_allergies TEXT NOT NULL DEFAULT '',

    -- ASA & airway assessment
    asa_status VARCHAR(5) NOT NULL DEFAULT '' CHECK (asa_status IN ('I', 'II', 'III', 'IV', 'V', 'VI', '')),
    asa_emergency_modifier VARCHAR(5) NOT NULL DEFAULT '' CHECK (asa_emergency_modifier IN ('yes', 'no', '')),
    mallampati_class INTEGER CHECK (mallampati_class IS NULL OR mallampati_class BETWEEN 1 AND 4),
    mouth_opening_cm NUMERIC(4,1) CHECK (mouth_opening_cm IS NULL OR mouth_opening_cm >= 0),
    thyromental_distance_cm NUMERIC(4,1) CHECK (thyromental_distance_cm IS NULL OR thyromental_distance_cm >= 0),
    dentition TEXT NOT NULL DEFAULT '',
    anticipated_difficult_airway VARCHAR(5) NOT NULL DEFAULT '' CHECK (anticipated_difficult_airway IN ('yes', 'no', '')),
    prior_difficult_intubation VARCHAR(5) NOT NULL DEFAULT '' CHECK (prior_difficult_intubation IN ('yes', 'no', '')),

    -- Airway management
    airway_technique VARCHAR(20) NOT NULL DEFAULT '' CHECK (airway_technique IN ('facemask', 'supraglottic', 'tracheal-tube', 'tracheostomy', 'awake-foi', '')),
    device_size VARCHAR(60) NOT NULL DEFAULT '',
    tube_depth_cm NUMERIC(4,1) CHECK (tube_depth_cm IS NULL OR tube_depth_cm >= 0),
    cuffed VARCHAR(5) NOT NULL DEFAULT '' CHECK (cuffed IN ('yes', 'no', '')),
    cormack_lehane_grade INTEGER CHECK (cormack_lehane_grade IS NULL OR cormack_lehane_grade BETWEEN 1 AND 4),
    intubation_attempts INTEGER CHECK (intubation_attempts IS NULL OR intubation_attempts >= 0),
    capnography_confirmed VARCHAR(5) NOT NULL DEFAULT '' CHECK (capnography_confirmed IN ('yes', 'no', '')),

    -- Monitoring (multi-select stored as a space-separated token list)
    monitoring_modalities TEXT NOT NULL DEFAULT '',

    -- Anaesthetic technique
    anaesthetic_technique VARCHAR(20) NOT NULL DEFAULT '' CHECK (anaesthetic_technique IN ('general', 'regional', 'sedation', 'mac', 'combined', '')),

    -- Fluids & blood loss
    crystalloid_ml NUMERIC(7,1) CHECK (crystalloid_ml IS NULL OR crystalloid_ml >= 0),
    colloid_ml NUMERIC(7,1) CHECK (colloid_ml IS NULL OR colloid_ml >= 0),
    blood_products_ml NUMERIC(7,1) CHECK (blood_products_ml IS NULL OR blood_products_ml >= 0),
    estimated_blood_loss_ml NUMERIC(7,1) CHECK (estimated_blood_loss_ml IS NULL OR estimated_blood_loss_ml >= 0),
    urine_output_ml NUMERIC(7,1) CHECK (urine_output_ml IS NULL OR urine_output_ml >= 0),
    cell_salvage_ml NUMERIC(7,1) CHECK (cell_salvage_ml IS NULL OR cell_salvage_ml >= 0),

    -- Regional / neuraxial
    regional_technique VARCHAR(20) NOT NULL DEFAULT '' CHECK (regional_technique IN ('none', 'spinal', 'epidural', 'cse', 'peripheral-block', '')),
    regional_level VARCHAR(100) NOT NULL DEFAULT '',
    regional_drug VARCHAR(255) NOT NULL DEFAULT '',
    regional_dose_mg NUMERIC(7,2) CHECK (regional_dose_mg IS NULL OR regional_dose_mg >= 0),
    block_height VARCHAR(100) NOT NULL DEFAULT '',
    regional_complications TEXT NOT NULL DEFAULT '',

    -- Recovery handover
    recovery_destination VARCHAR(20) NOT NULL DEFAULT '' CHECK (recovery_destination IN ('recovery', 'hdu', 'icu', 'ward', '')),
    handover_airway_status TEXT NOT NULL DEFAULT '',
    analgesia_plan TEXT NOT NULL DEFAULT '',
    antiemetic_plan TEXT NOT NULL DEFAULT '',
    oxygen_plan TEXT NOT NULL DEFAULT '',
    outstanding_tasks TEXT NOT NULL DEFAULT '',
    handover_at TIMESTAMPTZ,
    receiving_practitioner VARCHAR(255) NOT NULL DEFAULT '',

    -- Sign-off
    anaesthetist_signature TEXT NOT NULL DEFAULT '',
    signed_at TIMESTAMPTZ
);

CREATE TRIGGER trigger_anaesthetic_record_updated_at
    BEFORE UPDATE ON anaesthetic_record
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE anaesthetic_record IS
    'Contemporaneous intra-operative anaesthesia chart: case identification, pre-induction checks, ASA and airway assessment, airway management, monitoring, technique, fluids, regional technique, recovery handover, and sign-off.';
COMMENT ON COLUMN anaesthetic_record.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN anaesthetic_record.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN anaesthetic_record.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN anaesthetic_record.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN anaesthetic_record.patient_id IS
    'Foreign key to the patient who received the anaesthetic.';
COMMENT ON COLUMN anaesthetic_record.clinician_id IS
    'Foreign key to the responsible anaesthetist (primary author of the record).';
COMMENT ON COLUMN anaesthetic_record.theatre IS
    'Theatre or location where the anaesthetic was delivered.';
COMMENT ON COLUMN anaesthetic_record.operation_date IS
    'Date of the anaesthetic.';
COMMENT ON COLUMN anaesthetic_record.anaesthetist_name IS
    'Name of the responsible anaesthetist as recorded on the chart.';
COMMENT ON COLUMN anaesthetic_record.assistant_name IS
    'Name of the ODP or anaesthetic assistant.';
COMMENT ON COLUMN anaesthetic_record.surgeon_name IS
    'Name of the operating surgeon.';
COMMENT ON COLUMN anaesthetic_record.planned_procedure IS
    'Planned operation or procedure.';
COMMENT ON COLUMN anaesthetic_record.urgency IS
    'Case urgency: elective, urgent, emergency, or immediate.';
COMMENT ON COLUMN anaesthetic_record.machine_checked IS
    'Whether the anaesthetic machine check was performed: yes or no.';
COMMENT ON COLUMN anaesthetic_record.who_sign_in IS
    'Whether the WHO Sign In was performed: yes or no.';
COMMENT ON COLUMN anaesthetic_record.who_time_out IS
    'Whether the WHO Time Out was performed: yes or no.';
COMMENT ON COLUMN anaesthetic_record.consent_confirmed IS
    'Whether consent was confirmed: yes or no.';
COMMENT ON COLUMN anaesthetic_record.fasting_confirmed IS
    'Whether fasting status was confirmed: yes or no.';
COMMENT ON COLUMN anaesthetic_record.iv_access IS
    'Intravenous access sites established.';
COMMENT ON COLUMN anaesthetic_record.allergy_band_checked IS
    'Whether the allergy band was checked: yes or no.';
COMMENT ON COLUMN anaesthetic_record.documented_allergies IS
    'Documented allergies used for the drug allergy-conflict safety check.';
COMMENT ON COLUMN anaesthetic_record.asa_status IS
    'ASA Physical Status classification: I, II, III, IV, V, or VI.';
COMMENT ON COLUMN anaesthetic_record.asa_emergency_modifier IS
    'Whether the ASA E (emergency) modifier applies: yes or no.';
COMMENT ON COLUMN anaesthetic_record.mallampati_class IS
    'Modified Mallampati class (1-4).';
COMMENT ON COLUMN anaesthetic_record.mouth_opening_cm IS
    'Inter-incisor gap (mouth opening) in centimetres.';
COMMENT ON COLUMN anaesthetic_record.thyromental_distance_cm IS
    'Thyromental distance in centimetres.';
COMMENT ON COLUMN anaesthetic_record.dentition IS
    'Dentition notes, including loose or capped teeth.';
COMMENT ON COLUMN anaesthetic_record.anticipated_difficult_airway IS
    'Whether a difficult airway was anticipated: yes or no.';
COMMENT ON COLUMN anaesthetic_record.prior_difficult_intubation IS
    'Whether there is a history of prior difficult intubation: yes or no.';
COMMENT ON COLUMN anaesthetic_record.airway_technique IS
    'Airway technique used: facemask, supraglottic, tracheal-tube, tracheostomy, or awake-foi.';
COMMENT ON COLUMN anaesthetic_record.device_size IS
    'Airway device or tube size.';
COMMENT ON COLUMN anaesthetic_record.tube_depth_cm IS
    'Tracheal tube depth at the teeth in centimetres.';
COMMENT ON COLUMN anaesthetic_record.cuffed IS
    'Whether the airway device was cuffed: yes or no.';
COMMENT ON COLUMN anaesthetic_record.cormack_lehane_grade IS
    'Cormack-Lehane grade of the laryngoscopic view (1-4).';
COMMENT ON COLUMN anaesthetic_record.intubation_attempts IS
    'Number of intubation attempts.';
COMMENT ON COLUMN anaesthetic_record.capnography_confirmed IS
    'Whether airway placement was confirmed by capnography: yes or no.';
COMMENT ON COLUMN anaesthetic_record.monitoring_modalities IS
    'Monitoring modalities in use as a space-separated token list (e.g. ecg nibp spo2 capnography temperature neuromuscular depth-of-anaesthesia arterial-line cvp urine-output).';
COMMENT ON COLUMN anaesthetic_record.anaesthetic_technique IS
    'Primary anaesthetic technique: general, regional, sedation, mac, or combined.';
COMMENT ON COLUMN anaesthetic_record.crystalloid_ml IS
    'Crystalloid volume administered in millilitres.';
COMMENT ON COLUMN anaesthetic_record.colloid_ml IS
    'Colloid volume administered in millilitres.';
COMMENT ON COLUMN anaesthetic_record.blood_products_ml IS
    'Blood products volume administered in millilitres.';
COMMENT ON COLUMN anaesthetic_record.estimated_blood_loss_ml IS
    'Estimated blood loss in millilitres.';
COMMENT ON COLUMN anaesthetic_record.urine_output_ml IS
    'Urine output in millilitres.';
COMMENT ON COLUMN anaesthetic_record.cell_salvage_ml IS
    'Cell-salvaged blood returned to the patient in millilitres.';
COMMENT ON COLUMN anaesthetic_record.regional_technique IS
    'Regional / neuraxial technique: none, spinal, epidural, cse, or peripheral-block.';
COMMENT ON COLUMN anaesthetic_record.regional_level IS
    'Interspace or anatomical target of the regional technique.';
COMMENT ON COLUMN anaesthetic_record.regional_drug IS
    'Local anaesthetic agent used for the regional technique.';
COMMENT ON COLUMN anaesthetic_record.regional_dose_mg IS
    'Regional local anaesthetic dose in milligrams.';
COMMENT ON COLUMN anaesthetic_record.block_height IS
    'Achieved block height or clinical effect.';
COMMENT ON COLUMN anaesthetic_record.regional_complications IS
    'Complications of the regional technique.';
COMMENT ON COLUMN anaesthetic_record.recovery_destination IS
    'Post-anaesthetic destination: recovery, hdu, icu, or ward.';
COMMENT ON COLUMN anaesthetic_record.handover_airway_status IS
    'Airway status at handover to the recovery team.';
COMMENT ON COLUMN anaesthetic_record.analgesia_plan IS
    'Post-operative analgesia plan.';
COMMENT ON COLUMN anaesthetic_record.antiemetic_plan IS
    'Post-operative antiemetic plan.';
COMMENT ON COLUMN anaesthetic_record.oxygen_plan IS
    'Post-operative oxygen therapy plan.';
COMMENT ON COLUMN anaesthetic_record.outstanding_tasks IS
    'Outstanding tasks handed over to the recovery team.';
COMMENT ON COLUMN anaesthetic_record.handover_at IS
    'Timestamp of handover to the recovery team.';
COMMENT ON COLUMN anaesthetic_record.receiving_practitioner IS
    'Name of the practitioner receiving the patient at handover.';
COMMENT ON COLUMN anaesthetic_record.anaesthetist_signature IS
    'Electronic signature of the anaesthetist at sign-off.';
COMMENT ON COLUMN anaesthetic_record.signed_at IS
    'Timestamp when the record was signed.';

CREATE INDEX anaesthetic_record_patient_id_idx
    ON anaesthetic_record (patient_id);
CREATE INDEX anaesthetic_record_clinician_id_idx
    ON anaesthetic_record (clinician_id);
