CREATE TABLE pre_anaesthesia_assessment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    clinician_id UUID NOT NULL REFERENCES clinician(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'reviewed', 'urgent')),
    site_name VARCHAR(255) NOT NULL DEFAULT '',
    assessment_date DATE,
    assessment_time TIME,
    planned_procedure VARCHAR(500) NOT NULL DEFAULT '',
    surgical_specialty VARCHAR(100) NOT NULL DEFAULT '',
    urgency VARCHAR(20) NOT NULL DEFAULT '' CHECK (urgency IN ('elective', 'urgent', 'emergency', 'immediate', '')),
    laterality VARCHAR(10) NOT NULL DEFAULT '' CHECK (laterality IN ('left', 'right', 'bilateral', 'midline', 'na', '')),
    surgical_severity VARCHAR(15) NOT NULL DEFAULT '' CHECK (surgical_severity IN ('minor', 'intermediate', 'major', 'major-plus', '')),
    anticipated_blood_loss_ml INTEGER,
    anticipated_duration_minutes INTEGER,
    consultant_surgeon VARCHAR(255) NOT NULL DEFAULT '',
    planned_date DATE,
    systolic_bp INTEGER,
    diastolic_bp INTEGER,
    heart_rate INTEGER,
    respiratory_rate INTEGER,
    spo2_percent NUMERIC(4,1),
    temperature_celsius NUMERIC(4,1),
    capillary_refill_seconds NUMERIC(3,1),
    pain_score_0_10 INTEGER CHECK (pain_score_0_10 IS NULL OR pain_score_0_10 BETWEEN 0 AND 10),
    on_room_air VARCHAR(5) NOT NULL DEFAULT '' CHECK (on_room_air IN ('yes', 'no', '')),
    supplemental_oxygen_litres NUMERIC(3,1),
    mallampati_class VARCHAR(5) NOT NULL DEFAULT '' CHECK (mallampati_class IN ('I', 'II', 'III', 'IV', '')),
    thyromental_distance_cm NUMERIC(3,1),
    mouth_opening_cm NUMERIC(3,1),
    inter_incisor_gap_cm NUMERIC(3,1),
    neck_rom VARCHAR(20) NOT NULL DEFAULT '' CHECK (neck_rom IN ('full', 'reduced', 'severely-limited', '')),
    cervical_spine_stability VARCHAR(20) NOT NULL DEFAULT '' CHECK (cervical_spine_stability IN ('stable', 'limited', 'unstable', '')),
    dentition VARCHAR(20) NOT NULL DEFAULT '' CHECK (dentition IN ('good', 'loose-teeth', 'caps-crowns', 'edentulous', 'dentures', '')),
    beard VARCHAR(5) NOT NULL DEFAULT '' CHECK (beard IN ('yes', 'no', '')),
    upper_lip_bite_test VARCHAR(5) NOT NULL DEFAULT '' CHECK (upper_lip_bite_test IN ('I', 'II', 'III', '')),
    prior_difficult_intubation VARCHAR(5) NOT NULL DEFAULT '' CHECK (prior_difficult_intubation IN ('yes', 'no', '')),
    stopbang_snoring VARCHAR(5) NOT NULL DEFAULT '' CHECK (stopbang_snoring IN ('yes', 'no', '')),
    stopbang_tired VARCHAR(5) NOT NULL DEFAULT '' CHECK (stopbang_tired IN ('yes', 'no', '')),
    stopbang_observed_apnoea VARCHAR(5) NOT NULL DEFAULT '' CHECK (stopbang_observed_apnoea IN ('yes', 'no', '')),
    stopbang_pressure VARCHAR(5) NOT NULL DEFAULT '' CHECK (stopbang_pressure IN ('yes', 'no', '')),
    stopbang_bmi_gt35 VARCHAR(5) NOT NULL DEFAULT '' CHECK (stopbang_bmi_gt35 IN ('yes', 'no', '')),
    stopbang_age_gt50 VARCHAR(5) NOT NULL DEFAULT '' CHECK (stopbang_age_gt50 IN ('yes', 'no', '')),
    stopbang_neck_gt40 VARCHAR(5) NOT NULL DEFAULT '' CHECK (stopbang_neck_gt40 IN ('yes', 'no', '')),
    stopbang_male VARCHAR(5) NOT NULL DEFAULT '' CHECK (stopbang_male IN ('yes', 'no', '')),
    airway_notes TEXT NOT NULL DEFAULT '',
    heart_rhythm VARCHAR(20) NOT NULL DEFAULT '' CHECK (heart_rhythm IN ('sinus', 'atrial-fibrillation', 'flutter', 'heart-block', 'paced', 'other', '')),
    murmur_present VARCHAR(5) NOT NULL DEFAULT '' CHECK (murmur_present IN ('yes', 'no', '')),
    murmur_description VARCHAR(255) NOT NULL DEFAULT '',
    peripheral_pulses VARCHAR(20) NOT NULL DEFAULT '' CHECK (peripheral_pulses IN ('normal', 'reduced', 'absent', '')),
    jvp_raised VARCHAR(5) NOT NULL DEFAULT '' CHECK (jvp_raised IN ('yes', 'no', '')),
    peripheral_oedema VARCHAR(20) NOT NULL DEFAULT '' CHECK (peripheral_oedema IN ('none', 'mild', 'moderate', 'severe', '')),
    ecg_performed VARCHAR(5) NOT NULL DEFAULT '' CHECK (ecg_performed IN ('yes', 'no', '')),
    ecg_rhythm VARCHAR(50) NOT NULL DEFAULT '',
    ecg_rate_bpm INTEGER,
    ecg_axis VARCHAR(30) NOT NULL DEFAULT '' CHECK (ecg_axis IN ('normal', 'left', 'right', 'extreme', '')),
    ecg_ischaemic_changes VARCHAR(5) NOT NULL DEFAULT '' CHECK (ecg_ischaemic_changes IN ('yes', 'no', '')),
    ecg_notes TEXT NOT NULL DEFAULT '',
    echo_performed VARCHAR(5) NOT NULL DEFAULT '' CHECK (echo_performed IN ('yes', 'no', '')),
    echo_ef_percent INTEGER CHECK (echo_ef_percent IS NULL OR echo_ef_percent BETWEEN 5 AND 80),
    echo_notes TEXT NOT NULL DEFAULT '',
    history_ihd VARCHAR(5) NOT NULL DEFAULT '' CHECK (history_ihd IN ('yes', 'no', '')),
    history_chf VARCHAR(5) NOT NULL DEFAULT '' CHECK (history_chf IN ('yes', 'no', '')),
    history_stroke_tia VARCHAR(5) NOT NULL DEFAULT '' CHECK (history_stroke_tia IN ('yes', 'no', '')),
    recent_mi_within_3_months VARCHAR(5) NOT NULL DEFAULT '' CHECK (recent_mi_within_3_months IN ('yes', 'no', '')),
    pacemaker_or_icd VARCHAR(5) NOT NULL DEFAULT '' CHECK (pacemaker_or_icd IN ('yes', 'no', '')),
    severe_valve_dysfunction VARCHAR(5) NOT NULL DEFAULT '' CHECK (severe_valve_dysfunction IN ('yes', 'no', '')),
    active_angina VARCHAR(5) NOT NULL DEFAULT '' CHECK (active_angina IN ('yes', 'no', '')),
    breath_sounds VARCHAR(30) NOT NULL DEFAULT '' CHECK (breath_sounds IN ('normal', 'reduced', 'bronchial', 'silent', '')),
    wheeze VARCHAR(5) NOT NULL DEFAULT '' CHECK (wheeze IN ('yes', 'no', '')),
    crackles VARCHAR(5) NOT NULL DEFAULT '' CHECK (crackles IN ('yes', 'no', '')),
    crepitations VARCHAR(5) NOT NULL DEFAULT '' CHECK (crepitations IN ('yes', 'no', '')),
    chest_wall_deformity VARCHAR(5) NOT NULL DEFAULT '' CHECK (chest_wall_deformity IN ('yes', 'no', '')),
    asthma VARCHAR(20) NOT NULL DEFAULT '' CHECK (asthma IN ('none', 'controlled', 'uncontrolled', '')),
    copd VARCHAR(20) NOT NULL DEFAULT '' CHECK (copd IN ('none', 'mild', 'moderate', 'severe', '')),
    cxr_performed VARCHAR(5) NOT NULL DEFAULT '' CHECK (cxr_performed IN ('yes', 'no', '')),
    cxr_findings TEXT NOT NULL DEFAULT '',
    pft_performed VARCHAR(5) NOT NULL DEFAULT '' CHECK (pft_performed IN ('yes', 'no', '')),
    pft_fev1_percent_predicted NUMERIC(4,1),
    pft_fev1_fvc_ratio NUMERIC(3,2),
    smoking_status VARCHAR(20) NOT NULL DEFAULT '' CHECK (smoking_status IN ('never', 'ex', 'current', '')),
    pack_years NUMERIC(5,1),
    covid_history VARCHAR(20) NOT NULL DEFAULT '' CHECK (covid_history IN ('never', 'recovered', 'recent', 'long-covid', '')),
    days_since_covid INTEGER,
    covid_unresolved_symptoms VARCHAR(5) NOT NULL DEFAULT '' CHECK (covid_unresolved_symptoms IN ('yes', 'no', '')),
    gcs_total INTEGER CHECK (gcs_total IS NULL OR gcs_total BETWEEN 3 AND 15),
    gcs_eye INTEGER CHECK (gcs_eye IS NULL OR gcs_eye BETWEEN 1 AND 4),
    gcs_verbal INTEGER CHECK (gcs_verbal IS NULL OR gcs_verbal BETWEEN 1 AND 5),
    gcs_motor INTEGER CHECK (gcs_motor IS NULL OR gcs_motor BETWEEN 1 AND 6),
    cognition_tool VARCHAR(20) NOT NULL DEFAULT '' CHECK (cognition_tool IN ('AMT-4', 'MOCA', 'MMSE', 'none', '')),
    cognition_score INTEGER,
    cognitive_impairment VARCHAR(20) NOT NULL DEFAULT '' CHECK (cognitive_impairment IN ('none', 'mild', 'moderate', 'severe', '')),
    capacity_concern VARCHAR(5) NOT NULL DEFAULT '' CHECK (capacity_concern IN ('yes', 'no', '')),
    cranial_nerves_notes TEXT NOT NULL DEFAULT '',
    motor_power VARCHAR(20) NOT NULL DEFAULT '' CHECK (motor_power IN ('normal', 'reduced', 'severely-reduced', '')),
    sensory_notes TEXT NOT NULL DEFAULT '',
    reflexes VARCHAR(20) NOT NULL DEFAULT '' CHECK (reflexes IN ('normal', 'hyperreflexic', 'hyporeflexic', 'absent', '')),
    recent_stroke_tia VARCHAR(5) NOT NULL DEFAULT '' CHECK (recent_stroke_tia IN ('yes', 'no', '')),
    days_since_stroke_tia INTEGER,
    seizure_disorder VARCHAR(5) NOT NULL DEFAULT '' CHECK (seizure_disorder IN ('yes', 'no', '')),
    creatinine_umol_l INTEGER,
    egfr_ml_min_1_73m2 INTEGER,
    urea_mmol_l NUMERIC(4,1),
    potassium_mmol_l NUMERIC(3,1),
    sodium_mmol_l NUMERIC(4,1),
    dialysis_status VARCHAR(20) NOT NULL DEFAULT '' CHECK (dialysis_status IN ('none', 'peritoneal', 'haemodialysis', 'haemofiltration', '')),
    ckd_stage VARCHAR(5) NOT NULL DEFAULT '' CHECK (ckd_stage IN ('1', '2', '3a', '3b', '4', '5', '')),
    bilirubin_umol_l INTEGER,
    alt_u_l INTEGER,
    ast_u_l INTEGER,
    alp_u_l INTEGER,
    albumin_g_l NUMERIC(4,1),
    chronic_liver_disease VARCHAR(20) NOT NULL DEFAULT '' CHECK (chronic_liver_disease IN ('none', 'compensated', 'decompensated', '')),
    child_pugh_class VARCHAR(5) NOT NULL DEFAULT '' CHECK (child_pugh_class IN ('A', 'B', 'C', '')),
    hb_g_l INTEGER,
    wcc_10_9_l NUMERIC(4,1),
    platelets_10_9_l INTEGER,
    mcv_fl NUMERIC(4,1),
    ferritin_ug_l INTEGER,
    transferrin_saturation_percent NUMERIC(4,1),
    inr NUMERIC(4,2),
    aptt_seconds NUMERIC(4,1),
    fibrinogen_g_l NUMERIC(3,1),
    on_anticoagulant VARCHAR(5) NOT NULL DEFAULT '' CHECK (on_anticoagulant IN ('yes', 'no', '')),
    anticoagulant_type VARCHAR(50) NOT NULL DEFAULT '' CHECK (anticoagulant_type IN ('warfarin', 'apixaban', 'rivaroxaban', 'edoxaban', 'dabigatran', 'lmwh', 'heparin-iv', 'aspirin', 'clopidogrel', 'ticagrelor', 'none', '')),
    anticoagulant_hold_plan VARCHAR(255) NOT NULL DEFAULT '',
    group_and_save VARCHAR(20) NOT NULL DEFAULT '' CHECK (group_and_save IN ('not-required', 'ordered', 'valid', 'expired', '')),
    crossmatch_units INTEGER,
    last_transfusion_date DATE,
    anaemia_severity VARCHAR(20) NOT NULL DEFAULT '' CHECK (anaemia_severity IN ('none', 'mild', 'moderate', 'severe', '')),
    diabetes_type VARCHAR(20) NOT NULL DEFAULT '' CHECK (diabetes_type IN ('none', 'type-1', 'type-2', 'gestational', 'other', '')),
    diabetes_on_insulin VARCHAR(5) NOT NULL DEFAULT '' CHECK (diabetes_on_insulin IN ('yes', 'no', '')),
    hba1c_mmol_mol INTEGER,
    fasting_glucose_mmol_l NUMERIC(3,1),
    random_glucose_mmol_l NUMERIC(3,1),
    diabetes_control VARCHAR(20) NOT NULL DEFAULT '' CHECK (diabetes_control IN ('well-controlled', 'suboptimal', 'poor', '')),
    diabetes_complications VARCHAR(255) NOT NULL DEFAULT '',
    thyroid_status VARCHAR(20) NOT NULL DEFAULT '' CHECK (thyroid_status IN ('euthyroid', 'hypothyroid', 'hyperthyroid', '')),
    tsh_mu_l NUMERIC(6,2),
    adrenal_status VARCHAR(30) NOT NULL DEFAULT '' CHECK (adrenal_status IN ('normal', 'addisons', 'cushings', 'on-steroid-cover', '')),
    on_long_term_steroids VARCHAR(5) NOT NULL DEFAULT '' CHECK (on_long_term_steroids IN ('yes', 'no', '')),
    steroid_dose_mg NUMERIC(5,1),
    steroid_cover_plan VARCHAR(255) NOT NULL DEFAULT '',
    abdominal_exam VARCHAR(30) NOT NULL DEFAULT '' CHECK (abdominal_exam IN ('normal', 'distended', 'tender', 'organomegaly', 'other', '')),
    abdominal_notes TEXT NOT NULL DEFAULT '',
    reflux_symptoms VARCHAR(20) NOT NULL DEFAULT '' CHECK (reflux_symptoms IN ('none', 'occasional', 'frequent', 'severe', '')),
    hiatus_hernia VARCHAR(5) NOT NULL DEFAULT '' CHECK (hiatus_hernia IN ('yes', 'no', '')),
    previous_gastric_surgery VARCHAR(5) NOT NULL DEFAULT '' CHECK (previous_gastric_surgery IN ('yes', 'no', '')),
    ng_tube VARCHAR(5) NOT NULL DEFAULT '' CHECK (ng_tube IN ('yes', 'no', '')),
    stoma VARCHAR(20) NOT NULL DEFAULT '' CHECK (stoma IN ('none', 'colostomy', 'ileostomy', 'urostomy', 'gastrostomy', '')),
    fasting_confirmed VARCHAR(5) NOT NULL DEFAULT '' CHECK (fasting_confirmed IN ('yes', 'no', '')),
    last_solid_food_at TIMESTAMPTZ,
    last_clear_fluid_at TIMESTAMPTZ,
    rapid_sequence_induction_needed VARCHAR(5) NOT NULL DEFAULT '' CHECK (rapid_sequence_induction_needed IN ('yes', 'no', '')),
    spine_exam VARCHAR(30) NOT NULL DEFAULT '' CHECK (spine_exam IN ('normal', 'scoliosis', 'kyphosis', 'previous-surgery', 'ankylosing-spondylitis', 'other', '')),
    spine_notes TEXT NOT NULL DEFAULT '',
    neuraxial_suitable VARCHAR(10) NOT NULL DEFAULT '' CHECK (neuraxial_suitable IN ('yes', 'no', 'unsure', '')),
    joint_rom_hip VARCHAR(20) NOT NULL DEFAULT '' CHECK (joint_rom_hip IN ('full', 'reduced', 'severely-limited', '')),
    joint_rom_shoulder VARCHAR(20) NOT NULL DEFAULT '' CHECK (joint_rom_shoulder IN ('full', 'reduced', 'severely-limited', '')),
    joint_rom_neck VARCHAR(20) NOT NULL DEFAULT '' CHECK (joint_rom_neck IN ('full', 'reduced', 'severely-limited', '')),
    skin_iv_access VARCHAR(20) NOT NULL DEFAULT '' CHECK (skin_iv_access IN ('good', 'difficult', 'very-difficult', '')),
    skin_block_site VARCHAR(20) NOT NULL DEFAULT '' CHECK (skin_block_site IN ('intact', 'infected', 'tattooed', 'scarred', '')),
    pressure_ulcer_risk VARCHAR(20) NOT NULL DEFAULT '' CHECK (pressure_ulcer_risk IN ('low', 'moderate', 'high', 'very-high', '')),
    name VARCHAR(255) NOT NULL DEFAULT '',
    dose VARCHAR(100) NOT NULL DEFAULT '',
    route VARCHAR(30) NOT NULL DEFAULT '' CHECK (route IN ('oral', 'iv', 'im', 'sc', 'inhaled', 'topical', 'pr', 'other', '')),
    frequency VARCHAR(100) NOT NULL DEFAULT '',
    indication VARCHAR(255) NOT NULL DEFAULT '',
    class VARCHAR(50) NOT NULL DEFAULT '' CHECK (class IN ('anticoagulant', 'antiplatelet', 'antihypertensive', 'ace-inhibitor', 'arb', 'beta-blocker', 'diuretic', 'insulin', 'oral-hypoglycaemic', 'steroid', 'opioid', 'benzodiazepine', 'ssri', 'other', '')),
    perioperative_action VARCHAR(20) NOT NULL DEFAULT '' CHECK (perioperative_action IN ('continue', 'hold-on-day', 'hold-n-days', 'stop', 'switch', 'bridge', '')),
    perioperative_notes VARCHAR(500) NOT NULL DEFAULT '',
    last_dose_at TIMESTAMPTZ,
    allergen VARCHAR(255) NOT NULL DEFAULT '',
    category VARCHAR(30) NOT NULL DEFAULT '' CHECK (category IN ('drug', 'latex', 'food', 'adhesive', 'contrast', 'environment', 'other', '')),
    reaction_type VARCHAR(30) NOT NULL DEFAULT '' CHECK (reaction_type IN ('anaphylaxis', 'rash', 'urticaria', 'angioedema', 'gi-upset', 'bronchospasm', 'other', '')),
    reaction_severity VARCHAR(20) NOT NULL DEFAULT '' CHECK (reaction_severity IN ('mild', 'moderate', 'severe', 'life-threatening', '')),
    reaction_notes VARCHAR(500) NOT NULL DEFAULT '',
    verified VARCHAR(5) NOT NULL DEFAULT '' CHECK (verified IN ('yes', 'no', '')),
    mets_estimate NUMERIC(3,1),
    dasi_score NUMERIC(4,1),
    ecog_performance_status INTEGER CHECK (ecog_performance_status IS NULL OR ecog_performance_status BETWEEN 0 AND 4),
    clinical_frailty_scale INTEGER CHECK (clinical_frailty_scale IS NULL OR clinical_frailty_scale BETWEEN 1 AND 9),
    six_minute_walk_metres INTEGER,
    sts_one_minute_reps INTEGER,
    tug_seconds NUMERIC(4,1),
    cpet_performed VARCHAR(5) NOT NULL DEFAULT '' CHECK (cpet_performed IN ('yes', 'no', '')),
    cpet_vo2_peak_ml_kg_min NUMERIC(4,1),
    cpet_anaerobic_threshold_ml_kg_min NUMERIC(4,1),
    cpet_notes TEXT NOT NULL DEFAULT '',
    malnutrition_risk VARCHAR(20) NOT NULL DEFAULT '' CHECK (malnutrition_risk IN ('none', 'low', 'medium', 'high', '')),
    unintentional_weight_loss_kg NUMERIC(4,1),
    technique VARCHAR(30) NOT NULL DEFAULT '' CHECK (technique IN ('ga', 'regional', 'neuraxial', 'sedation', 'mac', 'local', 'combined-ga-regional', '')),
    airway_plan VARCHAR(30) NOT NULL DEFAULT '' CHECK (airway_plan IN ('face-mask', 'supraglottic', 'ett', 'awake-fibreoptic', 'surgical-airway', '')),
    rsi_planned VARCHAR(5) NOT NULL DEFAULT '' CHECK (rsi_planned IN ('yes', 'no', '')),
    monitoring_level VARCHAR(20) NOT NULL DEFAULT '' CHECK (monitoring_level IN ('standard', 'invasive-arterial', 'invasive-cvc', 'cardiac-output', '')),
    analgesia_plan VARCHAR(500) NOT NULL DEFAULT '',
    regional_block_planned VARCHAR(100) NOT NULL DEFAULT '',
    dvt_prophylaxis VARCHAR(100) NOT NULL DEFAULT '',
    antibiotic_prophylaxis VARCHAR(100) NOT NULL DEFAULT '',
    post_op_disposition VARCHAR(20) NOT NULL DEFAULT '' CHECK (post_op_disposition IN ('day-case', 'ward', 'enhanced-care', 'hdu', 'icu', '')),
    anticipated_length_of_stay_days INTEGER,
    special_equipment VARCHAR(500) NOT NULL DEFAULT '',
    blood_products_required VARCHAR(100) NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_pre_anaesthesia_assessment_updated_at
    BEFORE UPDATE ON pre_anaesthesia_assessment
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE pre_anaesthesia_assessment IS
    'Clinician-led pre-operative assessment: objective findings, scoring inputs (ASA, Mallampati, RCRI, STOP-BANG, Clinical Frailty Scale), planned anaesthesia strategy, and safety flags for adult elective and urgent surgery.';
