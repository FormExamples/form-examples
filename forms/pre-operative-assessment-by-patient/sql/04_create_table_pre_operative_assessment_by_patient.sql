CREATE TABLE pre_operative_assessment_by_patient (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    weight NUMERIC(5,1) CHECK (weight IS NULL OR weight > 0),
    height NUMERIC(5,1) CHECK (height IS NULL OR height > 0),
    bmi NUMERIC(4,1) CHECK (bmi IS NULL OR (bmi >= 10 AND bmi <= 100)),
    planned_procedure TEXT NOT NULL DEFAULT '',
    procedure_urgency TEXT NOT NULL DEFAULT '' CHECK (procedure_urgency IN ('elective', 'urgent', 'emergency', '')),
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'reviewed')),
    hypertension TEXT NOT NULL DEFAULT '' CHECK (hypertension IN ('yes', 'no', '')),
    hypertension_controlled TEXT NOT NULL DEFAULT '' CHECK (hypertension_controlled IN ('yes', 'no', '')),
    ischemic_heart_disease TEXT NOT NULL DEFAULT '' CHECK (ischemic_heart_disease IN ('yes', 'no', '')),
    ihd_details TEXT NOT NULL DEFAULT '',
    heart_failure TEXT NOT NULL DEFAULT '' CHECK (heart_failure IN ('yes', 'no', '')),
    heart_failure_nyha TEXT NOT NULL DEFAULT '' CHECK (heart_failure_nyha IN ('1', '2', '3', '4', '')),
    valvular_disease TEXT NOT NULL DEFAULT '' CHECK (valvular_disease IN ('yes', 'no', '')),
    valvular_details TEXT NOT NULL DEFAULT '',
    arrhythmia TEXT NOT NULL DEFAULT '' CHECK (arrhythmia IN ('yes', 'no', '')),
    arrhythmia_type TEXT NOT NULL DEFAULT '',
    pacemaker TEXT NOT NULL DEFAULT '' CHECK (pacemaker IN ('yes', 'no', '')),
    recent_mi TEXT NOT NULL DEFAULT '' CHECK (recent_mi IN ('yes', 'no', '')),
    recent_mi_weeks INTEGER CHECK (recent_mi_weeks IS NULL OR recent_mi_weeks >= 0),
    asthma TEXT NOT NULL DEFAULT '' CHECK (asthma IN ('yes', 'no', '')),
    asthma_frequency TEXT NOT NULL DEFAULT '' CHECK (asthma_frequency IN ( 'intermittent', 'mild-persistent', 'moderate-persistent', 'severe-persistent', '' )),
    copd TEXT NOT NULL DEFAULT '' CHECK (copd IN ('yes', 'no', '')),
    copd_severity TEXT NOT NULL DEFAULT '' CHECK (copd_severity IN ('mild', 'moderate', 'severe', '')),
    osa TEXT NOT NULL DEFAULT '' CHECK (osa IN ('yes', 'no', '')),
    osa_cpap TEXT NOT NULL DEFAULT '' CHECK (osa_cpap IN ('yes', 'no', '')),
    smoking TEXT NOT NULL DEFAULT '' CHECK (smoking IN ('current', 'ex', 'never', '')),
    smoking_pack_years INTEGER CHECK (smoking_pack_years IS NULL OR smoking_pack_years >= 0),
    recent_urti TEXT NOT NULL DEFAULT '' CHECK (recent_urti IN ('yes', 'no', '')),
    ckd TEXT NOT NULL DEFAULT '' CHECK (ckd IN ('yes', 'no', '')),
    ckd_stage TEXT NOT NULL DEFAULT '' CHECK (ckd_stage IN ('1', '2', '3', '4', '5', '')),
    dialysis TEXT NOT NULL DEFAULT '' CHECK (dialysis IN ('yes', 'no', '')),
    dialysis_type TEXT NOT NULL DEFAULT '' CHECK (dialysis_type IN ('haemodialysis', 'peritoneal', '')),
    liver_disease TEXT NOT NULL DEFAULT '' CHECK (liver_disease IN ('yes', 'no', '')),
    cirrhosis TEXT NOT NULL DEFAULT '' CHECK (cirrhosis IN ('yes', 'no', '')),
    child_pugh_score TEXT NOT NULL DEFAULT '' CHECK (child_pugh_score IN ('A', 'B', 'C', '')),
    hepatitis TEXT NOT NULL DEFAULT '' CHECK (hepatitis IN ('yes', 'no', '')),
    hepatitis_type TEXT NOT NULL DEFAULT '',
    diabetes TEXT NOT NULL DEFAULT '' CHECK (diabetes IN ('type1', 'type2', 'gestational', 'none', '')),
    diabetes_control TEXT NOT NULL DEFAULT '' CHECK (diabetes_control IN ('well-controlled', 'poorly-controlled', '')),
    diabetes_on_insulin TEXT NOT NULL DEFAULT '' CHECK (diabetes_on_insulin IN ('yes', 'no', '')),
    thyroid_disease TEXT NOT NULL DEFAULT '' CHECK (thyroid_disease IN ('yes', 'no', '')),
    thyroid_type TEXT NOT NULL DEFAULT '' CHECK (thyroid_type IN ('hypothyroid', 'hyperthyroid', '')),
    adrenal_insufficiency TEXT NOT NULL DEFAULT '' CHECK (adrenal_insufficiency IN ('yes', 'no', '')),
    stroke_or_tia TEXT NOT NULL DEFAULT '' CHECK (stroke_or_tia IN ('yes', 'no', '')),
    stroke_details TEXT NOT NULL DEFAULT '',
    epilepsy TEXT NOT NULL DEFAULT '' CHECK (epilepsy IN ('yes', 'no', '')),
    epilepsy_controlled TEXT NOT NULL DEFAULT '' CHECK (epilepsy_controlled IN ('yes', 'no', '')),
    neuromuscular_disease TEXT NOT NULL DEFAULT '' CHECK (neuromuscular_disease IN ('yes', 'no', '')),
    neuromuscular_details TEXT NOT NULL DEFAULT '',
    raised_icp TEXT NOT NULL DEFAULT '' CHECK (raised_icp IN ('yes', 'no', '')),
    bleeding_disorder TEXT NOT NULL DEFAULT '' CHECK (bleeding_disorder IN ('yes', 'no', '')),
    bleeding_details TEXT NOT NULL DEFAULT '',
    on_anticoagulants TEXT NOT NULL DEFAULT '' CHECK (on_anticoagulants IN ('yes', 'no', '')),
    anticoagulant_type TEXT NOT NULL DEFAULT '',
    sickle_cell_disease TEXT NOT NULL DEFAULT '' CHECK (sickle_cell_disease IN ('yes', 'no', '')),
    sickle_cell_trait TEXT NOT NULL DEFAULT '' CHECK (sickle_cell_trait IN ('yes', 'no', '')),
    anaemia TEXT NOT NULL DEFAULT '' CHECK (anaemia IN ('yes', 'no', '')),
    rheumatoid_arthritis TEXT NOT NULL DEFAULT '' CHECK (rheumatoid_arthritis IN ('yes', 'no', '')),
    cervical_spine_issues TEXT NOT NULL DEFAULT '' CHECK (cervical_spine_issues IN ('yes', 'no', '')),
    limited_neck_movement TEXT NOT NULL DEFAULT '' CHECK (limited_neck_movement IN ('yes', 'no', '')),
    limited_mouth_opening TEXT NOT NULL DEFAULT '' CHECK (limited_mouth_opening IN ('yes', 'no', '')),
    dental_issues TEXT NOT NULL DEFAULT '' CHECK (dental_issues IN ('yes', 'no', '')),
    dental_details TEXT NOT NULL DEFAULT '',
    previous_difficult_airway TEXT NOT NULL DEFAULT '' CHECK (previous_difficult_airway IN ('yes', 'no', '')),
    mallampati_score TEXT NOT NULL DEFAULT '' CHECK (mallampati_score IN ('1', '2', '3', '4', '')),
    gord TEXT NOT NULL DEFAULT '' CHECK (gord IN ('yes', 'no', '')),
    hiatus_hernia TEXT NOT NULL DEFAULT '' CHECK (hiatus_hernia IN ('yes', 'no', '')),
    nausea TEXT NOT NULL DEFAULT '' CHECK (nausea IN ('yes', 'no', '')),
    name TEXT NOT NULL DEFAULT '',
    dose TEXT NOT NULL DEFAULT '',
    frequency TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    allergen TEXT NOT NULL DEFAULT '',
    reaction TEXT NOT NULL DEFAULT '',
    severity TEXT NOT NULL DEFAULT '' CHECK (severity IN ('mild', 'moderate', 'anaphylaxis', '')),
    allergy_sort_order INTEGER NOT NULL DEFAULT 0,
    previous_anaesthesia TEXT NOT NULL DEFAULT '' CHECK (previous_anaesthesia IN ('yes', 'no', '')),
    anaesthesia_problems TEXT NOT NULL DEFAULT '' CHECK (anaesthesia_problems IN ('yes', 'no', '')),
    anaesthesia_problem_details TEXT NOT NULL DEFAULT '',
    family_mh_history TEXT NOT NULL DEFAULT '' CHECK (family_mh_history IN ('yes', 'no', '')),
    family_mh_details TEXT NOT NULL DEFAULT '',
    ponv TEXT NOT NULL DEFAULT '' CHECK (ponv IN ('yes', 'no', '')),
    alcohol TEXT NOT NULL DEFAULT '' CHECK (alcohol IN ('none', 'occasional', 'moderate', 'heavy', '')),
    alcohol_units_per_week INTEGER CHECK (alcohol_units_per_week IS NULL OR alcohol_units_per_week >= 0),
    recreational_drugs TEXT NOT NULL DEFAULT '' CHECK (recreational_drugs IN ('yes', 'no', '')),
    drug_details TEXT NOT NULL DEFAULT '',
    exercise_tolerance TEXT NOT NULL DEFAULT '' CHECK (exercise_tolerance IN ( 'unable', 'light-housework', 'climb-stairs', 'moderate-exercise', 'vigorous-exercise', '' )),
    estimated_mets NUMERIC(3,1) CHECK (estimated_mets IS NULL OR estimated_mets >= 0),
    mobility_aids TEXT NOT NULL DEFAULT '' CHECK (mobility_aids IN ('yes', 'no', '')),
    recent_decline TEXT NOT NULL DEFAULT '' CHECK (recent_decline IN ('yes', 'no', '')),
    possibly_pregnant TEXT NOT NULL DEFAULT '' CHECK (possibly_pregnant IN ('yes', 'no', '')),
    pregnancy_confirmed TEXT NOT NULL DEFAULT '' CHECK (pregnancy_confirmed IN ('yes', 'no', '')),
    gestation_weeks INTEGER CHECK (gestation_weeks IS NULL OR (gestation_weeks >= 0 AND gestation_weeks <= 45)),
    cancer_history TEXT NOT NULL DEFAULT '' CHECK (cancer_history IN ('yes', 'no', '')),
    cancer_history_details TEXT NOT NULL DEFAULT '',
    mrsa_history TEXT NOT NULL DEFAULT '' CHECK (mrsa_history IN ('yes', 'no', '')),
    recent_hospital_or_care_home_admission TEXT NOT NULL DEFAULT '' CHECK (recent_hospital_or_care_home_admission IN ('yes', 'no', '')),
    palpitations_or_blackouts TEXT NOT NULL DEFAULT '' CHECK (palpitations_or_blackouts IN ('yes', 'no', '')),
    heart_or_artery_surgery TEXT NOT NULL DEFAULT '' CHECK (heart_or_artery_surgery IN ('yes', 'no', '')),
    swollen_ankles TEXT NOT NULL DEFAULT '' CHECK (swollen_ankles IN ('yes', 'no', '')),
    snoring TEXT NOT NULL DEFAULT '' CHECK (snoring IN ('yes', 'no', '')),
    snoring_loud TEXT NOT NULL DEFAULT '' CHECK (snoring_loud IN ('yes', 'no', '')),
    collar_size_inches NUMERIC(4,1) CHECK (collar_size_inches IS NULL OR collar_size_inches > 0),
    daytime_sleepiness TEXT NOT NULL DEFAULT '' CHECK (daytime_sleepiness IN ('yes', 'no', '')),
    observed_apnoea_episodes TEXT NOT NULL DEFAULT '' CHECK (observed_apnoea_episodes IN ('yes', 'no', '')),
    urinary_symptoms TEXT NOT NULL DEFAULT '' CHECK (urinary_symptoms IN ('yes', 'no', '')),
    urinary_catheter_history TEXT NOT NULL DEFAULT '' CHECK (urinary_catheter_history IN ('yes', 'no', '')),
    prostate_problems TEXT NOT NULL DEFAULT '' CHECK (prostate_problems IN ('yes', 'no', '')),
    personal_vte_history TEXT NOT NULL DEFAULT '' CHECK (personal_vte_history IN ('yes', 'no', '')),
    family_vte_history TEXT NOT NULL DEFAULT '' CHECK (family_vte_history IN ('yes', 'no', '')),
    blood_transfusion_history TEXT NOT NULL DEFAULT '' CHECK (blood_transfusion_history IN ('yes', 'no', '')),
    joint_or_arthritis_problems TEXT NOT NULL DEFAULT '' CHECK (joint_or_arthritis_problems IN ('yes', 'no', '')),
    back_or_neck_problems TEXT NOT NULL DEFAULT '' CHECK (back_or_neck_problems IN ('yes', 'no', '')),
    skin_conditions TEXT NOT NULL DEFAULT '' CHECK (skin_conditions IN ('yes', 'no', '')),
    pressure_sore_risk TEXT NOT NULL DEFAULT '' CHECK (pressure_sore_risk IN ('yes', 'no', '')),
    bowel_problems TEXT NOT NULL DEFAULT '' CHECK (bowel_problems IN ('yes', 'no', '')),
    food_intolerances TEXT NOT NULL DEFAULT '' CHECK (food_intolerances IN ('yes', 'no', '')),
    food_intolerances_details TEXT NOT NULL DEFAULT '',
    blood_donor TEXT NOT NULL DEFAULT '' CHECK (blood_donor IN ('yes', 'no', '')),
    body_piercings TEXT NOT NULL DEFAULT '' CHECK (body_piercings IN ('yes', 'no', '')),
    hearing_problems TEXT NOT NULL DEFAULT '' CHECK (hearing_problems IN ('yes', 'no', '')),
    vision_problems TEXT NOT NULL DEFAULT '' CHECK (vision_problems IN ('yes', 'no', '')),
    balance_issues TEXT NOT NULL DEFAULT '' CHECK (balance_issues IN ('yes', 'no', '')),
    contraceptive_or_hrt_use TEXT NOT NULL DEFAULT '' CHECK (contraceptive_or_hrt_use IN ('yes', 'no', '')),
    last_menstrual_period TEXT NOT NULL DEFAULT '',
    head_injury_requiring_hospitalisation TEXT NOT NULL DEFAULT '' CHECK (head_injury_requiring_hospitalisation IN ('yes', 'no', '')),
    memory_concerns TEXT NOT NULL DEFAULT '' CHECK (memory_concerns IN ('yes', 'no', '')),
    dementia_diagnosis TEXT NOT NULL DEFAULT '' CHECK (dementia_diagnosis IN ('yes', 'no', '')),
    depression_or_anxiety_history TEXT NOT NULL DEFAULT '' CHECK (depression_or_anxiety_history IN ('yes', 'no', '')),
    depression_anxiety_impacts_daily_life TEXT NOT NULL DEFAULT '' CHECK (depression_anxiety_impacts_daily_life IN ('yes', 'no', '')),
    depression_anxiety_seen_doctor TEXT NOT NULL DEFAULT '' CHECK (depression_anxiety_seen_doctor IN ('yes', 'no', '')),
    learning_difficulties TEXT NOT NULL DEFAULT '' CHECK (learning_difficulties IN ('yes', 'no', ''))
);

