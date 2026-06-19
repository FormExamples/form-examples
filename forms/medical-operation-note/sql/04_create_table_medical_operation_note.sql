-- Main operation-note record: identification, timing, diagnoses,
-- anaesthesia summary, approach, counts, EBL, complications summary,
-- and post-operative plan. Operative steps, team members, procedures,
-- implants, drains, specimens, and complications live in dedicated
-- child tables.

CREATE TABLE medical_operation_note (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    lead_surgeon_id UUID NOT NULL REFERENCES clinician(id) ON DELETE RESTRICT,

    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'amended', 'signed', 'urgent')),

    -- Step 1: identification & timing
    hospital_name VARCHAR(255) NOT NULL DEFAULT '',
    theatre_number VARCHAR(20) NOT NULL DEFAULT '',
    list_type VARCHAR(20) NOT NULL DEFAULT '' CHECK (list_type IN ('elective', 'cepod', 'trauma', 'obstetric', 'day-case', 'endoscopy', '')),
    case_start_at TIMESTAMPTZ,
    anaesthesia_start_at TIMESTAMPTZ,
    knife_to_skin_at TIMESTAMPTZ,
    end_of_surgery_at TIMESTAMPTZ,
    case_end_at TIMESTAMPTZ,

    -- Step 2: patient context recorded at WHO Sign-In
    consent_status VARCHAR(20) NOT NULL DEFAULT '' CHECK (consent_status IN ('written', 'verbal', 'lasting-power-of-attorney', 'emergency-no-consent', 'declined', '')),
    side_marked VARCHAR(10) NOT NULL DEFAULT '' CHECK (side_marked IN ('yes', 'no', 'na', '')),
    sign_in_completed VARCHAR(5) NOT NULL DEFAULT '' CHECK (sign_in_completed IN ('yes', 'no', '')),
    asa_physical_status VARCHAR(5) NOT NULL DEFAULT '' CHECK (asa_physical_status IN ('I', 'II', 'III', 'IV', 'V', 'VI', '')),

    -- Step 4: diagnoses
    pre_operative_diagnosis TEXT NOT NULL DEFAULT '',
    post_operative_diagnosis TEXT NOT NULL DEFAULT '',
    indication TEXT NOT NULL DEFAULT '',
    urgency VARCHAR(20) NOT NULL DEFAULT '' CHECK (urgency IN ('elective', 'expedited', 'urgent', 'emergency', 'immediate', '')),
    laterality VARCHAR(10) NOT NULL DEFAULT '' CHECK (laterality IN ('left', 'right', 'bilateral', 'midline', 'na', '')),

    -- Step 5: anaesthesia
    anaesthesia_type VARCHAR(30) NOT NULL DEFAULT '' CHECK (anaesthesia_type IN ('general', 'regional', 'neuraxial', 'sedation', 'mac', 'local', 'combined-ga-regional', '')),
    airway_management VARCHAR(30) NOT NULL DEFAULT '' CHECK (airway_management IN ('face-mask', 'supraglottic', 'ett', 'awake-fibreoptic', 'surgical-airway', 'none', '')),
    induction_agent VARCHAR(255) NOT NULL DEFAULT '',
    maintenance_agent VARCHAR(255) NOT NULL DEFAULT '',
    neuromuscular_blockade VARCHAR(255) NOT NULL DEFAULT '',
    regional_block_description VARCHAR(500) NOT NULL DEFAULT '',
    invasive_monitoring TEXT NOT NULL DEFAULT '',
    intraop_crystalloid_ml INTEGER,
    intraop_colloid_ml INTEGER,
    intraop_blood_ml INTEGER,
    intraop_urine_ml INTEGER,
    anaesthetic_event VARCHAR(30) NOT NULL DEFAULT '' CHECK (anaesthetic_event IN ('none', 'failed-intubation', 'awareness', 'anaphylaxis', 'malignant-hyperthermia', 'suxamethonium-apnoea', 'hypoxia', 'arrhythmia', 'hypotension', 'other', '')),
    anaesthetic_event_description TEXT NOT NULL DEFAULT '',

    -- Step 6: position, prep & approach
    patient_position VARCHAR(30) NOT NULL DEFAULT '' CHECK (patient_position IN ('supine', 'prone', 'lateral-left', 'lateral-right', 'lithotomy', 'sitting', 'lloyd-davies', 'jackknife', 'other', '')),
    pressure_area_protection_notes TEXT NOT NULL DEFAULT '',
    prep_solution VARCHAR(40) NOT NULL DEFAULT '' CHECK (prep_solution IN ('chlorhexidine-alcohol', 'povidone-iodine', 'aqueous-chlorhexidine', 'aqueous-iodine', 'other', '')),
    drape_type VARCHAR(255) NOT NULL DEFAULT '',
    surgical_approach VARCHAR(60) NOT NULL DEFAULT '' CHECK (surgical_approach IN ('open', 'laparoscopic', 'robotic', 'endoscopic', 'arthroscopic', 'thoracoscopic', 'percutaneous', 'transluminal', 'other', '')),
    incision_type VARCHAR(255) NOT NULL DEFAULT '',
    incision_length_cm NUMERIC(5,1),
    table_tilt VARCHAR(30) NOT NULL DEFAULT '' CHECK (table_tilt IN ('neutral', 'trendelenburg', 'reverse-trendelenburg', 'lateral-left', 'lateral-right', 'other', '')),
    tourniquet_used VARCHAR(5) NOT NULL DEFAULT '' CHECK (tourniquet_used IN ('yes', 'no', '')),
    tourniquet_site VARCHAR(60) NOT NULL DEFAULT '',
    tourniquet_pressure_mmhg INTEGER,
    tourniquet_on_at TIMESTAMPTZ,
    tourniquet_off_at TIMESTAMPTZ,
    converted_to_open VARCHAR(5) NOT NULL DEFAULT '' CHECK (converted_to_open IN ('yes', 'no', '')),
    conversion_reason TEXT NOT NULL DEFAULT '',

    -- Step 7: findings & technique (free-text summary; numbered steps live in child table)
    operative_findings_summary TEXT NOT NULL DEFAULT '',
    pathology_found TEXT NOT NULL DEFAULT '',
    anatomical_anomalies TEXT NOT NULL DEFAULT '',
    intraop_photographs_taken VARCHAR(5) NOT NULL DEFAULT '' CHECK (intraop_photographs_taken IN ('yes', 'no', '')),
    frozen_section_requested VARCHAR(5) NOT NULL DEFAULT '' CHECK (frozen_section_requested IN ('yes', 'no', '')),

    -- Step 10: safety, counts, EBL
    swab_count_first_agreed VARCHAR(5) NOT NULL DEFAULT '' CHECK (swab_count_first_agreed IN ('yes', 'no', '')),
    swab_count_final_agreed VARCHAR(5) NOT NULL DEFAULT '' CHECK (swab_count_final_agreed IN ('yes', 'no', '')),
    needle_count_first_agreed VARCHAR(5) NOT NULL DEFAULT '' CHECK (needle_count_first_agreed IN ('yes', 'no', '')),
    needle_count_final_agreed VARCHAR(5) NOT NULL DEFAULT '' CHECK (needle_count_final_agreed IN ('yes', 'no', '')),
    instrument_count_first_agreed VARCHAR(5) NOT NULL DEFAULT '' CHECK (instrument_count_first_agreed IN ('yes', 'no', '')),
    instrument_count_final_agreed VARCHAR(5) NOT NULL DEFAULT '' CHECK (instrument_count_final_agreed IN ('yes', 'no', '')),
    count_discrepancy_resolution TEXT NOT NULL DEFAULT '',
    estimated_blood_loss_ml INTEGER CHECK (estimated_blood_loss_ml IS NULL OR estimated_blood_loss_ml >= 0),
    transfusion_given VARCHAR(5) NOT NULL DEFAULT '' CHECK (transfusion_given IN ('yes', 'no', '')),
    prbc_units INTEGER CHECK (prbc_units IS NULL OR prbc_units >= 0),
    ffp_units INTEGER CHECK (ffp_units IS NULL OR ffp_units >= 0),
    platelet_units INTEGER CHECK (platelet_units IS NULL OR platelet_units >= 0),
    cryoprecipitate_units INTEGER CHECK (cryoprecipitate_units IS NULL OR cryoprecipitate_units >= 0),
    cell_salvage_ml INTEGER CHECK (cell_salvage_ml IS NULL OR cell_salvage_ml >= 0),
    massive_haemorrhage_protocol_activated VARCHAR(5) NOT NULL DEFAULT '' CHECK (massive_haemorrhage_protocol_activated IN ('yes', 'no', '')),
    never_event_flagged VARCHAR(5) NOT NULL DEFAULT '' CHECK (never_event_flagged IN ('yes', 'no', '')),
    never_event_description TEXT NOT NULL DEFAULT '',
    equipment_problem VARCHAR(5) NOT NULL DEFAULT '' CHECK (equipment_problem IN ('yes', 'no', '')),
    equipment_problem_description TEXT NOT NULL DEFAULT '',

    -- Step 11: post-operative plan
    recovery_destination VARCHAR(20) NOT NULL DEFAULT '' CHECK (recovery_destination IN ('pacu', 'ward', 'enhanced-care', 'hdu', 'icu', 'day-case-discharge', '')),
    monitoring_frequency VARCHAR(60) NOT NULL DEFAULT '',
    iv_fluids_plan VARCHAR(255) NOT NULL DEFAULT '',
    analgesia_plan TEXT NOT NULL DEFAULT '',
    antibiotic_plan VARCHAR(255) NOT NULL DEFAULT '',
    vte_prophylaxis_plan VARCHAR(255) NOT NULL DEFAULT '',
    diet_plan VARCHAR(255) NOT NULL DEFAULT '' CHECK (diet_plan IN ('nbm', 'sips', 'fluids', 'soft', 'normal', 'as-tolerated', '')),
    mobilisation_plan VARCHAR(255) NOT NULL DEFAULT '',
    wound_care_plan TEXT NOT NULL DEFAULT '',
    follow_up_plan TEXT NOT NULL DEFAULT '',
    special_instructions TEXT NOT NULL DEFAULT '',
    sign_out_completed VARCHAR(5) NOT NULL DEFAULT '' CHECK (sign_out_completed IN ('yes', 'no', '')),
    debrief_completed VARCHAR(5) NOT NULL DEFAULT '' CHECK (debrief_completed IN ('yes', 'no', '')),

    -- Step 12: sign-off
    surgeon_override_grade VARCHAR(20) NOT NULL DEFAULT '' CHECK (surgeon_override_grade IN ('routine', 'complicated', 'high-risk', 'critical', '')),
    surgeon_override_reason TEXT NOT NULL DEFAULT '',
    attestation_text TEXT NOT NULL DEFAULT '',
    electronic_signature TEXT NOT NULL DEFAULT '',
    dictated_at TIMESTAMPTZ,
    signed_at TIMESTAMPTZ
);