COMMENT ON COLUMN pre_anaesthesia_assessment.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN pre_anaesthesia_assessment.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN pre_anaesthesia_assessment.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN pre_anaesthesia_assessment.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN pre_anaesthesia_assessment.patient_id IS
    'Foreign key to the patient being assessed.';
COMMENT ON COLUMN pre_anaesthesia_assessment.clinician_id IS
    'Foreign key to the clinician performing the assessment.';
COMMENT ON COLUMN pre_anaesthesia_assessment.status IS
    'Lifecycle status: draft, submitted, reviewed, or urgent.';
COMMENT ON COLUMN pre_anaesthesia_assessment.site_name IS
    'Site or hospital where the assessment is performed.';
COMMENT ON COLUMN pre_anaesthesia_assessment.assessment_date IS
    'Date the assessment was performed.';
COMMENT ON COLUMN pre_anaesthesia_assessment.assessment_time IS
    'Time of day the assessment was performed.';
COMMENT ON COLUMN pre_anaesthesia_assessment.planned_procedure IS
    'Description of the planned surgical procedure.';
COMMENT ON COLUMN pre_anaesthesia_assessment.surgical_specialty IS
    'Surgical specialty responsible for the procedure.';
COMMENT ON COLUMN pre_anaesthesia_assessment.urgency IS
    'Procedure urgency (NCEPOD): elective, urgent, emergency, or immediate.';
