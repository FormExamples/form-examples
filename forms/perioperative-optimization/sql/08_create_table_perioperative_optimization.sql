-- Perioperative optimization: the payload of the 16-step single-page wizard.
--
-- Column groups follow the wizard steps in order. Unanswered text and enum
-- columns default to the empty string; unanswered numeric, date, and time
-- columns are NULL. See ../index.md for the wizard table, ../spec/index.md for
-- the contract, and ../doc/optimization-domains.md for the thresholds that the
-- engine applies to these columns.

CREATE TABLE perioperative_optimization (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    clinician_id UUID NOT NULL REFERENCES clinician(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'reviewed', 'urgent')),

    -- Step 1: assessment context
    assessment_date DATE,
    assessment_time TIME,
    site_name VARCHAR(255) NOT NULL DEFAULT '',
    service_name VARCHAR(255) NOT NULL DEFAULT '',
    pathway_stage VARCHAR(30) NOT NULL DEFAULT '' CHECK (pathway_stage IN ('referral', 'waiting-list', 'pre-assessment', 'prehabilitation', 'pre-admission', 'review', '')),
    assessment_mode VARCHAR(20) NOT NULL DEFAULT '' CHECK (assessment_mode IN ('clinic', 'telephone', 'video', 'online-portal', 'home-visit', '')),
    referral_source VARCHAR(40) NOT NULL DEFAULT '' CHECK (referral_source IN ('surgical-team', 'general-practitioner', 'anaesthetist', 'waiting-list-office', 'self-referral', 'other', '')),

    -- Step 2: patient and procedural demographics
    planned_procedure VARCHAR(500) NOT NULL DEFAULT '',
    surgical_specialty VARCHAR(100) NOT NULL DEFAULT '',
    consultant_surgeon VARCHAR(255) NOT NULL DEFAULT '',
    planned_surgery_date DATE,
    urgency VARCHAR(20) NOT NULL DEFAULT '' CHECK (urgency IN ('elective', 'scheduled', 'expedited', 'urgent', 'emergency', '')),
    surgical_severity VARCHAR(15) NOT NULL DEFAULT '' CHECK (surgical_severity IN ('minor', 'intermediate', 'major', 'major-plus', '')),
    laterality VARCHAR(10) NOT NULL DEFAULT '' CHECK (laterality IN ('left', 'right', 'bilateral', 'midline', 'na', '')),
    anticipated_blood_loss_ml INTEGER CHECK (anticipated_blood_loss_ml IS NULL OR anticipated_blood_loss_ml BETWEEN 0 AND 20000),
    anticipated_length_of_stay_days INTEGER CHECK (anticipated_length_of_stay_days IS NULL OR anticipated_length_of_stay_days BETWEEN 0 AND 365),
    interpreter_required VARCHAR(5) NOT NULL DEFAULT '' CHECK (interpreter_required IN ('yes', 'no', '')),
    interpreter_language VARCHAR(100) NOT NULL DEFAULT '',

    -- Step 3: medical and surgical history
    condition_cardiac VARCHAR(5) NOT NULL DEFAULT '' CHECK (condition_cardiac IN ('yes', 'no', '')),
    condition_respiratory VARCHAR(5) NOT NULL DEFAULT '' CHECK (condition_respiratory IN ('yes', 'no', '')),
    condition_renal VARCHAR(5) NOT NULL DEFAULT '' CHECK (condition_renal IN ('yes', 'no', '')),
    condition_hepatic VARCHAR(5) NOT NULL DEFAULT '' CHECK (condition_hepatic IN ('yes', 'no', '')),
    condition_stroke VARCHAR(5) NOT NULL DEFAULT '' CHECK (condition_stroke IN ('yes', 'no', '')),
    condition_cancer VARCHAR(5) NOT NULL DEFAULT '' CHECK (condition_cancer IN ('yes', 'no', '')),
    condition_rheumatological VARCHAR(5) NOT NULL DEFAULT '' CHECK (condition_rheumatological IN ('yes', 'no', '')),
    condition_thyroid VARCHAR(5) NOT NULL DEFAULT '' CHECK (condition_thyroid IN ('yes', 'no', '')),
    condition_other VARCHAR(500) NOT NULL DEFAULT '',
    previous_surgery VARCHAR(5) NOT NULL DEFAULT '' CHECK (previous_surgery IN ('yes', 'no', '')),
    previous_surgery_detail VARCHAR(500) NOT NULL DEFAULT '',
    previous_anaesthetic_complication VARCHAR(5) NOT NULL DEFAULT '' CHECK (previous_anaesthetic_complication IN ('yes', 'no', '')),
    previous_anaesthetic_complication_detail VARCHAR(500) NOT NULL DEFAULT '',
    postoperative_nausea_history VARCHAR(5) NOT NULL DEFAULT '' CHECK (postoperative_nausea_history IN ('yes', 'no', '')),
    difficult_airway_history VARCHAR(5) NOT NULL DEFAULT '' CHECK (difficult_airway_history IN ('yes', 'no', '')),
    malignant_hyperthermia_history VARCHAR(5) NOT NULL DEFAULT '' CHECK (malignant_hyperthermia_history IN ('yes', 'no', '')),
    venous_thromboembolism_history VARCHAR(5) NOT NULL DEFAULT '' CHECK (venous_thromboembolism_history IN ('yes', 'no', '')),
    family_history TEXT NOT NULL DEFAULT '',
    pregnancy_status VARCHAR(20) NOT NULL DEFAULT '' CHECK (pregnancy_status IN ('not-applicable', 'not-pregnant', 'pregnant', 'breastfeeding', 'prefer-not-to-say', '')),

    -- Step 4: medications
    takes_prescription_medicines VARCHAR(5) NOT NULL DEFAULT '' CHECK (takes_prescription_medicines IN ('yes', 'no', '')),
    takes_over_the_counter_medicines VARCHAR(5) NOT NULL DEFAULT '' CHECK (takes_over_the_counter_medicines IN ('yes', 'no', '')),
    takes_herbal_products VARCHAR(5) NOT NULL DEFAULT '' CHECK (takes_herbal_products IN ('yes', 'no', '')),
    takes_anticoagulant VARCHAR(5) NOT NULL DEFAULT '' CHECK (takes_anticoagulant IN ('yes', 'no', '')),
    takes_antiplatelet VARCHAR(5) NOT NULL DEFAULT '' CHECK (takes_antiplatelet IN ('yes', 'no', '')),
    takes_ace_inhibitor_or_arb VARCHAR(5) NOT NULL DEFAULT '' CHECK (takes_ace_inhibitor_or_arb IN ('yes', 'no', '')),
    takes_sglt2_inhibitor VARCHAR(5) NOT NULL DEFAULT '' CHECK (takes_sglt2_inhibitor IN ('yes', 'no', '')),
    takes_glp1_agonist VARCHAR(5) NOT NULL DEFAULT '' CHECK (takes_glp1_agonist IN ('yes', 'no', '')),
    glp1_formulation VARCHAR(10) NOT NULL DEFAULT '' CHECK (glp1_formulation IN ('daily', 'weekly', '')),
    glp1_held_per_guideline VARCHAR(5) NOT NULL DEFAULT '' CHECK (glp1_held_per_guideline IN ('yes', 'no', '')),
    glp1_extended_clear_fluids_confirmed VARCHAR(5) NOT NULL DEFAULT '' CHECK (glp1_extended_clear_fluids_confirmed IN ('yes', 'no', '')),
    glp1_gi_symptoms VARCHAR(5) NOT NULL DEFAULT '' CHECK (glp1_gi_symptoms IN ('yes', 'no', '')),
    glp1_gi_symptoms_details VARCHAR(500) NOT NULL DEFAULT '',
    glp1_gastric_ultrasound_performed VARCHAR(5) NOT NULL DEFAULT '' CHECK (glp1_gastric_ultrasound_performed IN ('yes', 'no', '')),
    glp1_gastric_ultrasound_findings VARCHAR(20) NOT NULL DEFAULT '' CHECK (glp1_gastric_ultrasound_findings IN ('empty', 'low-risk', 'full-stomach', '')),
    takes_corticosteroid VARCHAR(5) NOT NULL DEFAULT '' CHECK (takes_corticosteroid IN ('yes', 'no', '')),
    takes_immunosuppressant VARCHAR(5) NOT NULL DEFAULT '' CHECK (takes_immunosuppressant IN ('yes', 'no', '')),
    takes_hormone_therapy VARCHAR(5) NOT NULL DEFAULT '' CHECK (takes_hormone_therapy IN ('yes', 'no', '')),
    medication_hold_plan_agreed VARCHAR(5) NOT NULL DEFAULT '' CHECK (medication_hold_plan_agreed IN ('yes', 'no', '')),
    medication_hold_plan_agreed_by VARCHAR(255) NOT NULL DEFAULT '',
    medication_adherence VARCHAR(10) NOT NULL DEFAULT '' CHECK (medication_adherence IN ('full', 'partial', 'none', 'unknown', '')),
    medication_notes TEXT NOT NULL DEFAULT '',

    -- Step 5: allergies and intolerances
    has_drug_allergy VARCHAR(5) NOT NULL DEFAULT '' CHECK (has_drug_allergy IN ('yes', 'no', '')),
    drug_allergy_detail VARCHAR(500) NOT NULL DEFAULT '',
    has_food_allergy VARCHAR(5) NOT NULL DEFAULT '' CHECK (has_food_allergy IN ('yes', 'no', '')),
    food_allergy_detail VARCHAR(500) NOT NULL DEFAULT '',
    has_latex_allergy VARCHAR(5) NOT NULL DEFAULT '' CHECK (has_latex_allergy IN ('yes', 'no', '')),
    has_adhesive_allergy VARCHAR(5) NOT NULL DEFAULT '' CHECK (has_adhesive_allergy IN ('yes', 'no', '')),
    has_contrast_allergy VARCHAR(5) NOT NULL DEFAULT '' CHECK (has_contrast_allergy IN ('yes', 'no', '')),
    allergy_severity VARCHAR(15) NOT NULL DEFAULT '' CHECK (allergy_severity IN ('mild', 'moderate', 'severe', 'anaphylaxis', '')),
    adrenaline_auto_injector VARCHAR(5) NOT NULL DEFAULT '' CHECK (adrenaline_auto_injector IN ('yes', 'no', '')),
    allergy_notes TEXT NOT NULL DEFAULT '',

    -- Step 6: anaemia and iron studies
    bloods_sample_date DATE,
    haemoglobin_g_per_l NUMERIC(4,1) CHECK (haemoglobin_g_per_l IS NULL OR haemoglobin_g_per_l BETWEEN 20 AND 250),
    mean_cell_volume_fl NUMERIC(4,1) CHECK (mean_cell_volume_fl IS NULL OR mean_cell_volume_fl BETWEEN 40 AND 150),
    ferritin_ug_per_l NUMERIC(7,1) CHECK (ferritin_ug_per_l IS NULL OR ferritin_ug_per_l BETWEEN 0 AND 50000),
    transferrin_saturation_percent NUMERIC(4,1) CHECK (transferrin_saturation_percent IS NULL OR transferrin_saturation_percent BETWEEN 0 AND 100),
    vitamin_b12_ng_per_l NUMERIC(7,1),
    folate_ug_per_l NUMERIC(5,1),
    c_reactive_protein_mg_per_l NUMERIC(6,1),
    creatinine_umol_per_l NUMERIC(6,1),
    egfr_ml_per_min NUMERIC(4,1) CHECK (egfr_ml_per_min IS NULL OR egfr_ml_per_min BETWEEN 0 AND 200),
    anaemia_known_cause VARCHAR(255) NOT NULL DEFAULT '',
    anaemia_treatment_started VARCHAR(5) NOT NULL DEFAULT '' CHECK (anaemia_treatment_started IN ('yes', 'no', '')),
    anaemia_treatment_route VARCHAR(15) NOT NULL DEFAULT '' CHECK (anaemia_treatment_route IN ('oral', 'intravenous', 'none', '')),
    anaemia_treatment_start_date DATE,
    previous_transfusion VARCHAR(5) NOT NULL DEFAULT '' CHECK (previous_transfusion IN ('yes', 'no', '')),
    group_and_save_done VARCHAR(5) NOT NULL DEFAULT '' CHECK (group_and_save_done IN ('yes', 'no', '')),
    anaemia_notes TEXT NOT NULL DEFAULT '',

    -- Step 7: glycaemic control
    diabetes_type VARCHAR(20) NOT NULL DEFAULT '' CHECK (diabetes_type IN ('none', 'type-1', 'type-2', 'gestational', 'other', '')),
    diabetes_duration_years NUMERIC(4,1) CHECK (diabetes_duration_years IS NULL OR diabetes_duration_years BETWEEN 0 AND 100),
    hba1c_mmol_per_mol NUMERIC(4,1) CHECK (hba1c_mmol_per_mol IS NULL OR hba1c_mmol_per_mol BETWEEN 10 AND 200),
    hba1c_sample_date DATE,
    capillary_glucose_mmol_per_l NUMERIC(4,1) CHECK (capillary_glucose_mmol_per_l IS NULL OR capillary_glucose_mmol_per_l BETWEEN 0 AND 50),
    diabetes_treatment VARCHAR(30) NOT NULL DEFAULT '' CHECK (diabetes_treatment IN ('diet-only', 'oral-agents', 'insulin', 'oral-and-insulin', 'glp1-agonist', 'other', '')),
    insulin_regimen VARCHAR(255) NOT NULL DEFAULT '',
    hypoglycaemia_awareness VARCHAR(15) NOT NULL DEFAULT '' CHECK (hypoglycaemia_awareness IN ('normal', 'impaired', 'absent', '')),
    diabetes_team_review VARCHAR(5) NOT NULL DEFAULT '' CHECK (diabetes_team_review IN ('yes', 'no', '')),
    diabetes_team_review_date DATE,
    foot_check_done VARCHAR(5) NOT NULL DEFAULT '' CHECK (foot_check_done IN ('yes', 'no', '')),
    glycaemic_notes TEXT NOT NULL DEFAULT '',

    -- Step 8: smoking and tobacco
    smoking_status VARCHAR(15) NOT NULL DEFAULT '' CHECK (smoking_status IN ('never', 'former', 'current', '')),
    cigarettes_per_day INTEGER CHECK (cigarettes_per_day IS NULL OR cigarettes_per_day BETWEEN 0 AND 200),
    pack_years NUMERIC(5,1) CHECK (pack_years IS NULL OR pack_years BETWEEN 0 AND 300),
    quit_date DATE,
    smoking_cessation_offered VARCHAR(5) NOT NULL DEFAULT '' CHECK (smoking_cessation_offered IN ('yes', 'no', '')),
    smoking_cessation_accepted VARCHAR(5) NOT NULL DEFAULT '' CHECK (smoking_cessation_accepted IN ('yes', 'no', '')),
    nicotine_replacement VARCHAR(5) NOT NULL DEFAULT '' CHECK (nicotine_replacement IN ('yes', 'no', '')),
    vaping VARCHAR(5) NOT NULL DEFAULT '' CHECK (vaping IN ('yes', 'no', '')),
    smoking_notes TEXT NOT NULL DEFAULT '',

    -- Step 9: alcohol and other substances
    alcohol_units_per_week NUMERIC(5,1) CHECK (alcohol_units_per_week IS NULL OR alcohol_units_per_week BETWEEN 0 AND 300),
    audit_c_frequency INTEGER CHECK (audit_c_frequency IS NULL OR audit_c_frequency BETWEEN 0 AND 4),
    audit_c_typical_quantity INTEGER CHECK (audit_c_typical_quantity IS NULL OR audit_c_typical_quantity BETWEEN 0 AND 4),
    audit_c_binge_frequency INTEGER CHECK (audit_c_binge_frequency IS NULL OR audit_c_binge_frequency BETWEEN 0 AND 4),
    alcohol_dependence_features VARCHAR(5) NOT NULL DEFAULT '' CHECK (alcohol_dependence_features IN ('yes', 'no', '')),
    alcohol_reduction_plan_agreed VARCHAR(5) NOT NULL DEFAULT '' CHECK (alcohol_reduction_plan_agreed IN ('yes', 'no', '')),
    alcohol_services_referral VARCHAR(5) NOT NULL DEFAULT '' CHECK (alcohol_services_referral IN ('yes', 'no', '')),
    recreational_drug_use VARCHAR(5) NOT NULL DEFAULT '' CHECK (recreational_drug_use IN ('yes', 'no', '')),
    recreational_drug_detail VARCHAR(255) NOT NULL DEFAULT '',
    alcohol_notes TEXT NOT NULL DEFAULT '',

    -- Step 10: nutritional screening
    height_as_cm NUMERIC(5,1) CHECK (height_as_cm IS NULL OR height_as_cm BETWEEN 50 AND 250),
    weight_as_kg NUMERIC(5,1) CHECK (weight_as_kg IS NULL OR weight_as_kg BETWEEN 15 AND 400),
    body_mass_index NUMERIC(4,1) CHECK (body_mass_index IS NULL OR body_mass_index BETWEEN 8 AND 100),
    usual_weight_as_kg NUMERIC(5,1) CHECK (usual_weight_as_kg IS NULL OR usual_weight_as_kg BETWEEN 15 AND 400),
    weight_loss_percent NUMERIC(4,1) CHECK (weight_loss_percent IS NULL OR weight_loss_percent BETWEEN -100 AND 100),
    weight_loss_is_intentional VARCHAR(5) NOT NULL DEFAULT '' CHECK (weight_loss_is_intentional IN ('yes', 'no', '')),
    acutely_ill VARCHAR(5) NOT NULL DEFAULT '' CHECK (acutely_ill IN ('yes', 'no', '')),
    no_nutritional_intake_over_5_days VARCHAR(5) NOT NULL DEFAULT '' CHECK (no_nutritional_intake_over_5_days IN ('yes', 'no', '')),
    appetite VARCHAR(15) NOT NULL DEFAULT '' CHECK (appetite IN ('good', 'fair', 'poor', 'absent', '')),
    oral_nutritional_supplements VARCHAR(5) NOT NULL DEFAULT '' CHECK (oral_nutritional_supplements IN ('yes', 'no', '')),
    immunonutrition VARCHAR(5) NOT NULL DEFAULT '' CHECK (immunonutrition IN ('yes', 'no', '')),
    dietitian_referral VARCHAR(5) NOT NULL DEFAULT '' CHECK (dietitian_referral IN ('yes', 'no', '')),
    nutrition_notes TEXT NOT NULL DEFAULT '',

    -- Step 11: functional capacity and physical fitness
    usual_activity_level VARCHAR(20) NOT NULL DEFAULT '' CHECK (usual_activity_level IN ('sedentary', 'lightly-active', 'moderately-active', 'very-active', '')),
    climbs_flight_of_stairs VARCHAR(20) NOT NULL DEFAULT '' CHECK (climbs_flight_of_stairs IN ('yes-easily', 'yes-with-difficulty', 'no', '')),
    metabolic_equivalents NUMERIC(4,1) CHECK (metabolic_equivalents IS NULL OR metabolic_equivalents BETWEEN 0 AND 25),
    duke_activity_status_index NUMERIC(5,2) CHECK (duke_activity_status_index IS NULL OR duke_activity_status_index BETWEEN 0 AND 60),
    six_minute_walk_metres INTEGER CHECK (six_minute_walk_metres IS NULL OR six_minute_walk_metres BETWEEN 0 AND 1200),
    cpet_anaerobic_threshold NUMERIC(4,1) CHECK (cpet_anaerobic_threshold IS NULL OR cpet_anaerobic_threshold BETWEEN 0 AND 40),
    cpet_peak_vo2 NUMERIC(4,1) CHECK (cpet_peak_vo2 IS NULL OR cpet_peak_vo2 BETWEEN 0 AND 90),
    grip_strength_kg NUMERIC(4,1) CHECK (grip_strength_kg IS NULL OR grip_strength_kg BETWEEN 0 AND 100),
    prehabilitation_offered VARCHAR(5) NOT NULL DEFAULT '' CHECK (prehabilitation_offered IN ('yes', 'no', '')),
    prehabilitation_enrolled VARCHAR(5) NOT NULL DEFAULT '' CHECK (prehabilitation_enrolled IN ('yes', 'no', '')),
    prehabilitation_sessions_per_week INTEGER CHECK (prehabilitation_sessions_per_week IS NULL OR prehabilitation_sessions_per_week BETWEEN 0 AND 21),
    prehabilitation_start_date DATE,
    protein_supplementation_recommended VARCHAR(5) NOT NULL DEFAULT '' CHECK (protein_supplementation_recommended IN ('yes', 'no', '')),
    fitness_notes TEXT NOT NULL DEFAULT '',

    -- Step 12: frailty, cognition, and falls
    clinical_frailty_scale INTEGER CHECK (clinical_frailty_scale IS NULL OR clinical_frailty_scale BETWEEN 1 AND 9),
    fried_weakness VARCHAR(5) NOT NULL DEFAULT '' CHECK (fried_weakness IN ('yes', 'no', '')),
    fried_slowness VARCHAR(5) NOT NULL DEFAULT '' CHECK (fried_slowness IN ('yes', 'no', '')),
    fried_low_physical_activity VARCHAR(5) NOT NULL DEFAULT '' CHECK (fried_low_physical_activity IN ('yes', 'no', '')),
    fried_exhaustion VARCHAR(5) NOT NULL DEFAULT '' CHECK (fried_exhaustion IN ('yes', 'no', '')),
    fried_unintentional_weight_loss VARCHAR(5) NOT NULL DEFAULT '' CHECK (fried_unintentional_weight_loss IN ('yes', 'no', '')),
    risk_analysis_index_score INTEGER CHECK (risk_analysis_index_score IS NULL OR risk_analysis_index_score BETWEEN 0 AND 100),
    mini_cog_performed VARCHAR(5) NOT NULL DEFAULT '' CHECK (mini_cog_performed IN ('yes', 'no', '')),
    mini_cog_score INTEGER CHECK (mini_cog_score IS NULL OR mini_cog_score BETWEEN 0 AND 5),
    cognitive_screen_tool VARCHAR(20) NOT NULL DEFAULT '' CHECK (cognitive_screen_tool IN ('4at', 'amt', 'moca', 'mmse', 'none', '')),
    cognitive_screen_score NUMERIC(4,1),
    cognitive_impairment VARCHAR(15) NOT NULL DEFAULT '' CHECK (cognitive_impairment IN ('none', 'mild', 'moderate', 'severe', '')),
    capacity_concern VARCHAR(5) NOT NULL DEFAULT '' CHECK (capacity_concern IN ('yes', 'no', '')),
    falls_in_last_12_months INTEGER CHECK (falls_in_last_12_months IS NULL OR falls_in_last_12_months BETWEEN 0 AND 100),
    mobility_aid VARCHAR(25) NOT NULL DEFAULT '' CHECK (mobility_aid IN ('none', 'stick', 'frame', 'crutches', 'wheelchair', 'bed-bound', '')),
    living_situation VARCHAR(30) NOT NULL DEFAULT '' CHECK (living_situation IN ('alone', 'with-partner', 'with-family', 'shared-house', 'care-home', 'supported-living', 'homeless', 'other', '')),
    care_package VARCHAR(20) NOT NULL DEFAULT '' CHECK (care_package IN ('none', 'informal', 'daily', 'twice-daily', 'live-in', '')),
    frailty_notes TEXT NOT NULL DEFAULT '',

    -- Step 13: cardiorespiratory optimization
    systolic_bp INTEGER CHECK (systolic_bp IS NULL OR systolic_bp BETWEEN 50 AND 300),
    diastolic_bp INTEGER CHECK (diastolic_bp IS NULL OR diastolic_bp BETWEEN 20 AND 200),
    heart_rate INTEGER CHECK (heart_rate IS NULL OR heart_rate BETWEEN 20 AND 250),
    heart_rhythm VARCHAR(25) NOT NULL DEFAULT '' CHECK (heart_rhythm IN ('sinus', 'atrial-fibrillation', 'flutter', 'heart-block', 'paced', 'other', '')),
    murmur_present VARCHAR(5) NOT NULL DEFAULT '' CHECK (murmur_present IN ('yes', 'no', '')),
    exercise_tolerance VARCHAR(20) NOT NULL DEFAULT '' CHECK (exercise_tolerance IN ('good', 'moderate', 'poor', 'unable', '')),
    ejection_fraction_percent INTEGER CHECK (ejection_fraction_percent IS NULL OR ejection_fraction_percent BETWEEN 5 AND 80),
    echo_date DATE,
    asthma_control VARCHAR(20) NOT NULL DEFAULT '' CHECK (asthma_control IN ('none', 'controlled', 'partly-controlled', 'uncontrolled', '')),
    copd_control VARCHAR(20) NOT NULL DEFAULT '' CHECK (copd_control IN ('none', 'controlled', 'partly-controlled', 'uncontrolled', '')),
    inhaler_technique_checked VARCHAR(5) NOT NULL DEFAULT '' CHECK (inhaler_technique_checked IN ('yes', 'no', '')),
    rescue_steroids VARCHAR(5) NOT NULL DEFAULT '' CHECK (rescue_steroids IN ('yes', 'no', '')),
    spirometry_fev1_percent NUMERIC(4,1) CHECK (spirometry_fev1_percent IS NULL OR spirometry_fev1_percent BETWEEN 0 AND 200),
    stop_bang_score INTEGER CHECK (stop_bang_score IS NULL OR stop_bang_score BETWEEN 0 AND 8),
    sleep_apnoea_diagnosis VARCHAR(5) NOT NULL DEFAULT '' CHECK (sleep_apnoea_diagnosis IN ('yes', 'no', '')),
    cpap_use VARCHAR(5) NOT NULL DEFAULT '' CHECK (cpap_use IN ('yes', 'no', '')),
    oxygen_saturation_percent NUMERIC(4,1) CHECK (oxygen_saturation_percent IS NULL OR oxygen_saturation_percent BETWEEN 50 AND 100),
    cardiorespiratory_notes TEXT NOT NULL DEFAULT '',

    -- Step 14: psychological readiness and social support
    anxiety_level VARCHAR(15) NOT NULL DEFAULT '' CHECK (anxiety_level IN ('none', 'mild', 'moderate', 'severe', '')),
    depression_screen VARCHAR(15) NOT NULL DEFAULT '' CHECK (depression_screen IN ('negative', 'positive', 'not-done', '')),
    understands_procedure VARCHAR(5) NOT NULL DEFAULT '' CHECK (understands_procedure IN ('yes', 'no', '')),
    expectations_realistic VARCHAR(5) NOT NULL DEFAULT '' CHECK (expectations_realistic IN ('yes', 'no', '')),
    shared_decision_making_discussed VARCHAR(5) NOT NULL DEFAULT '' CHECK (shared_decision_making_discussed IN ('yes', 'no', '')),
    has_carer VARCHAR(5) NOT NULL DEFAULT '' CHECK (has_carer IN ('yes', 'no', '')),
    transport_home_arranged VARCHAR(5) NOT NULL DEFAULT '' CHECK (transport_home_arranged IN ('yes', 'no', '')),
    support_after_discharge VARCHAR(15) NOT NULL DEFAULT '' CHECK (support_after_discharge IN ('good', 'some', 'limited', 'none', '')),
    health_literacy VARCHAR(15) NOT NULL DEFAULT '' CHECK (health_literacy IN ('high', 'moderate', 'low', '')),
    psychological_support_offered VARCHAR(5) NOT NULL DEFAULT '' CHECK (psychological_support_offered IN ('yes', 'no', '')),
    social_notes TEXT NOT NULL DEFAULT '',

    -- Step 15: optimization plan by domain
    plan_anaemia VARCHAR(500) NOT NULL DEFAULT '',
    referral_anaemia VARCHAR(5) NOT NULL DEFAULT '' CHECK (referral_anaemia IN ('yes', 'no', '')),
    plan_glycaemic_control VARCHAR(500) NOT NULL DEFAULT '',
    referral_glycaemic_control VARCHAR(5) NOT NULL DEFAULT '' CHECK (referral_glycaemic_control IN ('yes', 'no', '')),
    plan_smoking VARCHAR(500) NOT NULL DEFAULT '',
    referral_smoking VARCHAR(5) NOT NULL DEFAULT '' CHECK (referral_smoking IN ('yes', 'no', '')),
    plan_alcohol VARCHAR(500) NOT NULL DEFAULT '',
    referral_alcohol VARCHAR(5) NOT NULL DEFAULT '' CHECK (referral_alcohol IN ('yes', 'no', '')),
    plan_nutrition VARCHAR(500) NOT NULL DEFAULT '',
    referral_nutrition VARCHAR(5) NOT NULL DEFAULT '' CHECK (referral_nutrition IN ('yes', 'no', '')),
    plan_physical_fitness VARCHAR(500) NOT NULL DEFAULT '',
    referral_physical_fitness VARCHAR(5) NOT NULL DEFAULT '' CHECK (referral_physical_fitness IN ('yes', 'no', '')),
    plan_medication VARCHAR(500) NOT NULL DEFAULT '',
    referral_medication VARCHAR(5) NOT NULL DEFAULT '' CHECK (referral_medication IN ('yes', 'no', '')),
    plan_cardiorespiratory VARCHAR(500) NOT NULL DEFAULT '',
    referral_cardiorespiratory VARCHAR(5) NOT NULL DEFAULT '' CHECK (referral_cardiorespiratory IN ('yes', 'no', '')),
    responsible_clinician VARCHAR(255) NOT NULL DEFAULT '',
    plan_agreed_with_patient VARCHAR(5) NOT NULL DEFAULT '' CHECK (plan_agreed_with_patient IN ('yes', 'no', '')),
    plan_shared_with_patient VARCHAR(5) NOT NULL DEFAULT '' CHECK (plan_shared_with_patient IN ('yes', 'no', '')),
    next_review_date DATE,
    plan_notes TEXT NOT NULL DEFAULT '',

    -- Step 16: readiness summary and sign-off
    gate_decision VARCHAR(30) NOT NULL DEFAULT '' CHECK (gate_decision IN ('proceed', 'proceed-with-prehabilitation', 'defer-and-optimize', 'accept-unoptimized-risk', 'mdt-review', 'cancel', '')),
    additional_notes TEXT NOT NULL DEFAULT ''
);