CREATE TRIGGER trigger_medical_operation_note_updated_at
    BEFORE UPDATE ON medical_operation_note
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE medical_operation_note IS
    'Operating-team contemporaneous record of a surgical procedure: identification, timing, diagnoses, anaesthesia summary, approach, counts, EBL, complications summary, and post-operative plan.';
COMMENT ON COLUMN medical_operation_note.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_operation_note.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN medical_operation_note.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN medical_operation_note.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN medical_operation_note.patient_id IS
    'Foreign key to the patient who underwent the procedure.';
COMMENT ON COLUMN medical_operation_note.lead_surgeon_id IS
    'Foreign key to the lead operating surgeon (primary author of the note).';
COMMENT ON COLUMN medical_operation_note.status IS
    'Lifecycle status: draft, submitted, amended, signed, or urgent.';
COMMENT ON COLUMN medical_operation_note.hospital_name IS
    'Hospital or site where the procedure was performed.';
COMMENT ON COLUMN medical_operation_note.theatre_number IS
    'Operating theatre or OR identifier.';
COMMENT ON COLUMN medical_operation_note.list_type IS
    'Theatre list type: elective, cepod, trauma, obstetric, day-case, or endoscopy.';
COMMENT ON COLUMN medical_operation_note.case_start_at IS
    'Timestamp the patient arrived in theatre.';