COMMENT ON COLUMN pre_anaesthesia_assessment.laterality IS
    'Side of the body: left, right, bilateral, midline, or na.';
COMMENT ON COLUMN pre_anaesthesia_assessment.surgical_severity IS
    'Surgical severity grade (NICE): minor, intermediate, major, or major-plus.';
COMMENT ON COLUMN pre_anaesthesia_assessment.anticipated_blood_loss_ml IS
    'Expected intraoperative blood loss in millilitres.';
COMMENT ON COLUMN pre_anaesthesia_assessment.anticipated_duration_minutes IS
    'Expected operative duration in minutes.';
COMMENT ON COLUMN pre_anaesthesia_assessment.consultant_surgeon IS
    'Name of the responsible consultant surgeon.';
COMMENT ON COLUMN pre_anaesthesia_assessment.planned_date IS
    'Planned date of the operation.';
COMMENT ON COLUMN pre_anaesthesia_assessment.systolic_bp IS
    'Resting systolic blood pressure in mmHg.';
COMMENT ON COLUMN pre_anaesthesia_assessment.diastolic_bp IS
    'Resting diastolic blood pressure in mmHg.';
COMMENT ON COLUMN pre_anaesthesia_assessment.heart_rate IS
    'Resting heart rate in beats per minute.';