CREATE INDEX perioperative_optimization_patient_id_index
    ON perioperative_optimization (patient_id);

CREATE INDEX perioperative_optimization_clinician_id_index
    ON perioperative_optimization (clinician_id);

CREATE INDEX perioperative_optimization_status_index
    ON perioperative_optimization (status);

CREATE INDEX perioperative_optimization_surgery_date_index
    ON perioperative_optimization (planned_surgery_date);

CREATE TRIGGER trigger_perioperative_optimization_updated_at
    BEFORE UPDATE ON perioperative_optimization
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE perioperative_optimization IS
    'Perioperative optimization: the payload of the 16-step single-page wizard, covering the eight optimization domains plus the history, medication, allergy, frailty, and social context that shapes the prehabilitation plan.';
COMMENT ON COLUMN perioperative_optimization.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN perioperative_optimization.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN perioperative_optimization.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN perioperative_optimization.deleted_at IS
    'Soft-delete timestamp; NULL when the row is live.';
COMMENT ON COLUMN perioperative_optimization.patient_id IS
    'Foreign key to the patient table.';
COMMENT ON COLUMN perioperative_optimization.clinician_id IS
    'Foreign key to the clinician table, i.e. the practitioner conducting the assessment.';
COMMENT ON COLUMN perioperative_optimization.status IS
    'Workflow status of the assessment: draft, submitted, reviewed, or urgent.';