COMMENT ON COLUMN medical_operation_note.anaesthesia_start_at IS
    'Timestamp anaesthesia induction began.';
COMMENT ON COLUMN medical_operation_note.knife_to_skin_at IS
    'Timestamp of first surgical incision.';
COMMENT ON COLUMN medical_operation_note.end_of_surgery_at IS
    'Timestamp of last surgical action (closure complete).';
COMMENT ON COLUMN medical_operation_note.case_end_at IS
    'Timestamp the patient left theatre.';
COMMENT ON COLUMN medical_operation_note.consent_status IS
    'Consent status at WHO Sign-In: written, verbal, lasting-power-of-attorney, emergency-no-consent, or declined.';
COMMENT ON COLUMN medical_operation_note.side_marked IS
    'Whether the operative side was marked pre-induction: yes, no, or na.';
COMMENT ON COLUMN medical_operation_note.sign_in_completed IS
    'Whether the WHO Sign-In checklist was completed.';
COMMENT ON COLUMN medical_operation_note.asa_physical_status IS
    'ASA Physical Status carried over from pre-op assessment (I-VI).';
COMMENT ON COLUMN medical_operation_note.pre_operative_diagnosis IS
    'Pre-operative diagnosis or working diagnosis.';
COMMENT ON COLUMN medical_operation_note.post_operative_diagnosis IS
    'Post-operative diagnosis or revised diagnosis after operative findings.';