COMMENT ON COLUMN pre_anaesthesia_assessment.respiratory_rate IS
    'Resting respiratory rate in breaths per minute.';
COMMENT ON COLUMN pre_anaesthesia_assessment.spo2_percent IS
    'Peripheral oxygen saturation as a percentage.';
COMMENT ON COLUMN pre_anaesthesia_assessment.temperature_celsius IS
    'Core body temperature in degrees Celsius.';
COMMENT ON COLUMN pre_anaesthesia_assessment.capillary_refill_seconds IS
    'Capillary refill time in seconds.';
COMMENT ON COLUMN pre_anaesthesia_assessment.pain_score_0_10 IS
    'Patient-reported resting pain on a 0-10 numeric rating scale.';
COMMENT ON COLUMN pre_anaesthesia_assessment.on_room_air IS
    'Whether SpO2 was measured on room air (yes/no).';
COMMENT ON COLUMN pre_anaesthesia_assessment.supplemental_oxygen_litres IS
    'Supplemental oxygen flow rate in litres per minute, if given.';
COMMENT ON COLUMN pre_anaesthesia_assessment.mallampati_class IS
    'Mallampati airway classification I-IV.';
COMMENT ON COLUMN pre_anaesthesia_assessment.thyromental_distance_cm IS
    'Thyromental distance in centimetres.';