COMMENT ON COLUMN perioperative_optimization.assessment_date IS
    'Date the assessment was conducted. With planned_surgery_date this is the basis of the time-to-surgery gating that drives every domain status.';
COMMENT ON COLUMN perioperative_optimization.assessment_time IS
    'Time the assessment was conducted.';
COMMENT ON COLUMN perioperative_optimization.site_name IS
    'Site where the assessment was conducted.';
COMMENT ON COLUMN perioperative_optimization.service_name IS
    'Service conducting the assessment, such as the pre-operative assessment clinic or the prehabilitation service.';
COMMENT ON COLUMN perioperative_optimization.pathway_stage IS
    'Where in the perioperative pathway this assessment sits, from referral through to pre-admission.';
COMMENT ON COLUMN perioperative_optimization.assessment_mode IS
    'How the assessment was conducted, including online-portal for the patient-completed pattern such as MyPreOp.';
COMMENT ON COLUMN perioperative_optimization.referral_source IS
    'Who referred the patient into the perioperative optimization service.';
COMMENT ON COLUMN perioperative_optimization.planned_procedure IS
    'The procedure the patient is listed for.';
COMMENT ON COLUMN perioperative_optimization.surgical_specialty IS
    'Surgical specialty responsible for the procedure.';
COMMENT ON COLUMN perioperative_optimization.consultant_surgeon IS
    'Consultant surgeon responsible for the procedure.';