CREATE TRIGGER trigger_assessment_updated_at
    BEFORE UPDATE ON pre_operative_assessment_by_patient
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE pre_operative_assessment_by_patient IS
    'Flat assessment table: parent assessment merged with every assessment_<section> child. Generated by bin/generate-sql-flat.py.';

-- Renamed columns (section prefix applied on conflict):
--   assessment_allergy.sort_order -> assessment.allergy_sort_order


-- ========================================================================
-- 19-asa-rule.sql
-- ========================================================================

-- ============================================================
-- 19_asa_rule.sql
-- Reference table: ASA grading rules + seed data.
-- ============================================================
-- Contains all 42 declarative ASA rules from asa-rules.ts.
-- Each rule maps a clinical condition to an ASA grade.
-- The evaluate logic lives in the application layer; this
-- table preserves the rule catalogue for audit and reporting.
-- ============================================================

COMMENT ON TABLE pre_operative_assessment_by_patient IS
    'Pre operative assessment by patient.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.patient_id IS
    'Foreign key to the patient table.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.weight IS
    'Weight.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.height IS
    'Height.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.bmi IS
    'BMI.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.planned_procedure IS
    'Planned procedure.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.procedure_urgency IS
    'Procedure urgency. One of: elective, urgent, emergency.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.status IS
    'Lifecycle status of this row.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.hypertension IS
    'Hypertension. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.hypertension_controlled IS
    'Hypertension controlled. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.ischemic_heart_disease IS
    'Ischemic heart disease. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.ihd_details IS
    'IHD details.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.heart_failure IS
    'Heart failure. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.heart_failure_nyha IS
    'Heart failure nyha. One of: 1, 2, 3, 4.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.valvular_disease IS
    'Valvular disease. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.valvular_details IS
    'Valvular details.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.arrhythmia IS
    'Arrhythmia. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.arrhythmia_type IS
    'Arrhythmia type.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.pacemaker IS
    'Pacemaker. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.recent_mi IS
    'Recent MI. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.recent_mi_weeks IS
    'Recent MI weeks.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.asthma IS
    'Asthma. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.asthma_frequency IS
    'Asthma frequency. One of: intermittent, mild-persistent, moderate-persistent, severe-persistent.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.copd IS
    'COPD. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.copd_severity IS
    'COPD severity. One of: mild, moderate, severe.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.osa IS
    'Osa. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.osa_cpap IS
    'Osa cpap. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.smoking IS
    'Smoking. One of: current, ex, never.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.smoking_pack_years IS
    'Smoking pack years.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.recent_urti IS
    'Recent urti. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.ckd IS
    'CKD. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.ckd_stage IS
    'CKD stage. One of: 1, 2, 3, 4, 5.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.dialysis IS
    'Dialysis. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.dialysis_type IS
    'Dialysis type. One of: haemodialysis, peritoneal.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.liver_disease IS
    'Liver disease. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.cirrhosis IS
    'Cirrhosis. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.child_pugh_score IS
    'Child pugh score. One of: A, B, C.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.hepatitis IS
    'Hepatitis. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.hepatitis_type IS
    'Hepatitis type.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.diabetes IS
    'Diabetes. One of: type1, type2, gestational, none.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.diabetes_control IS
    'Diabetes control. One of: well-controlled, poorly-controlled.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.diabetes_on_insulin IS
    'Diabetes on insulin. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.thyroid_disease IS
    'Thyroid disease. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.thyroid_type IS
    'Thyroid type. One of: hypothyroid, hyperthyroid.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.adrenal_insufficiency IS
    'Adrenal insufficiency. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.stroke_or_tia IS
    'Stroke or TIA. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.stroke_details IS
    'Stroke details.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.epilepsy IS
    'Epilepsy. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.epilepsy_controlled IS
    'Epilepsy controlled. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.neuromuscular_disease IS
    'Neuromuscular disease. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.neuromuscular_details IS
    'Neuromuscular details.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.raised_icp IS
    'Raised icp. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.bleeding_disorder IS
    'Bleeding disorder. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.bleeding_details IS
    'Bleeding details.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.on_anticoagulants IS
    'On anticoagulants. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.anticoagulant_type IS
    'Anticoagulant type.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.sickle_cell_disease IS
    'Sickle cell disease. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.sickle_cell_trait IS
    'Sickle cell trait. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.anaemia IS
    'Anaemia. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.rheumatoid_arthritis IS
    'Rheumatoid arthritis. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.cervical_spine_issues IS
    'Cervical spine issues. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.limited_neck_movement IS
    'Limited neck movement. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.limited_mouth_opening IS
    'Limited mouth opening. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.dental_issues IS
    'Dental issues. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.dental_details IS
    'Dental details.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.previous_difficult_airway IS
    'Previous difficult airway. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.mallampati_score IS
    'Mallampati score. One of: 1, 2, 3, 4.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.gord IS
    'Gord. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.hiatus_hernia IS
    'Hiatus hernia. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.nausea IS
    'Nausea. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.name IS
    'Name.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.dose IS
    'Dose.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.frequency IS
    'Frequency.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.sort_order IS
    'Sort order.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.allergen IS
    'Allergen.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.reaction IS
    'Reaction.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.severity IS
    'Severity. One of: mild, moderate, anaphylaxis.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.allergy_sort_order IS
    'Allergy sort order.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.previous_anaesthesia IS
    'Previous anaesthesia. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.anaesthesia_problems IS
    'Anaesthesia problems. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.anaesthesia_problem_details IS
    'Anaesthesia problem details.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.family_mh_history IS
    'Family mh history. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.family_mh_details IS
    'Family mh details.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.ponv IS
    'Ponv. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.alcohol IS
    'Alcohol. One of: none, occasional, moderate, heavy.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.alcohol_units_per_week IS
    'Alcohol units per week.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.recreational_drugs IS
    'Recreational drugs. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.drug_details IS
    'Drug details.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.exercise_tolerance IS
    'Exercise tolerance. One of: unable, light-housework, climb-stairs, moderate-exercise, vigorous-exercise.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.estimated_mets IS
    'Estimated METS.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.mobility_aids IS
    'Mobility aids. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.recent_decline IS
    'Recent decline. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.possibly_pregnant IS
    'Possibly pregnant. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.pregnancy_confirmed IS
    'Pregnancy confirmed. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.gestation_weeks IS
    'Gestation weeks.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.deleted_at IS
    'Timestamp when this row was deleted.';