COMMENT ON COLUMN medical_operation_note.indication IS
    'Clinical indication for the procedure.';
COMMENT ON COLUMN medical_operation_note.urgency IS
    'NCEPOD Classification of Intervention: elective, expedited, urgent, emergency, or immediate.';
COMMENT ON COLUMN medical_operation_note.laterality IS
    'Operative side: left, right, bilateral, midline, or na.';
COMMENT ON COLUMN medical_operation_note.anaesthesia_type IS
    'Primary anaesthetic technique used.';
COMMENT ON COLUMN medical_operation_note.airway_management IS
    'Airway management used: face-mask, supraglottic, ett, awake-fibreoptic, surgical-airway, or none.';
COMMENT ON COLUMN medical_operation_note.induction_agent IS
    'Anaesthetic induction agent(s) used.';
COMMENT ON COLUMN medical_operation_note.maintenance_agent IS
    'Anaesthetic maintenance agent(s) used.';
COMMENT ON COLUMN medical_operation_note.neuromuscular_blockade IS
    'Neuromuscular blocking agent(s) used.';
COMMENT ON COLUMN medical_operation_note.regional_block_description IS
    'Regional or neuraxial block details, if performed.';
COMMENT ON COLUMN medical_operation_note.invasive_monitoring IS
    'Invasive monitoring lines: arterial, CVC, PA, cardiac output, others.';
COMMENT ON COLUMN medical_operation_note.intraop_crystalloid_ml IS
    'Intra-operative crystalloid given in mL.';
COMMENT ON COLUMN medical_operation_note.intraop_colloid_ml IS
    'Intra-operative colloid given in mL.';
COMMENT ON COLUMN medical_operation_note.intraop_blood_ml IS
    'Intra-operative blood products given in mL (sum across components).';
COMMENT ON COLUMN medical_operation_note.intraop_urine_ml IS
    'Intra-operative urine output in mL.';
COMMENT ON COLUMN medical_operation_note.anaesthetic_event IS
    'Most significant intra-operative anaesthetic event, if any.';
COMMENT ON COLUMN medical_operation_note.anaesthetic_event_description IS
    'Free-text description of the anaesthetic event.';