COMMENT ON COLUMN pre_anaesthesia_assessment.mouth_opening_cm IS
    'Maximal mouth opening in centimetres.';
COMMENT ON COLUMN pre_anaesthesia_assessment.inter_incisor_gap_cm IS
    'Inter-incisor gap at maximal mouth opening in centimetres.';
COMMENT ON COLUMN pre_anaesthesia_assessment.neck_rom IS
    'Cervical range of motion for airway assessment: full, reduced, or severely-limited.';
COMMENT ON COLUMN pre_anaesthesia_assessment.cervical_spine_stability IS
    'Cervical spine stability: stable, limited, or unstable.';
COMMENT ON COLUMN pre_anaesthesia_assessment.dentition IS
    'Dentition assessment: good, loose-teeth, caps-crowns, edentulous, or dentures.';
COMMENT ON COLUMN pre_anaesthesia_assessment.beard IS
    'Presence of a beard that may impede mask seal.';
COMMENT ON COLUMN pre_anaesthesia_assessment.upper_lip_bite_test IS
    'Upper lip bite test grade I, II, or III.';
COMMENT ON COLUMN pre_anaesthesia_assessment.prior_difficult_intubation IS
    'Documented history of previous difficult intubation.';
COMMENT ON COLUMN pre_anaesthesia_assessment.stopbang_snoring IS
    'STOP-BANG item: loud snoring.';
COMMENT ON COLUMN pre_anaesthesia_assessment.stopbang_tired IS
    'STOP-BANG item: daytime tiredness or fatigue.';
COMMENT ON COLUMN pre_anaesthesia_assessment.stopbang_observed_apnoea IS
    'STOP-BANG item: observed apnoea during sleep.';
COMMENT ON COLUMN pre_anaesthesia_assessment.stopbang_pressure IS
    'STOP-BANG item: high blood pressure (treated or untreated).';
COMMENT ON COLUMN pre_anaesthesia_assessment.stopbang_bmi_gt35 IS
    'STOP-BANG item: BMI greater than 35 kg/m2.';
COMMENT ON COLUMN pre_anaesthesia_assessment.stopbang_age_gt50 IS
    'STOP-BANG item: age greater than 50 years.';
COMMENT ON COLUMN pre_anaesthesia_assessment.stopbang_neck_gt40 IS
    'STOP-BANG item: neck circumference greater than 40 cm.';
COMMENT ON COLUMN pre_anaesthesia_assessment.stopbang_male IS
    'STOP-BANG item: male sex.';
COMMENT ON COLUMN pre_anaesthesia_assessment.airway_notes IS
    'Free-text clinician notes on airway assessment.';
COMMENT ON COLUMN pre_anaesthesia_assessment.heart_rhythm IS
    'Observed cardiac rhythm on examination.';
COMMENT ON COLUMN pre_anaesthesia_assessment.murmur_present IS
    'Presence of a cardiac murmur on auscultation.';
COMMENT ON COLUMN pre_anaesthesia_assessment.murmur_description IS
    'Free-text description of any cardiac murmur.';
COMMENT ON COLUMN pre_anaesthesia_assessment.peripheral_pulses IS
    'Peripheral pulses: normal, reduced, or absent.';
COMMENT ON COLUMN pre_anaesthesia_assessment.jvp_raised IS
    'Whether the jugular venous pressure is elevated.';
COMMENT ON COLUMN pre_anaesthesia_assessment.peripheral_oedema IS
    'Severity of peripheral oedema: none, mild, moderate, or severe.';
COMMENT ON COLUMN pre_anaesthesia_assessment.ecg_performed IS
    'Whether a 12-lead ECG was performed for this assessment.';
COMMENT ON COLUMN pre_anaesthesia_assessment.ecg_rhythm IS
    'Reported ECG rhythm.';
COMMENT ON COLUMN pre_anaesthesia_assessment.ecg_rate_bpm IS
    'ECG ventricular rate in beats per minute.';
COMMENT ON COLUMN pre_anaesthesia_assessment.ecg_axis IS
    'ECG electrical axis: normal, left, right, or extreme.';
COMMENT ON COLUMN pre_anaesthesia_assessment.ecg_ischaemic_changes IS
    'Whether ischaemic changes are present on the ECG.';
COMMENT ON COLUMN pre_anaesthesia_assessment.ecg_notes IS
    'Free-text ECG interpretation notes.';
COMMENT ON COLUMN pre_anaesthesia_assessment.echo_performed IS
    'Whether a transthoracic echocardiogram was performed.';
COMMENT ON COLUMN pre_anaesthesia_assessment.echo_ef_percent IS
    'Left ventricular ejection fraction as a percentage.';
COMMENT ON COLUMN pre_anaesthesia_assessment.echo_notes IS
    'Free-text echocardiogram interpretation notes.';
COMMENT ON COLUMN pre_anaesthesia_assessment.history_ihd IS
    'History of ischaemic heart disease (RCRI criterion).';
COMMENT ON COLUMN pre_anaesthesia_assessment.history_chf IS
    'History of congestive heart failure (RCRI criterion).';
COMMENT ON COLUMN pre_anaesthesia_assessment.history_stroke_tia IS
    'History of stroke or transient ischaemic attack (RCRI criterion).';
COMMENT ON COLUMN pre_anaesthesia_assessment.recent_mi_within_3_months IS
    'Myocardial infarction within the past three months.';
COMMENT ON COLUMN pre_anaesthesia_assessment.pacemaker_or_icd IS
    'Implanted pacemaker or implantable cardioverter-defibrillator present.';
COMMENT ON COLUMN pre_anaesthesia_assessment.severe_valve_dysfunction IS
    'Documented severe valvular dysfunction.';