COMMENT ON COLUMN perioperative_optimization.planned_surgery_date IS
    'Planned date of surgery. With assessment_date this determines weeks_to_surgery, which every optimization domain lead time is gated against. A missing date disables gating and marks every triggered domain action-required.';
COMMENT ON COLUMN perioperative_optimization.urgency IS
    'Urgency of the procedure. Emergency surgery is out of scope for this form: there is no lead time to optimize in.';
COMMENT ON COLUMN perioperative_optimization.surgical_severity IS
    'Surgical severity band, where major and major-plus raise the priority of an unoptimized smoking domain.';
COMMENT ON COLUMN perioperative_optimization.laterality IS
    'Side of the body the procedure is on, where applicable.';
COMMENT ON COLUMN perioperative_optimization.anticipated_blood_loss_ml IS
    'Anticipated blood loss in ml, which raises the importance of correcting anaemia before surgery.';
COMMENT ON COLUMN perioperative_optimization.anticipated_length_of_stay_days IS
    'Anticipated length of stay in days.';
COMMENT ON COLUMN perioperative_optimization.interpreter_required IS
    'Whether an interpreter is required for the consultation.';
COMMENT ON COLUMN perioperative_optimization.interpreter_language IS
    'Language the interpreter is required for.';
COMMENT ON COLUMN perioperative_optimization.condition_cardiac IS
    'Whether the patient has a cardiac diagnosis.';