COMMENT ON COLUMN medical_operation_note.patient_position IS
    'Patient position on the operating table.';
COMMENT ON COLUMN medical_operation_note.pressure_area_protection_notes IS
    'Notes on pressure-area protection and padding used.';
COMMENT ON COLUMN medical_operation_note.prep_solution IS
    'Skin preparation solution used.';
COMMENT ON COLUMN medical_operation_note.drape_type IS
    'Drape type and arrangement used.';
COMMENT ON COLUMN medical_operation_note.surgical_approach IS
    'Surgical approach: open, laparoscopic, robotic, endoscopic, arthroscopic, thoracoscopic, percutaneous, transluminal, or other.';
COMMENT ON COLUMN medical_operation_note.incision_type IS
    'Incision type and location (e.g. midline laparotomy, Pfannenstiel, lateral).';
COMMENT ON COLUMN medical_operation_note.incision_length_cm IS
    'Incision length in centimetres.';
COMMENT ON COLUMN medical_operation_note.table_tilt IS
    'Table tilt used during the procedure.';
COMMENT ON COLUMN medical_operation_note.tourniquet_used IS
    'Whether a tourniquet was used.';
COMMENT ON COLUMN medical_operation_note.tourniquet_site IS
    'Tourniquet site on the limb.';
COMMENT ON COLUMN medical_operation_note.tourniquet_pressure_mmhg IS
    'Tourniquet inflation pressure in mmHg.';
COMMENT ON COLUMN medical_operation_note.tourniquet_on_at IS
    'Timestamp tourniquet was inflated.';
COMMENT ON COLUMN medical_operation_note.tourniquet_off_at IS
    'Timestamp tourniquet was deflated.';
COMMENT ON COLUMN medical_operation_note.converted_to_open IS
    'Whether a minimally-invasive case was converted to open.';
COMMENT ON COLUMN medical_operation_note.conversion_reason IS
    'Reason a minimally-invasive case was converted to open.';
COMMENT ON COLUMN medical_operation_note.operative_findings_summary IS
    'Free-text summary of operative findings (the narrative; numbered steps are in medical_operation_note_step).';
COMMENT ON COLUMN medical_operation_note.pathology_found IS
    'Significant pathology encountered intra-operatively.';
COMMENT ON COLUMN medical_operation_note.anatomical_anomalies IS
    'Anatomical anomalies encountered intra-operatively.';
COMMENT ON COLUMN medical_operation_note.intraop_photographs_taken IS
    'Whether intra-operative photographs were taken for the record.';
COMMENT ON COLUMN medical_operation_note.frozen_section_requested IS
    'Whether a frozen-section histology request was made.';
COMMENT ON COLUMN medical_operation_note.swab_count_first_agreed IS
    'Whether the first (initial) swab count was agreed between scrub and circulating staff.';
COMMENT ON COLUMN medical_operation_note.swab_count_final_agreed IS
    'Whether the final (closing) swab count was agreed.';
COMMENT ON COLUMN medical_operation_note.needle_count_first_agreed IS
    'Whether the first needle count was agreed.';
COMMENT ON COLUMN medical_operation_note.needle_count_final_agreed IS
    'Whether the final needle count was agreed.';
COMMENT ON COLUMN medical_operation_note.instrument_count_first_agreed IS
    'Whether the first instrument count was agreed.';
COMMENT ON COLUMN medical_operation_note.instrument_count_final_agreed IS
    'Whether the final instrument count was agreed.';
COMMENT ON COLUMN medical_operation_note.count_discrepancy_resolution IS
    'Free-text record of how any count discrepancy was investigated and resolved.';
COMMENT ON COLUMN medical_operation_note.estimated_blood_loss_ml IS
    'Estimated intra-operative blood loss in millilitres.';
COMMENT ON COLUMN medical_operation_note.transfusion_given IS
    'Whether any blood product transfusion was given intra-operatively.';
COMMENT ON COLUMN medical_operation_note.prbc_units IS
    'Units of packed red blood cells transfused.';