COMMENT ON COLUMN pre_anaesthesia_assessment.active_angina IS
    'Active unstable anginal symptoms.';
COMMENT ON COLUMN pre_anaesthesia_assessment.breath_sounds IS
    'Auscultated breath sounds: normal, reduced, bronchial, or silent.';
COMMENT ON COLUMN pre_anaesthesia_assessment.wheeze IS
    'Audible wheeze on auscultation.';
COMMENT ON COLUMN pre_anaesthesia_assessment.crackles IS
    'Audible crackles on auscultation.';
COMMENT ON COLUMN pre_anaesthesia_assessment.crepitations IS
    'Audible crepitations on auscultation.';
COMMENT ON COLUMN pre_anaesthesia_assessment.chest_wall_deformity IS
    'Presence of chest wall deformity.';
COMMENT ON COLUMN pre_anaesthesia_assessment.asthma IS
    'Asthma status: none, controlled, or uncontrolled.';
COMMENT ON COLUMN pre_anaesthesia_assessment.copd IS
    'COPD severity: none, mild, moderate, or severe.';
COMMENT ON COLUMN pre_anaesthesia_assessment.cxr_performed IS
    'Whether a chest X-ray was performed.';
COMMENT ON COLUMN pre_anaesthesia_assessment.cxr_findings IS
    'Free-text chest X-ray findings.';
COMMENT ON COLUMN pre_anaesthesia_assessment.pft_performed IS
    'Whether pulmonary function tests were performed.';
COMMENT ON COLUMN pre_anaesthesia_assessment.pft_fev1_percent_predicted IS
    'FEV1 as a percentage of predicted.';
COMMENT ON COLUMN pre_anaesthesia_assessment.pft_fev1_fvc_ratio IS
    'FEV1/FVC ratio.';
COMMENT ON COLUMN pre_anaesthesia_assessment.smoking_status IS
    'Smoking status: never, ex, or current.';
COMMENT ON COLUMN pre_anaesthesia_assessment.pack_years IS
    'Lifetime smoking exposure in pack-years.';
COMMENT ON COLUMN pre_anaesthesia_assessment.covid_history IS
    'COVID-19 history category: never, recovered, recent, or long-covid.';
COMMENT ON COLUMN pre_anaesthesia_assessment.days_since_covid IS
    'Days since onset of acute COVID-19.';
COMMENT ON COLUMN pre_anaesthesia_assessment.covid_unresolved_symptoms IS
    'Whether post-COVID symptoms remain unresolved.';
COMMENT ON COLUMN pre_anaesthesia_assessment.gcs_total IS
    'Total Glasgow Coma Scale score, range 3-15.';
COMMENT ON COLUMN pre_anaesthesia_assessment.gcs_eye IS
    'GCS eye-opening component, range 1-4.';
COMMENT ON COLUMN pre_anaesthesia_assessment.gcs_verbal IS
    'GCS verbal component, range 1-5.';
COMMENT ON COLUMN pre_anaesthesia_assessment.gcs_motor IS
    'GCS motor component, range 1-6.';
COMMENT ON COLUMN pre_anaesthesia_assessment.cognition_tool IS
    'Cognitive screening tool used: AMT-4, MOCA, MMSE, or none.';
COMMENT ON COLUMN pre_anaesthesia_assessment.cognition_score IS
    'Raw score reported by the cognitive screening tool.';
COMMENT ON COLUMN pre_anaesthesia_assessment.cognitive_impairment IS
    'Clinical grade of cognitive impairment: none, mild, moderate, or severe.';
COMMENT ON COLUMN pre_anaesthesia_assessment.capacity_concern IS
    'Concern about the patient capacity to consent to the procedure.';
COMMENT ON COLUMN pre_anaesthesia_assessment.cranial_nerves_notes IS
    'Free-text notes on cranial nerve examination.';
COMMENT ON COLUMN pre_anaesthesia_assessment.motor_power IS
    'Global motor power grading: normal, reduced, or severely-reduced.';
COMMENT ON COLUMN pre_anaesthesia_assessment.sensory_notes IS
    'Free-text notes on sensory examination.';
COMMENT ON COLUMN pre_anaesthesia_assessment.reflexes IS
    'Reflex findings: normal, hyperreflexic, hyporeflexic, or absent.';
COMMENT ON COLUMN pre_anaesthesia_assessment.recent_stroke_tia IS
    'Recent stroke or TIA relevant to perioperative risk.';
COMMENT ON COLUMN pre_anaesthesia_assessment.days_since_stroke_tia IS
    'Days since the most recent stroke or TIA.';
COMMENT ON COLUMN pre_anaesthesia_assessment.seizure_disorder IS
    'Active seizure disorder.';
COMMENT ON COLUMN pre_anaesthesia_assessment.creatinine_umol_l IS
    'Serum creatinine in micromoles per litre.';
COMMENT ON COLUMN pre_anaesthesia_assessment.egfr_ml_min_1_73m2 IS
    'Estimated glomerular filtration rate in mL/min/1.73 m2.';
COMMENT ON COLUMN pre_anaesthesia_assessment.urea_mmol_l IS
    'Serum urea in millimoles per litre.';
COMMENT ON COLUMN pre_anaesthesia_assessment.potassium_mmol_l IS
    'Serum potassium in millimoles per litre.';
COMMENT ON COLUMN pre_anaesthesia_assessment.sodium_mmol_l IS
    'Serum sodium in millimoles per litre.';
COMMENT ON COLUMN pre_anaesthesia_assessment.dialysis_status IS
    'Dialysis modality: none, peritoneal, haemodialysis, or haemofiltration.';
COMMENT ON COLUMN pre_anaesthesia_assessment.ckd_stage IS
    'Chronic kidney disease stage 1, 2, 3a, 3b, 4, or 5.';
COMMENT ON COLUMN pre_anaesthesia_assessment.bilirubin_umol_l IS
    'Serum bilirubin in micromoles per litre.';
COMMENT ON COLUMN pre_anaesthesia_assessment.alt_u_l IS
    'Alanine aminotransferase in units per litre.';
COMMENT ON COLUMN pre_anaesthesia_assessment.ast_u_l IS
    'Aspartate aminotransferase in units per litre.';
COMMENT ON COLUMN pre_anaesthesia_assessment.alp_u_l IS
    'Alkaline phosphatase in units per litre.';
COMMENT ON COLUMN pre_anaesthesia_assessment.albumin_g_l IS
    'Serum albumin in grams per litre.';
COMMENT ON COLUMN pre_anaesthesia_assessment.chronic_liver_disease IS
    'Chronic liver disease status: none, compensated, or decompensated.';