COMMENT ON COLUMN perioperative_optimization.condition_respiratory IS
    'Whether the patient has a respiratory diagnosis such as asthma or chronic obstructive pulmonary disease.';
COMMENT ON COLUMN perioperative_optimization.condition_renal IS
    'Whether the patient has a renal diagnosis.';
COMMENT ON COLUMN perioperative_optimization.condition_hepatic IS
    'Whether the patient has a liver diagnosis.';
COMMENT ON COLUMN perioperative_optimization.condition_stroke IS
    'Whether the patient has had a stroke or transient ischaemic attack.';
COMMENT ON COLUMN perioperative_optimization.condition_cancer IS
    'Whether the patient has a cancer diagnosis, which often constrains how long surgery can be deferred to optimize.';
COMMENT ON COLUMN perioperative_optimization.condition_rheumatological IS
    'Whether the patient has a rheumatological diagnosis, which often means immunosuppressant therapy.';
COMMENT ON COLUMN perioperative_optimization.condition_thyroid IS
    'Whether the patient has a thyroid diagnosis.';
COMMENT ON COLUMN perioperative_optimization.condition_other IS
    'Any other active diagnosis relevant to perioperative optimization.';
COMMENT ON COLUMN perioperative_optimization.previous_surgery IS
    'Whether the patient has had previous surgery.';
COMMENT ON COLUMN perioperative_optimization.previous_surgery_detail IS
    'What previous surgery the patient has had.';
COMMENT ON COLUMN perioperative_optimization.previous_anaesthetic_complication IS
    'Whether the patient has had a previous anaesthetic complication.';
COMMENT ON COLUMN perioperative_optimization.previous_anaesthetic_complication_detail IS
    'Description of the previous anaesthetic complication.';
COMMENT ON COLUMN perioperative_optimization.postoperative_nausea_history IS
    'Whether the patient has a history of postoperative nausea and vomiting.';
COMMENT ON COLUMN perioperative_optimization.difficult_airway_history IS
    'Whether a difficult airway has been documented previously.';
COMMENT ON COLUMN perioperative_optimization.malignant_hyperthermia_history IS
    'Whether the patient or their family has a history of malignant hyperthermia.';
COMMENT ON COLUMN perioperative_optimization.venous_thromboembolism_history IS
    'Whether the patient has a history of deep vein thrombosis or pulmonary embolism.';
COMMENT ON COLUMN perioperative_optimization.family_history IS
    'Relevant family history, such as malignant hyperthermia or suxamethonium apnoea.';
COMMENT ON COLUMN perioperative_optimization.pregnancy_status IS
    'Pregnancy and lactation status. Elective surgery is normally deferred in pregnancy.';
COMMENT ON COLUMN perioperative_optimization.takes_prescription_medicines IS
    'Whether the patient takes prescription medicines.';
COMMENT ON COLUMN perioperative_optimization.takes_over_the_counter_medicines IS
    'Whether the patient takes over-the-counter medicines.';
COMMENT ON COLUMN perioperative_optimization.takes_herbal_products IS
    'Whether the patient takes herbal or complementary products, several of which affect bleeding or interact with anaesthetic agents.';
COMMENT ON COLUMN perioperative_optimization.takes_anticoagulant IS
    'Whether the patient takes an anticoagulant. Without an agreed hold-and-restart plan this triggers the medication domain and a high-priority flag.';
COMMENT ON COLUMN perioperative_optimization.takes_antiplatelet IS
    'Whether the patient takes an antiplatelet. Without an agreed hold-and-restart plan this triggers the medication domain and a high-priority flag.';
COMMENT ON COLUMN perioperative_optimization.takes_ace_inhibitor_or_arb IS
    'Whether the patient takes an ACE inhibitor or angiotensin receptor blocker, commonly omitted on the morning of surgery because of refractory intraoperative hypotension.';
COMMENT ON COLUMN perioperative_optimization.takes_sglt2_inhibitor IS
    'Whether the patient takes an SGLT2 inhibitor. These can precipitate ketoacidosis with a normal blood glucose, so an unheld SGLT2 inhibitor fires a high-priority flag.';
COMMENT ON COLUMN perioperative_optimization.takes_glp1_agonist IS
    'Whether the patient takes a GLP-1 receptor agonist (semaglutide, tirzepatide, and related drugs). These delay gastric emptying, so the patient may have a full stomach despite standard fasting; the aspiration-risk flag fires when GI symptoms are active or the drug was not held/confirmed per guideline, per glp1_held_per_guideline and glp1_extended_clear_fluids_confirmed.';
COMMENT ON COLUMN perioperative_optimization.glp1_formulation IS
    'GLP-1 receptor agonist dosing formulation: daily or weekly. Drives the hold window -- hold daily formulations day-of, hold weekly formulations one week before surgery.';
COMMENT ON COLUMN perioperative_optimization.glp1_held_per_guideline IS
    'Whether the GLP-1 receptor agonist was held per the agreed perioperative schedule.';
COMMENT ON COLUMN perioperative_optimization.glp1_extended_clear_fluids_confirmed IS
    'Whether the patient instead followed the extended-fasting alternative: 24-hour solid fast plus 4-8 hour clear-liquid fast, when the medication could not be held.';
COMMENT ON COLUMN perioperative_optimization.glp1_gi_symptoms IS
    'Whether the patient reports active GLP-1-related gastrointestinal symptoms (nausea, vomiting, early satiety, reflux, bloating) at the time of assessment.';
COMMENT ON COLUMN perioperative_optimization.glp1_gi_symptoms_details IS
    'Free-text description of the reported GLP-1-related gastrointestinal symptoms and their severity.';
COMMENT ON COLUMN perioperative_optimization.glp1_gastric_ultrasound_performed IS
    'Whether point-of-care gastric ultrasound was performed to assess residual gastric content.';
COMMENT ON COLUMN perioperative_optimization.glp1_gastric_ultrasound_findings IS
    'Gastric ultrasound finding: empty, low-risk, or full-stomach.';
COMMENT ON COLUMN perioperative_optimization.takes_corticosteroid IS
    'Whether the patient takes a systemic corticosteroid, which may require perioperative supplementation and must never be stopped abruptly.';
COMMENT ON COLUMN perioperative_optimization.takes_immunosuppressant IS
    'Whether the patient takes an immunosuppressant or biologic, which affects wound healing and infection risk.';
COMMENT ON COLUMN perioperative_optimization.takes_hormone_therapy IS
    'Whether the patient takes hormone therapy or a combined oral contraceptive, which carries a venous thromboembolism risk.';
COMMENT ON COLUMN perioperative_optimization.medication_hold_plan_agreed IS
    'Whether a perioperative hold-and-restart plan has been agreed with the prescriber. This is the medication domain''s optimization criterion.';