COMMENT ON COLUMN pre_operative_assessment_by_patient.cancer_history IS
    'Cancer history. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.cancer_history_details IS
    'Cancer history details.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.mrsa_history IS
    'MRSA history. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.recent_hospital_or_care_home_admission IS
    'Recent hospital or care home admission. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.palpitations_or_blackouts IS
    'Palpitations or blackouts. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.heart_or_artery_surgery IS
    'Heart or artery surgery. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.swollen_ankles IS
    'Swollen ankles. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.snoring IS
    'Snoring. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.snoring_loud IS
    'Loud snoring. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.collar_size_inches IS
    'Collar size in inches.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.daytime_sleepiness IS
    'Daytime sleepiness. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.observed_apnoea_episodes IS
    'Observed apnoea episodes. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.urinary_symptoms IS
    'Urinary symptoms. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.urinary_catheter_history IS
    'Urinary catheter history. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.prostate_problems IS
    'Prostate problems. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.personal_vte_history IS
    'Personal VTE (venous thromboembolism) history. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.family_vte_history IS
    'Family VTE (venous thromboembolism) history. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.blood_transfusion_history IS
    'Blood transfusion history. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.joint_or_arthritis_problems IS
    'Joint or arthritis problems. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.back_or_neck_problems IS
    'Back or neck problems. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.skin_conditions IS
    'Skin conditions. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.pressure_sore_risk IS
    'Pressure sore risk. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.bowel_problems IS
    'Bowel problems. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.food_intolerances IS
    'Food intolerances. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.food_intolerances_details IS
    'Food intolerances details.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.blood_donor IS
    'Blood donor. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.body_piercings IS
    'Body piercings. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.hearing_problems IS
    'Hearing problems. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.vision_problems IS
    'Vision problems. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.balance_issues IS
    'Balance issues. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.contraceptive_or_hrt_use IS
    'Contraceptive or HRT use. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.last_menstrual_period IS
    'Last menstrual period.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.head_injury_requiring_hospitalisation IS
    'Head injury requiring hospitalisation. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.memory_concerns IS
    'Memory concerns. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.dementia_diagnosis IS
    'Dementia diagnosis. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.depression_or_anxiety_history IS
    'Depression or anxiety history. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.depression_anxiety_impacts_daily_life IS
    'Depression/anxiety impacts daily life. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.depression_anxiety_seen_doctor IS
    'Depression/anxiety seen by a doctor. One of: yes, no.';
COMMENT ON COLUMN pre_operative_assessment_by_patient.learning_difficulties IS
    'Learning difficulties. One of: yes, no.';