COMMENT ON COLUMN pre_anaesthesia_assessment.child_pugh_class IS
    'Child-Pugh class A, B, or C.';
COMMENT ON COLUMN pre_anaesthesia_assessment.hb_g_l IS
    'Haemoglobin in grams per litre.';
COMMENT ON COLUMN pre_anaesthesia_assessment.wcc_10_9_l IS
    'White cell count in 10^9/L.';
COMMENT ON COLUMN pre_anaesthesia_assessment.platelets_10_9_l IS
    'Platelet count in 10^9/L.';
COMMENT ON COLUMN pre_anaesthesia_assessment.mcv_fl IS
    'Mean corpuscular volume in femtolitres.';
COMMENT ON COLUMN pre_anaesthesia_assessment.ferritin_ug_l IS
    'Serum ferritin in micrograms per litre.';
COMMENT ON COLUMN pre_anaesthesia_assessment.transferrin_saturation_percent IS
    'Transferrin saturation as a percentage.';
COMMENT ON COLUMN pre_anaesthesia_assessment.inr IS
    'International normalised ratio.';
COMMENT ON COLUMN pre_anaesthesia_assessment.aptt_seconds IS
    'Activated partial thromboplastin time in seconds.';
COMMENT ON COLUMN pre_anaesthesia_assessment.fibrinogen_g_l IS
    'Fibrinogen concentration in grams per litre.';
COMMENT ON COLUMN pre_anaesthesia_assessment.on_anticoagulant IS
    'Whether the patient is on an anticoagulant or antiplatelet agent.';
COMMENT ON COLUMN pre_anaesthesia_assessment.anticoagulant_type IS
    'Primary anticoagulant or antiplatelet agent in use.';
COMMENT ON COLUMN pre_anaesthesia_assessment.anticoagulant_hold_plan IS
    'Perioperative hold or bridging plan for the anticoagulant.';
COMMENT ON COLUMN pre_anaesthesia_assessment.group_and_save IS
    'Group-and-save status: not-required, ordered, valid, or expired.';
COMMENT ON COLUMN pre_anaesthesia_assessment.crossmatch_units IS
    'Number of crossmatched red cell units requested.';
COMMENT ON COLUMN pre_anaesthesia_assessment.last_transfusion_date IS
    'Date of the most recent blood transfusion.';
COMMENT ON COLUMN pre_anaesthesia_assessment.anaemia_severity IS
    'Anaemia severity: none, mild, moderate, or severe.';
COMMENT ON COLUMN pre_anaesthesia_assessment.diabetes_type IS
    'Diabetes classification: none, type-1, type-2, gestational, or other.';
COMMENT ON COLUMN pre_anaesthesia_assessment.diabetes_on_insulin IS
    'Whether the patient uses insulin.';
COMMENT ON COLUMN pre_anaesthesia_assessment.hba1c_mmol_mol IS
    'HbA1c in mmol/mol.';
COMMENT ON COLUMN pre_anaesthesia_assessment.fasting_glucose_mmol_l IS
    'Fasting plasma glucose in millimoles per litre.';
COMMENT ON COLUMN pre_anaesthesia_assessment.random_glucose_mmol_l IS
    'Random plasma glucose in millimoles per litre.';
COMMENT ON COLUMN pre_anaesthesia_assessment.diabetes_control IS
    'Clinical judgement of glycaemic control: well-controlled, suboptimal, or poor.';
COMMENT ON COLUMN pre_anaesthesia_assessment.diabetes_complications IS
    'Free-text list of diabetic complications.';
COMMENT ON COLUMN pre_anaesthesia_assessment.thyroid_status IS
    'Thyroid functional status: euthyroid, hypothyroid, or hyperthyroid.';
COMMENT ON COLUMN pre_anaesthesia_assessment.tsh_mu_l IS
    'Thyroid-stimulating hormone in milli-units per litre.';
COMMENT ON COLUMN pre_anaesthesia_assessment.adrenal_status IS
    'Adrenal functional status: normal, addisons, cushings, or on-steroid-cover.';
COMMENT ON COLUMN pre_anaesthesia_assessment.on_long_term_steroids IS
    'Whether the patient takes long-term corticosteroids.';
COMMENT ON COLUMN pre_anaesthesia_assessment.steroid_dose_mg IS
    'Current steroid dose in milligrams prednisolone equivalent.';
COMMENT ON COLUMN pre_anaesthesia_assessment.steroid_cover_plan IS
    'Perioperative steroid cover plan.';
COMMENT ON COLUMN pre_anaesthesia_assessment.abdominal_exam IS
    'Abdominal examination findings: normal, distended, tender, organomegaly, or other.';
COMMENT ON COLUMN pre_anaesthesia_assessment.abdominal_notes IS
    'Free-text abdominal examination notes.';
COMMENT ON COLUMN pre_anaesthesia_assessment.reflux_symptoms IS
    'Severity of gastro-oesophageal reflux symptoms: none, occasional, frequent, or severe.';
COMMENT ON COLUMN pre_anaesthesia_assessment.hiatus_hernia IS
    'Documented hiatus hernia.';
COMMENT ON COLUMN pre_anaesthesia_assessment.previous_gastric_surgery IS
    'History of previous gastric surgery.';
COMMENT ON COLUMN pre_anaesthesia_assessment.ng_tube IS
    'Nasogastric tube currently in situ.';
COMMENT ON COLUMN pre_anaesthesia_assessment.stoma IS
    'Stoma type, if any: colostomy, ileostomy, urostomy, gastrostomy, or none.';
COMMENT ON COLUMN pre_anaesthesia_assessment.fasting_confirmed IS
    'Whether pre-operative fasting has been confirmed as adequate.';
COMMENT ON COLUMN pre_anaesthesia_assessment.last_solid_food_at IS
    'Timestamp of last solid food intake.';
COMMENT ON COLUMN pre_anaesthesia_assessment.last_clear_fluid_at IS
    'Timestamp of last clear fluid intake.';
COMMENT ON COLUMN pre_anaesthesia_assessment.rapid_sequence_induction_needed IS
    'Whether rapid sequence induction is required because of aspiration risk.';
COMMENT ON COLUMN pre_anaesthesia_assessment.spine_exam IS
    'Spinal examination findings relevant to neuraxial access.';
COMMENT ON COLUMN pre_anaesthesia_assessment.spine_notes IS
    'Free-text spinal examination notes.';
COMMENT ON COLUMN pre_anaesthesia_assessment.neuraxial_suitable IS
    'Clinician judgement of suitability for neuraxial block: yes, no, or unsure.';