COMMENT ON COLUMN perioperative_optimization.medication_hold_plan_agreed_by IS
    'Who agreed the hold-and-restart plan, because the prescriber owns the decision.';
COMMENT ON COLUMN perioperative_optimization.medication_adherence IS
    'Reported adherence to prescribed medicines.';
COMMENT ON COLUMN perioperative_optimization.medication_notes IS
    'Free-text notes from the medication review.';
COMMENT ON COLUMN perioperative_optimization.has_drug_allergy IS
    'Whether the patient has a drug allergy.';
COMMENT ON COLUMN perioperative_optimization.drug_allergy_detail IS
    'Which drugs the patient reacts to, and how.';
COMMENT ON COLUMN perioperative_optimization.has_food_allergy IS
    'Whether the patient has a food allergy, which constrains oral nutritional supplements and enteral feeds.';
COMMENT ON COLUMN perioperative_optimization.food_allergy_detail IS
    'Which foods the patient reacts to, and how.';
COMMENT ON COLUMN perioperative_optimization.has_latex_allergy IS
    'Whether the patient has a latex allergy, which changes theatre preparation.';
COMMENT ON COLUMN perioperative_optimization.has_adhesive_allergy IS
    'Whether the patient reacts to adhesives or dressings.';
COMMENT ON COLUMN perioperative_optimization.has_contrast_allergy IS
    'Whether the patient reacts to radiological contrast media.';
COMMENT ON COLUMN perioperative_optimization.allergy_severity IS
    'Worst recorded reaction severity, where anaphylaxis changes theatre and recovery preparation.';
COMMENT ON COLUMN perioperative_optimization.adrenaline_auto_injector IS
    'Whether the patient carries an adrenaline auto-injector.';
COMMENT ON COLUMN perioperative_optimization.allergy_notes IS
    'Free-text notes about allergies and intolerances.';
COMMENT ON COLUMN perioperative_optimization.bloods_sample_date IS
    'Date the blood sample was taken, so the report can say how current the results are.';
COMMENT ON COLUMN perioperative_optimization.haemoglobin_g_per_l IS
    'Haemoglobin in g per litre. Below 130 in men or 120 in women triggers the anaemia domain; below 80 forces a defer-surgery band and a high-priority flag.';
COMMENT ON COLUMN perioperative_optimization.mean_cell_volume_fl IS
    'Mean cell volume in femtolitres, which helps characterize the anaemia.';
COMMENT ON COLUMN perioperative_optimization.ferritin_ug_per_l IS
    'Ferritin in micrograms per litre. Below 30 indicates absolute iron deficiency and triggers the anaemia domain.';
COMMENT ON COLUMN perioperative_optimization.transferrin_saturation_percent IS
    'Transferrin saturation as a percentage. Below 20 with a ferritin of 30 to 100 indicates functional iron deficiency.';
COMMENT ON COLUMN perioperative_optimization.vitamin_b12_ng_per_l IS
    'Vitamin B12 in nanograms per litre, an alternative cause of anaemia.';
COMMENT ON COLUMN perioperative_optimization.folate_ug_per_l IS
    'Serum folate in micrograms per litre, an alternative cause of anaemia.';
COMMENT ON COLUMN perioperative_optimization.c_reactive_protein_mg_per_l IS
    'C-reactive protein in mg per litre. Inflammation raises ferritin, so a high value changes how the iron studies are read.';
COMMENT ON COLUMN perioperative_optimization.creatinine_umol_per_l IS
    'Serum creatinine in micromol per litre.';
COMMENT ON COLUMN perioperative_optimization.egfr_ml_per_min IS
    'Estimated glomerular filtration rate in ml per minute per 1.73 square metres. Below 30 raises the renal-optimization flag.';
COMMENT ON COLUMN perioperative_optimization.anaemia_known_cause IS
    'Known or suspected cause of the anaemia. Iron deficiency in an adult may indicate gastrointestinal blood loss and warrants its own pathway.';
COMMENT ON COLUMN perioperative_optimization.anaemia_treatment_started IS
    'Whether iron or other anaemia treatment has already started, which moves the anaemia domain from action-required to in-progress.';
COMMENT ON COLUMN perioperative_optimization.anaemia_treatment_route IS
    'Route of iron replacement. Intravenous iron needs a 4-week lead time; oral iron needs 8.';
COMMENT ON COLUMN perioperative_optimization.anaemia_treatment_start_date IS
    'Date anaemia treatment started.';
COMMENT ON COLUMN perioperative_optimization.previous_transfusion IS
    'Whether the patient has been transfused before.';
COMMENT ON COLUMN perioperative_optimization.group_and_save_done IS
    'Whether a group and save sample has been taken.';
COMMENT ON COLUMN perioperative_optimization.anaemia_notes IS
    'Free-text notes about anaemia and iron status.';
COMMENT ON COLUMN perioperative_optimization.diabetes_type IS
    'Diabetes diagnosis and type. A raised HbA1c with no diagnosis recorded fires the undiagnosed-diabetes flag.';
COMMENT ON COLUMN perioperative_optimization.diabetes_duration_years IS
    'How long the patient has had diabetes, in years.';
COMMENT ON COLUMN perioperative_optimization.hba1c_mmol_per_mol IS
    'Glycated haemoglobin in mmol per mol. At or above 48 triggers the glycaemic-control domain; at or above 69, the CPOC deferral threshold of 8.5 percent, it forces a defer-surgery band and a high-priority flag.';
COMMENT ON COLUMN perioperative_optimization.hba1c_sample_date IS
    'Date the HbA1c sample was taken. HbA1c reflects roughly three months of glycaemia, which is why the domain lead time is 12 weeks.';
COMMENT ON COLUMN perioperative_optimization.capillary_glucose_mmol_per_l IS
    'Capillary blood glucose in mmol per litre at the time of assessment.';
COMMENT ON COLUMN perioperative_optimization.diabetes_treatment IS
    'How the patient''s diabetes is treated.';
COMMENT ON COLUMN perioperative_optimization.insulin_regimen IS
    'The patient''s insulin regimen, which needs a written day-of-surgery plan.';
COMMENT ON COLUMN perioperative_optimization.hypoglycaemia_awareness IS
    'Whether the patient is aware of hypoglycaemia, because impaired or absent awareness changes perioperative monitoring.';
COMMENT ON COLUMN perioperative_optimization.diabetes_team_review IS
    'Whether the diabetes team has reviewed the patient, which moves the glycaemic-control domain to in-progress.';
COMMENT ON COLUMN perioperative_optimization.diabetes_team_review_date IS
    'Date of the diabetes-team review.';
COMMENT ON COLUMN perioperative_optimization.foot_check_done IS
    'Whether a diabetic foot check has been done, because pressure injury risk rises during long procedures.';
COMMENT ON COLUMN perioperative_optimization.glycaemic_notes IS
    'Free-text notes about glycaemic control.';
COMMENT ON COLUMN perioperative_optimization.smoking_status IS
    'Smoking status. Any current smoker triggers the smoking domain, which needs a 4-week lead time for the respiratory benefit.';
COMMENT ON COLUMN perioperative_optimization.cigarettes_per_day IS
    'Cigarettes smoked per day.';
COMMENT ON COLUMN perioperative_optimization.pack_years IS
    'Pack-years of smoking history.';
COMMENT ON COLUMN perioperative_optimization.quit_date IS
    'Date the patient stopped smoking, so weeks quit before surgery can be computed.';
COMMENT ON COLUMN perioperative_optimization.smoking_cessation_offered IS
    'Whether cessation support was offered.';
COMMENT ON COLUMN perioperative_optimization.smoking_cessation_accepted IS
    'Whether the patient accepted cessation support, which moves the smoking domain to in-progress.';
COMMENT ON COLUMN perioperative_optimization.nicotine_replacement IS
    'Whether nicotine replacement therapy has been supplied.';
COMMENT ON COLUMN perioperative_optimization.vaping IS
    'Whether the patient vapes.';
COMMENT ON COLUMN perioperative_optimization.smoking_notes IS
    'Free-text notes about smoking and tobacco.';
COMMENT ON COLUMN perioperative_optimization.alcohol_units_per_week IS
    'Alcohol consumption in United Kingdom units per week. Above 14 triggers the alcohol domain.';
COMMENT ON COLUMN perioperative_optimization.audit_c_frequency IS
    'AUDIT-C question 1: how often the patient has a drink containing alcohol, scored 0 to 4.';