COMMENT ON COLUMN medical_operation_note.ffp_units IS
    'Units of fresh frozen plasma transfused.';
COMMENT ON COLUMN medical_operation_note.platelet_units IS
    'Units of platelets transfused.';
COMMENT ON COLUMN medical_operation_note.cryoprecipitate_units IS
    'Units of cryoprecipitate transfused.';
COMMENT ON COLUMN medical_operation_note.cell_salvage_ml IS
    'Volume of cell-salvaged blood returned to the patient in millilitres.';
COMMENT ON COLUMN medical_operation_note.massive_haemorrhage_protocol_activated IS
    'Whether the hospital massive haemorrhage protocol was activated.';
COMMENT ON COLUMN medical_operation_note.never_event_flagged IS
    'Whether a never-event candidate (wrong site, wrong procedure, wrong implant, retained foreign object) was flagged.';
COMMENT ON COLUMN medical_operation_note.never_event_description IS
    'Free-text description of the never-event candidate.';
COMMENT ON COLUMN medical_operation_note.equipment_problem IS
    'Whether an equipment failure or sterility breach occurred.';
COMMENT ON COLUMN medical_operation_note.equipment_problem_description IS
    'Free-text description of the equipment problem.';
COMMENT ON COLUMN medical_operation_note.recovery_destination IS
    'Post-operative destination: pacu, ward, enhanced-care, hdu, icu, or day-case-discharge.';
COMMENT ON COLUMN medical_operation_note.monitoring_frequency IS
    'Post-operative monitoring frequency instructions.';
COMMENT ON COLUMN medical_operation_note.iv_fluids_plan IS
    'Post-operative IV fluid prescription (type and rate).';
COMMENT ON COLUMN medical_operation_note.analgesia_plan IS
    'Post-operative analgesia plan.';
COMMENT ON COLUMN medical_operation_note.antibiotic_plan IS
    'Post-operative antibiotic plan.';
COMMENT ON COLUMN medical_operation_note.vte_prophylaxis_plan IS
    'Post-operative venous thromboembolism prophylaxis plan.';
COMMENT ON COLUMN medical_operation_note.diet_plan IS
    'Post-operative diet plan: nbm, sips, fluids, soft, normal, or as-tolerated.';
COMMENT ON COLUMN medical_operation_note.mobilisation_plan IS
    'Post-operative mobilisation instructions.';
COMMENT ON COLUMN medical_operation_note.wound_care_plan IS
    'Wound care, dressing change, and suture removal plan.';
COMMENT ON COLUMN medical_operation_note.follow_up_plan IS
    'Outpatient follow-up plan.';
COMMENT ON COLUMN medical_operation_note.special_instructions IS
    'Free-text special instructions for the receiving team.';
COMMENT ON COLUMN medical_operation_note.sign_out_completed IS
    'Whether the WHO Sign-Out was completed before the team left theatre.';
COMMENT ON COLUMN medical_operation_note.debrief_completed IS
    'Whether a team debrief was held at the end of the case.';
COMMENT ON COLUMN medical_operation_note.surgeon_override_grade IS
    'Lead surgeon override of the computed composite risk grade, if applied.';
COMMENT ON COLUMN medical_operation_note.surgeon_override_reason IS
    'Reason for the surgeon override of the computed composite risk grade.';
COMMENT ON COLUMN medical_operation_note.attestation_text IS
    'Final attestation statement entered by the surgeon at sign-off.';
COMMENT ON COLUMN medical_operation_note.electronic_signature IS
    'Electronic signature string for the signed note.';
COMMENT ON COLUMN medical_operation_note.dictated_at IS
    'Timestamp the note was dictated.';
COMMENT ON COLUMN medical_operation_note.signed_at IS
    'Timestamp the note was electronically signed.';

CREATE INDEX medical_operation_note_patient_id_idx
    ON medical_operation_note (patient_id);
CREATE INDEX medical_operation_note_lead_surgeon_id_idx
    ON medical_operation_note (lead_surgeon_id);
CREATE INDEX medical_operation_note_status_idx
    ON medical_operation_note (status);