COMMENT ON COLUMN pre_anaesthesia_assessment.joint_rom_hip IS
    'Hip range of motion for positioning planning.';
COMMENT ON COLUMN pre_anaesthesia_assessment.joint_rom_shoulder IS
    'Shoulder range of motion for positioning planning.';
COMMENT ON COLUMN pre_anaesthesia_assessment.joint_rom_neck IS
    'Cervical range of motion for positioning planning (distinct from airway-focused neck_rom).';
COMMENT ON COLUMN pre_anaesthesia_assessment.skin_iv_access IS
    'Ease of peripheral intravenous access: good, difficult, or very-difficult.';
COMMENT ON COLUMN pre_anaesthesia_assessment.skin_block_site IS
    'Condition of planned regional block skin site: intact, infected, tattooed, or scarred.';
COMMENT ON COLUMN pre_anaesthesia_assessment.pressure_ulcer_risk IS
    'Pressure ulcer risk category: low, moderate, high, or very-high.';
COMMENT ON COLUMN pre_anaesthesia_assessment.name IS
    'Regular medication name (current medication review item).';
COMMENT ON COLUMN pre_anaesthesia_assessment.dose IS
    'Regular medication dose.';
COMMENT ON COLUMN pre_anaesthesia_assessment.route IS
    'Medication route of administration.';
COMMENT ON COLUMN pre_anaesthesia_assessment.frequency IS
    'Medication dosing frequency.';
COMMENT ON COLUMN pre_anaesthesia_assessment.indication IS
    'Clinical indication for the medication.';
COMMENT ON COLUMN pre_anaesthesia_assessment.class IS
    'Medication class for perioperative decision-making.';
COMMENT ON COLUMN pre_anaesthesia_assessment.perioperative_action IS
    'Perioperative action for this medication: continue, hold-on-day, hold-n-days, stop, switch, or bridge.';
COMMENT ON COLUMN pre_anaesthesia_assessment.perioperative_notes IS
    'Perioperative instructions or caveats for this medication.';
COMMENT ON COLUMN pre_anaesthesia_assessment.last_dose_at IS
    'Timestamp of the most recent recorded dose.';
COMMENT ON COLUMN pre_anaesthesia_assessment.allergen IS
    'Known allergen or trigger.';
COMMENT ON COLUMN pre_anaesthesia_assessment.category IS
    'Allergy category: drug, latex, food, adhesive, contrast, environment, or other.';
COMMENT ON COLUMN pre_anaesthesia_assessment.reaction_type IS
    'Type of reported allergic reaction.';
COMMENT ON COLUMN pre_anaesthesia_assessment.reaction_severity IS
    'Allergic reaction severity: mild, moderate, severe, or life-threatening.';
COMMENT ON COLUMN pre_anaesthesia_assessment.reaction_notes IS
    'Free-text notes describing the allergic reaction.';
COMMENT ON COLUMN pre_anaesthesia_assessment.verified IS
    'Whether the allergy history has been verified.';
COMMENT ON COLUMN pre_anaesthesia_assessment.mets_estimate IS
    'Estimated exercise capacity in metabolic equivalents (METs).';
COMMENT ON COLUMN pre_anaesthesia_assessment.dasi_score IS
    'Duke Activity Status Index (DASI) score.';
COMMENT ON COLUMN pre_anaesthesia_assessment.ecog_performance_status IS
    'ECOG performance status 0-4.';
COMMENT ON COLUMN pre_anaesthesia_assessment.clinical_frailty_scale IS
    'Rockwood Clinical Frailty Scale 1-9.';
COMMENT ON COLUMN pre_anaesthesia_assessment.six_minute_walk_metres IS
    'Six-minute walk test distance in metres.';
COMMENT ON COLUMN pre_anaesthesia_assessment.sts_one_minute_reps IS
    'One-minute sit-to-stand test repetitions.';
COMMENT ON COLUMN pre_anaesthesia_assessment.tug_seconds IS
    'Timed Up and Go test duration in seconds.';
COMMENT ON COLUMN pre_anaesthesia_assessment.cpet_performed IS
    'Whether cardiopulmonary exercise testing was performed.';
COMMENT ON COLUMN pre_anaesthesia_assessment.cpet_vo2_peak_ml_kg_min IS
    'Peak VO2 on CPET in mL/kg/min.';
COMMENT ON COLUMN pre_anaesthesia_assessment.cpet_anaerobic_threshold_ml_kg_min IS
    'Anaerobic threshold on CPET in mL/kg/min.';
COMMENT ON COLUMN pre_anaesthesia_assessment.cpet_notes IS
    'Free-text CPET interpretation notes.';
COMMENT ON COLUMN pre_anaesthesia_assessment.malnutrition_risk IS
    'Malnutrition risk category: none, low, medium, or high.';
COMMENT ON COLUMN pre_anaesthesia_assessment.unintentional_weight_loss_kg IS
    'Recent unintentional weight loss in kilograms.';
COMMENT ON COLUMN pre_anaesthesia_assessment.technique IS
    'Planned primary anaesthetic technique.';
COMMENT ON COLUMN pre_anaesthesia_assessment.airway_plan IS
    'Planned airway management strategy.';
COMMENT ON COLUMN pre_anaesthesia_assessment.rsi_planned IS
    'Whether rapid sequence induction is planned.';
COMMENT ON COLUMN pre_anaesthesia_assessment.monitoring_level IS
    'Planned intraoperative monitoring level: standard, invasive-arterial, invasive-cvc, or cardiac-output.';
COMMENT ON COLUMN pre_anaesthesia_assessment.analgesia_plan IS
    'Planned postoperative analgesia strategy.';
COMMENT ON COLUMN pre_anaesthesia_assessment.regional_block_planned IS
    'Regional block planned, if any.';
COMMENT ON COLUMN pre_anaesthesia_assessment.dvt_prophylaxis IS
    'Planned venous thromboembolism prophylaxis.';
COMMENT ON COLUMN pre_anaesthesia_assessment.antibiotic_prophylaxis IS
    'Planned surgical antibiotic prophylaxis.';
COMMENT ON COLUMN pre_anaesthesia_assessment.post_op_disposition IS
    'Planned postoperative destination: day-case, ward, enhanced-care, hdu, or icu.';
COMMENT ON COLUMN pre_anaesthesia_assessment.anticipated_length_of_stay_days IS
    'Anticipated length of hospital stay in days.';
COMMENT ON COLUMN pre_anaesthesia_assessment.special_equipment IS
    'Special equipment required for the procedure.';
COMMENT ON COLUMN pre_anaesthesia_assessment.blood_products_required IS
    'Blood products required for the procedure.';