COMMENT ON COLUMN perioperative_optimization.audit_c_typical_quantity IS
    'AUDIT-C question 2: how many standard drinks on a typical drinking day, scored 0 to 4.';
COMMENT ON COLUMN perioperative_optimization.audit_c_binge_frequency IS
    'AUDIT-C question 3: how often the patient has six or more drinks on one occasion, scored 0 to 4.';
COMMENT ON COLUMN perioperative_optimization.alcohol_dependence_features IS
    'Whether features of alcohol dependence are present, because withdrawal may occur during the hospital stay.';
COMMENT ON COLUMN perioperative_optimization.alcohol_reduction_plan_agreed IS
    'Whether a reduction plan has been agreed, which moves the alcohol domain to in-progress.';
COMMENT ON COLUMN perioperative_optimization.alcohol_services_referral IS
    'Whether the patient has been referred to alcohol services.';
COMMENT ON COLUMN perioperative_optimization.recreational_drug_use IS
    'Whether the patient uses recreational drugs, which can interact with anaesthetic agents.';
COMMENT ON COLUMN perioperative_optimization.recreational_drug_detail IS
    'Which recreational drugs the patient uses.';
COMMENT ON COLUMN perioperative_optimization.alcohol_notes IS
    'Free-text notes about alcohol and other substances.';
COMMENT ON COLUMN perioperative_optimization.height_as_cm IS
    'Height in cm, for the body mass index component of MUST.';
COMMENT ON COLUMN perioperative_optimization.weight_as_kg IS
    'Weight in kg, for the body mass index and weight-loss components of MUST.';
COMMENT ON COLUMN perioperative_optimization.body_mass_index IS
    'Body mass index in kg per square metre, scored as MUST step 1.';
COMMENT ON COLUMN perioperative_optimization.usual_weight_as_kg IS
    'The patient''s usual or pre-illness weight in kg, i.e. the baseline for percentage weight loss.';
COMMENT ON COLUMN perioperative_optimization.weight_loss_percent IS
    'Percentage unintentional weight loss over the last three to six months, scored as MUST step 2. Above 10 also triggers the nutrition domain on its own.';
COMMENT ON COLUMN perioperative_optimization.weight_loss_is_intentional IS
    'Whether the weight loss was intentional. Only unplanned loss scores in MUST.';
COMMENT ON COLUMN perioperative_optimization.acutely_ill IS
    'Whether the patient is acutely ill, i.e. the first half of the MUST step 3 acute disease effect criterion.';
COMMENT ON COLUMN perioperative_optimization.no_nutritional_intake_over_5_days IS
    'Whether there has been, or is likely to be, no nutritional intake for more than five days, i.e. the second half of the MUST step 3 criterion.';
COMMENT ON COLUMN perioperative_optimization.appetite IS
    'The patient''s appetite.';
COMMENT ON COLUMN perioperative_optimization.oral_nutritional_supplements IS
    'Whether oral nutritional supplements have been started, which moves the nutrition domain to in-progress.';
COMMENT ON COLUMN perioperative_optimization.immunonutrition IS
    'Whether immunonutrition has been started, typically for five to seven days before major gastrointestinal surgery.';
COMMENT ON COLUMN perioperative_optimization.dietitian_referral IS
    'Whether the patient has been referred to a dietitian.';
COMMENT ON COLUMN perioperative_optimization.nutrition_notes IS
    'Free-text notes about nutritional screening.';
COMMENT ON COLUMN perioperative_optimization.usual_activity_level IS
    'The patient''s usual physical activity level.';
COMMENT ON COLUMN perioperative_optimization.climbs_flight_of_stairs IS
    'Whether the patient can climb a flight of stairs without stopping, the plain-language proxy for four metabolic equivalents that most patients can answer.';
COMMENT ON COLUMN perioperative_optimization.metabolic_equivalents IS
    'Estimated metabolic equivalents. Below 4 triggers the physical-fitness domain; 4 METs is the classic threshold below which perioperative risk rises.';
COMMENT ON COLUMN perioperative_optimization.duke_activity_status_index IS
    'Duke Activity Status Index. Below 34 triggers the physical-fitness domain.';
COMMENT ON COLUMN perioperative_optimization.six_minute_walk_metres IS
    'Six-minute walk distance in metres. Below 400 triggers the physical-fitness domain.';
COMMENT ON COLUMN perioperative_optimization.cpet_anaerobic_threshold IS
    'Anaerobic threshold in ml per kg per minute on cardiopulmonary exercise testing. Below 11 triggers the physical-fitness domain.';
COMMENT ON COLUMN perioperative_optimization.cpet_peak_vo2 IS
    'Peak oxygen uptake in ml per kg per minute on cardiopulmonary exercise testing.';
COMMENT ON COLUMN perioperative_optimization.grip_strength_kg IS
    'Hand-grip strength in kg by dynamometer.';
COMMENT ON COLUMN perioperative_optimization.prehabilitation_offered IS
    'Whether a prehabilitation programme was offered.';
COMMENT ON COLUMN perioperative_optimization.prehabilitation_enrolled IS
    'Whether the patient enrolled in prehabilitation, which moves the physical-fitness domain to in-progress.';
COMMENT ON COLUMN perioperative_optimization.prehabilitation_sessions_per_week IS
    'Number of prehabilitation sessions per week.';
COMMENT ON COLUMN perioperative_optimization.prehabilitation_start_date IS
    'Date the prehabilitation programme started.';
COMMENT ON COLUMN perioperative_optimization.protein_supplementation_recommended IS
    'Whether protein supplementation is recommended, particularly for a frail patient on a GLP-1 receptor agonist at risk of accelerated sarcopenia.';
COMMENT ON COLUMN perioperative_optimization.fitness_notes IS
    'Free-text notes about functional capacity and physical fitness.';
COMMENT ON COLUMN perioperative_optimization.clinical_frailty_scale IS
    'Clinical Frailty Scale, 1 to 9. Reported and flagged at 7 or above, but not gated, because frailty is rarely reversible in a weeks-long window. A score of 5 or above indicates a Mini-Cog.';
COMMENT ON COLUMN perioperative_optimization.fried_weakness IS
    'Fried Frailty Phenotype criterion: weakness, i.e. reduced grip strength for sex and BMI.';
COMMENT ON COLUMN perioperative_optimization.fried_slowness IS
    'Fried Frailty Phenotype criterion: slowness, i.e. reduced walking speed for sex and height.';
COMMENT ON COLUMN perioperative_optimization.fried_low_physical_activity IS
    'Fried Frailty Phenotype criterion: low physical activity level.';
COMMENT ON COLUMN perioperative_optimization.fried_exhaustion IS
    'Fried Frailty Phenotype criterion: self-reported exhaustion.';
COMMENT ON COLUMN perioperative_optimization.fried_unintentional_weight_loss IS
    'Fried Frailty Phenotype criterion: unintentional weight loss.';
COMMENT ON COLUMN perioperative_optimization.risk_analysis_index_score IS
    'Risk Analysis Index (RAI) score; higher scores indicate greater frailty.';
COMMENT ON COLUMN perioperative_optimization.mini_cog_performed IS
    'Whether the Mini-Cog cognitive screen was performed, indicated when the Clinical Frailty Scale is 5 or above.';
COMMENT ON COLUMN perioperative_optimization.mini_cog_score IS
    'Mini-Cog total score 0-5 (three-item recall plus clock-draw test). A score of 0-2 suggests cognitive impairment.';
COMMENT ON COLUMN perioperative_optimization.cognitive_screen_tool IS
    'Which cognitive screening tool was used.';
COMMENT ON COLUMN perioperative_optimization.cognitive_screen_score IS
    'Score from the cognitive screening tool used.';
COMMENT ON COLUMN perioperative_optimization.cognitive_impairment IS
    'Degree of cognitive impairment, which affects consent, recall, and postoperative delirium risk.';
COMMENT ON COLUMN perioperative_optimization.capacity_concern IS
    'Whether there is a concern about the patient''s capacity to consent, which fires the capacity-concern flag.';
COMMENT ON COLUMN perioperative_optimization.falls_in_last_12_months IS
    'Number of falls in the last 12 months.';
COMMENT ON COLUMN perioperative_optimization.mobility_aid IS
    'What mobility aid the patient uses, which shapes what prehabilitation can realistically involve.';
COMMENT ON COLUMN perioperative_optimization.living_situation IS
    'The patient''s living situation, which bears on discharge planning.';
COMMENT ON COLUMN perioperative_optimization.care_package IS
    'What care package the patient already receives.';
COMMENT ON COLUMN perioperative_optimization.frailty_notes IS
    'Free-text notes about frailty, cognition, and falls.';
COMMENT ON COLUMN perioperative_optimization.systolic_bp IS
    'Systolic blood pressure in mmHg. At or above 180 triggers the cardiorespiratory domain and fires the uncontrolled-hypertension flag.';
COMMENT ON COLUMN perioperative_optimization.diastolic_bp IS
    'Diastolic blood pressure in mmHg. At or above 110 triggers the cardiorespiratory domain and fires the uncontrolled-hypertension flag.';
COMMENT ON COLUMN perioperative_optimization.heart_rate IS
    'Heart rate in beats per minute.';
COMMENT ON COLUMN perioperative_optimization.heart_rhythm IS
    'Cardiac rhythm, such as sinus or atrial fibrillation.';
COMMENT ON COLUMN perioperative_optimization.murmur_present IS
    'Whether a murmur is audible, which may warrant an echocardiogram before surgery.';
COMMENT ON COLUMN perioperative_optimization.exercise_tolerance IS
    'Clinician-assessed exercise tolerance.';
COMMENT ON COLUMN perioperative_optimization.ejection_fraction_percent IS
    'Left ventricular ejection fraction as a percentage. Below 40 triggers the cardiorespiratory domain and fires a high-priority flag.';
COMMENT ON COLUMN perioperative_optimization.echo_date IS
    'Date of the echocardiogram the ejection fraction came from.';
COMMENT ON COLUMN perioperative_optimization.asthma_control IS
    'Asthma control. Uncontrolled asthma triggers the cardiorespiratory domain.';
COMMENT ON COLUMN perioperative_optimization.copd_control IS
    'Chronic obstructive pulmonary disease control. Uncontrolled COPD triggers the cardiorespiratory domain.';
COMMENT ON COLUMN perioperative_optimization.inhaler_technique_checked IS
    'Whether inhaler technique has been checked, one of the quickest respiratory optimizations available.';
COMMENT ON COLUMN perioperative_optimization.rescue_steroids IS
    'Whether the patient has rescue steroids at home.';
COMMENT ON COLUMN perioperative_optimization.spirometry_fev1_percent IS
    'Forced expiratory volume in one second as a percentage of predicted.';
COMMENT ON COLUMN perioperative_optimization.stop_bang_score IS
    'STOP-BANG obstructive sleep apnoea screening score, 0 to 8. A score of 5 or more without a sleep-apnoea diagnosis triggers the cardiorespiratory domain.';
COMMENT ON COLUMN perioperative_optimization.sleep_apnoea_diagnosis IS
    'Whether obstructive sleep apnoea has been diagnosed.';
COMMENT ON COLUMN perioperative_optimization.cpap_use IS
    'Whether the patient uses continuous positive airway pressure, which should be brought to hospital.';
COMMENT ON COLUMN perioperative_optimization.oxygen_saturation_percent IS
    'Peripheral oxygen saturation as a percentage on room air. Below 92 fires the respiratory-optimization flag.';
COMMENT ON COLUMN perioperative_optimization.cardiorespiratory_notes IS
    'Free-text notes about cardiorespiratory optimization.';
COMMENT ON COLUMN perioperative_optimization.anxiety_level IS
    'The patient''s anxiety about the procedure, which affects recovery and adherence to the plan.';
COMMENT ON COLUMN perioperative_optimization.depression_screen IS
    'Outcome of the depression screen.';
COMMENT ON COLUMN perioperative_optimization.understands_procedure IS
    'Whether the patient understands what the procedure involves.';
COMMENT ON COLUMN perioperative_optimization.expectations_realistic IS
    'Whether the patient''s expectations of the outcome are realistic.';
COMMENT ON COLUMN perioperative_optimization.shared_decision_making_discussed IS
    'Whether a shared decision-making conversation has taken place, including the option of not having surgery.';
COMMENT ON COLUMN perioperative_optimization.has_carer IS
    'Whether the patient has a carer.';
COMMENT ON COLUMN perioperative_optimization.transport_home_arranged IS
    'Whether transport home after the procedure has been arranged.';
COMMENT ON COLUMN perioperative_optimization.support_after_discharge IS
    'What support the patient will have after discharge.';
COMMENT ON COLUMN perioperative_optimization.health_literacy IS
    'The patient''s health literacy, which sets the reading level of the prehabilitation materials.';
COMMENT ON COLUMN perioperative_optimization.psychological_support_offered IS
    'Whether psychological support has been offered as part of multimodal prehabilitation.';
COMMENT ON COLUMN perioperative_optimization.social_notes IS
    'Free-text notes about psychological readiness and social support.';
COMMENT ON COLUMN perioperative_optimization.plan_anaemia IS
    'Optimization plan for the anaemia domain.';
COMMENT ON COLUMN perioperative_optimization.referral_anaemia IS
    'Whether an onward referral was made for the anaemia domain, such as to haematology or an iron-infusion service.';
COMMENT ON COLUMN perioperative_optimization.plan_glycaemic_control IS
    'Optimization plan for the glycaemic-control domain.';
COMMENT ON COLUMN perioperative_optimization.referral_glycaemic_control IS
    'Whether an onward referral was made for the glycaemic-control domain, such as to the diabetes team.';
COMMENT ON COLUMN perioperative_optimization.plan_smoking IS
    'Optimization plan for the smoking domain.';
COMMENT ON COLUMN perioperative_optimization.referral_smoking IS
    'Whether an onward referral was made for the smoking domain, such as to a stop-smoking service.';
COMMENT ON COLUMN perioperative_optimization.plan_alcohol IS
    'Optimization plan for the alcohol domain.';
COMMENT ON COLUMN perioperative_optimization.referral_alcohol IS
    'Whether an onward referral was made for the alcohol domain, such as to alcohol services.';
COMMENT ON COLUMN perioperative_optimization.plan_nutrition IS
    'Optimization plan for the nutrition domain.';
COMMENT ON COLUMN perioperative_optimization.referral_nutrition IS
    'Whether an onward referral was made for the nutrition domain, such as to a dietitian.';
COMMENT ON COLUMN perioperative_optimization.plan_physical_fitness IS
    'Optimization plan for the physical-fitness domain.';
COMMENT ON COLUMN perioperative_optimization.referral_physical_fitness IS
    'Whether an onward referral was made for the physical-fitness domain, such as to a prehabilitation programme.';
COMMENT ON COLUMN perioperative_optimization.plan_medication IS
    'Optimization plan for the medication domain, i.e. the agreed hold-and-restart arrangements.';
COMMENT ON COLUMN perioperative_optimization.referral_medication IS
    'Whether an onward referral was made for the medication domain, such as to a pharmacist or the prescribing specialty.';
COMMENT ON COLUMN perioperative_optimization.plan_cardiorespiratory IS
    'Optimization plan for the cardiorespiratory domain.';
COMMENT ON COLUMN perioperative_optimization.referral_cardiorespiratory IS
    'Whether an onward referral was made for the cardiorespiratory domain, such as to cardiology, respiratory medicine, or a sleep service.';
COMMENT ON COLUMN perioperative_optimization.responsible_clinician IS
    'Clinician responsible for delivering and reviewing the optimization plan.';
COMMENT ON COLUMN perioperative_optimization.plan_agreed_with_patient IS
    'Whether the patient agreed to the optimization plan.';
COMMENT ON COLUMN perioperative_optimization.plan_shared_with_patient IS
    'Whether a copy of the plan was given to the patient.';
COMMENT ON COLUMN perioperative_optimization.next_review_date IS
    'Date of the next planned optimization review.';
COMMENT ON COLUMN perioperative_optimization.plan_notes IS
    'Free-text notes about the optimization plan as a whole.';
COMMENT ON COLUMN perioperative_optimization.gate_decision IS
    'The explicit human decision recorded at sign-off. A computed defer-surgery band never decides on its own: a clinician must choose to proceed, proceed with prehabilitation, defer and optimize, accept the unoptimized risk, refer to MDT, or cancel.';
COMMENT ON COLUMN perioperative_optimization.additional_notes IS
    'Any additional notes the clinician records.';
