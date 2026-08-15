-- Health screening questionnaire: the payload of the 14-step single-page
-- wizard.
--
-- Column groups follow the wizard steps in order. Unanswered text and enum
-- columns default to the empty string; unanswered numeric, date, and time
-- columns are NULL. See ../index.md for the wizard table and ../spec/index.md
-- for the contract.

CREATE TABLE health_screening_questionnaire (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    assessor_id UUID NOT NULL REFERENCES assessor(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'reviewed', 'urgent')),

    -- Step 1: assessment context
    screening_purpose VARCHAR(30) NOT NULL DEFAULT '' CHECK (screening_purpose IN ('occupational-pre-placement', 'routine-public-health', 'perioperative-referral', 'physical-activity-readiness', 'other', '')),
    site_name VARCHAR(255) NOT NULL DEFAULT '',
    assessment_date DATE,
    assessment_mode VARCHAR(15) NOT NULL DEFAULT '' CHECK (assessment_mode IN ('in-person', 'telephone', 'online', '')),

    -- Step 3: lifestyle -- activity and diet
    usual_activity_level VARCHAR(20) NOT NULL DEFAULT '' CHECK (usual_activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very-active', '')),
    moderate_exercise_days_per_week INTEGER CHECK (moderate_exercise_days_per_week IS NULL OR moderate_exercise_days_per_week BETWEEN 0 AND 7),
    fruit_and_vegetable_portions_per_day INTEGER CHECK (fruit_and_vegetable_portions_per_day IS NULL OR fruit_and_vegetable_portions_per_day BETWEEN 0 AND 20),
    diet_notes TEXT NOT NULL DEFAULT '',

    -- Step 4: lifestyle -- smoking and alcohol
    smoking_status VARCHAR(20) NOT NULL DEFAULT '' CHECK (smoking_status IN ('never', 'ex-smoker', 'current-smoker', 'vapes-only', '')),
    cigarettes_per_day INTEGER CHECK (cigarettes_per_day IS NULL OR cigarettes_per_day BETWEEN 0 AND 200),
    audit_c_frequency INTEGER CHECK (audit_c_frequency IS NULL OR audit_c_frequency BETWEEN 0 AND 4),
    audit_c_typical_quantity INTEGER CHECK (audit_c_typical_quantity IS NULL OR audit_c_typical_quantity BETWEEN 0 AND 4),
    audit_c_binge_frequency INTEGER CHECK (audit_c_binge_frequency IS NULL OR audit_c_binge_frequency BETWEEN 0 AND 4),

    -- Step 5: medical history
    condition_diabetes VARCHAR(5) NOT NULL DEFAULT '' CHECK (condition_diabetes IN ('yes', 'no', '')),
    condition_hypertension VARCHAR(5) NOT NULL DEFAULT '' CHECK (condition_hypertension IN ('yes', 'no', '')),
    condition_asthma VARCHAR(5) NOT NULL DEFAULT '' CHECK (condition_asthma IN ('yes', 'no', '')),
    condition_copd VARCHAR(5) NOT NULL DEFAULT '' CHECK (condition_copd IN ('yes', 'no', '')),
    condition_heart_disease VARCHAR(5) NOT NULL DEFAULT '' CHECK (condition_heart_disease IN ('yes', 'no', '')),
    condition_kidney_disease VARCHAR(5) NOT NULL DEFAULT '' CHECK (condition_kidney_disease IN ('yes', 'no', '')),
    condition_thyroid VARCHAR(5) NOT NULL DEFAULT '' CHECK (condition_thyroid IN ('yes', 'no', '')),
    condition_other VARCHAR(500) NOT NULL DEFAULT '',
    past_surgeries TEXT NOT NULL DEFAULT '',
    current_medications TEXT NOT NULL DEFAULT '',
    known_drug_allergies TEXT NOT NULL DEFAULT '',

    -- Step 6: family history
    family_history_premature_cardiac_event VARCHAR(5) NOT NULL DEFAULT '' CHECK (family_history_premature_cardiac_event IN ('yes', 'no', '')),
    family_history_other TEXT NOT NULL DEFAULT '',

    -- Step 7: symptom review
    symptom_unexplained_chest_pain VARCHAR(5) NOT NULL DEFAULT '' CHECK (symptom_unexplained_chest_pain IN ('yes', 'no', '')),
    symptom_dizzy_spells_or_fainting VARCHAR(5) NOT NULL DEFAULT '' CHECK (symptom_dizzy_spells_or_fainting IN ('yes', 'no', '')),
    symptom_persistent_cough_over_3_weeks VARCHAR(5) NOT NULL DEFAULT '' CHECK (symptom_persistent_cough_over_3_weeks IN ('yes', 'no', '')),
    symptom_unexplained_weight_loss VARCHAR(5) NOT NULL DEFAULT '' CHECK (symptom_unexplained_weight_loss IN ('yes', 'no', '')),
    symptom_joint_pain_restricting_movement VARCHAR(5) NOT NULL DEFAULT '' CHECK (symptom_joint_pain_restricting_movement IN ('yes', 'no', '')),
    symptom_shortness_of_breath_on_exertion VARCHAR(5) NOT NULL DEFAULT '' CHECK (symptom_shortness_of_breath_on_exertion IN ('yes', 'no', '')),
    symptom_palpitations VARCHAR(5) NOT NULL DEFAULT '' CHECK (symptom_palpitations IN ('yes', 'no', '')),

    -- Step 8: PAR-Q+ general health screen (7 items)
    parq_diagnosed_heart_condition VARCHAR(5) NOT NULL DEFAULT '' CHECK (parq_diagnosed_heart_condition IN ('yes', 'no', '')),
    parq_chest_pain_at_rest VARCHAR(5) NOT NULL DEFAULT '' CHECK (parq_chest_pain_at_rest IN ('yes', 'no', '')),
    parq_chest_pain_during_activity VARCHAR(5) NOT NULL DEFAULT '' CHECK (parq_chest_pain_during_activity IN ('yes', 'no', '')),
    parq_dizziness_or_loss_of_consciousness VARCHAR(5) NOT NULL DEFAULT '' CHECK (parq_dizziness_or_loss_of_consciousness IN ('yes', 'no', '')),
    parq_other_chronic_medical_condition VARCHAR(5) NOT NULL DEFAULT '' CHECK (parq_other_chronic_medical_condition IN ('yes', 'no', '')),
    parq_prescribed_medication_for_chronic_condition VARCHAR(5) NOT NULL DEFAULT '' CHECK (parq_prescribed_medication_for_chronic_condition IN ('yes', 'no', '')),
    parq_bone_or_joint_problem VARCHAR(5) NOT NULL DEFAULT '' CHECK (parq_bone_or_joint_problem IN ('yes', 'no', '')),

    -- Step 9: vital signs / basic measurements (all optional)
    height_as_cm NUMERIC(5,1),
    weight_as_kg NUMERIC(5,1),
    body_mass_index NUMERIC(4,1),
    resting_blood_pressure_systolic INTEGER CHECK (resting_blood_pressure_systolic IS NULL OR resting_blood_pressure_systolic BETWEEN 40 AND 300),
    resting_blood_pressure_diastolic INTEGER CHECK (resting_blood_pressure_diastolic IS NULL OR resting_blood_pressure_diastolic BETWEEN 20 AND 200),
    resting_heart_rate INTEGER CHECK (resting_heart_rate IS NULL OR resting_heart_rate BETWEEN 20 AND 250),

    -- Step 10: occupational / role-specific factors (shown only when
    -- screening_purpose = 'occupational-pre-placement')
    job_role VARCHAR(255) NOT NULL DEFAULT '',
    physical_demands_of_role VARCHAR(15) NOT NULL DEFAULT '' CHECK (physical_demands_of_role IN ('sedentary', 'light', 'moderate', 'heavy', '')),
    exposure_noise VARCHAR(5) NOT NULL DEFAULT '' CHECK (exposure_noise IN ('yes', 'no', '')),
    exposure_chemicals VARCHAR(5) NOT NULL DEFAULT '' CHECK (exposure_chemicals IN ('yes', 'no', '')),
    exposure_manual_handling VARCHAR(5) NOT NULL DEFAULT '' CHECK (exposure_manual_handling IN ('yes', 'no', '')),
    exposure_other VARCHAR(5) NOT NULL DEFAULT '' CHECK (exposure_other IN ('yes', 'no', '')),
    exposure_other_detail VARCHAR(500) NOT NULL DEFAULT '',

    -- Step 11: mental health and wellbeing check
    stress_level INTEGER CHECK (stress_level IS NULL OR stress_level BETWEEN 0 AND 4),
    sleep_quality INTEGER CHECK (sleep_quality IS NULL OR sleep_quality BETWEEN 0 AND 4),
    mental_health_concern VARCHAR(5) NOT NULL DEFAULT '' CHECK (mental_health_concern IN ('yes', 'no', '')),
    mental_health_concern_note TEXT NOT NULL DEFAULT '',

    -- Step 12: vaccination status
    vaccination_up_to_date VARCHAR(10) NOT NULL DEFAULT '' CHECK (vaccination_up_to_date IN ('yes', 'no', 'unsure', '')),
    vaccination_gaps_note TEXT NOT NULL DEFAULT '',

    -- Step 13: consent and data
    consent_to_screening VARCHAR(5) NOT NULL DEFAULT '' CHECK (consent_to_screening IN ('yes', 'no', '')),
    information_accurate_confirmed VARCHAR(5) NOT NULL DEFAULT '' CHECK (information_accurate_confirmed IN ('yes', 'no', '')),
    interpreter_required VARCHAR(5) NOT NULL DEFAULT '' CHECK (interpreter_required IN ('yes', 'no', ''))
);

CREATE TRIGGER trigger_health_screening_questionnaire_updated_at
    BEFORE UPDATE ON health_screening_questionnaire
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE health_screening_questionnaire IS
    'Health screening questionnaire, i.e. the payload of the 14-step single-page wizard: assessment context, personal details, lifestyle, medical and family history, symptom review, PAR-Q+ screen, optional vital signs, occupational factors, wellbeing check, vaccination status, and consent.';
COMMENT ON COLUMN health_screening_questionnaire.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN health_screening_questionnaire.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN health_screening_questionnaire.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN health_screening_questionnaire.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN health_screening_questionnaire.patient_id IS
    'Foreign key to the patient table, i.e. the person being screened.';
COMMENT ON COLUMN health_screening_questionnaire.assessor_id IS
    'Foreign key to the assessor table, i.e. the person conducting the screen.';
COMMENT ON COLUMN health_screening_questionnaire.status IS
    'Questionnaire lifecycle status: draft, submitted, reviewed, or urgent.';
COMMENT ON COLUMN health_screening_questionnaire.screening_purpose IS
    'Step 1: purpose of the screen, which determines whether step 10 (occupational factors) is shown.';
COMMENT ON COLUMN health_screening_questionnaire.site_name IS
    'Step 1: site where the screening took place.';
COMMENT ON COLUMN health_screening_questionnaire.assessment_date IS
    'Step 1: date the screening was conducted.';
COMMENT ON COLUMN health_screening_questionnaire.assessment_mode IS
    'Step 1: mode of assessment, in-person, telephone, or online.';
COMMENT ON COLUMN health_screening_questionnaire.usual_activity_level IS
    'Step 3: usual physical activity level.';
COMMENT ON COLUMN health_screening_questionnaire.moderate_exercise_days_per_week IS
    'Step 3: number of days per week with at least moderate exercise, 0 to 7.';
COMMENT ON COLUMN health_screening_questionnaire.fruit_and_vegetable_portions_per_day IS
    'Step 3: typical fruit and vegetable portions eaten per day.';
COMMENT ON COLUMN health_screening_questionnaire.diet_notes IS
    'Step 3: free-text diet notes.';
COMMENT ON COLUMN health_screening_questionnaire.smoking_status IS
    'Step 4: smoking status.';
COMMENT ON COLUMN health_screening_questionnaire.cigarettes_per_day IS
    'Step 4: cigarettes smoked per day, where applicable.';
COMMENT ON COLUMN health_screening_questionnaire.audit_c_frequency IS
    'Step 4: AUDIT-C item 1, frequency of drinking, 0 to 4.';
COMMENT ON COLUMN health_screening_questionnaire.audit_c_typical_quantity IS
    'Step 4: AUDIT-C item 2, typical quantity per drinking day, 0 to 4.';
COMMENT ON COLUMN health_screening_questionnaire.audit_c_binge_frequency IS
    'Step 4: AUDIT-C item 3, frequency of six-or-more (binge) drinking, 0 to 4.';
COMMENT ON COLUMN health_screening_questionnaire.condition_diabetes IS
    'Step 5: diagnosed diabetes.';
COMMENT ON COLUMN health_screening_questionnaire.condition_hypertension IS
    'Step 5: diagnosed hypertension.';
COMMENT ON COLUMN health_screening_questionnaire.condition_asthma IS
    'Step 5: diagnosed asthma.';
COMMENT ON COLUMN health_screening_questionnaire.condition_copd IS
    'Step 5: diagnosed chronic obstructive pulmonary disease.';
COMMENT ON COLUMN health_screening_questionnaire.condition_heart_disease IS
    'Step 5: diagnosed heart disease.';
COMMENT ON COLUMN health_screening_questionnaire.condition_kidney_disease IS
    'Step 5: diagnosed kidney disease.';
COMMENT ON COLUMN health_screening_questionnaire.condition_thyroid IS
    'Step 5: diagnosed thyroid condition.';
COMMENT ON COLUMN health_screening_questionnaire.condition_other IS
    'Step 5: other diagnosed chronic condition, free text.';
COMMENT ON COLUMN health_screening_questionnaire.past_surgeries IS
    'Step 5: past surgeries, free text.';
COMMENT ON COLUMN health_screening_questionnaire.current_medications IS
    'Step 5: current prescription medications, free text.';
COMMENT ON COLUMN health_screening_questionnaire.known_drug_allergies IS
    'Step 5: known drug allergies, free text.';
COMMENT ON COLUMN health_screening_questionnaire.family_history_premature_cardiac_event IS
    'Step 6: premature (before age 60) heart attack or stroke in a first-degree relative.';
COMMENT ON COLUMN health_screening_questionnaire.family_history_other IS
    'Step 6: other hereditary conditions in the family, free text.';
COMMENT ON COLUMN health_screening_questionnaire.symptom_unexplained_chest_pain IS
    'Step 7: unexplained chest pain, a red-flag symptom driving the refer-urgently risk band.';
COMMENT ON COLUMN health_screening_questionnaire.symptom_dizzy_spells_or_fainting IS
    'Step 7: dizzy spells or fainting, a red-flag symptom driving the refer-urgently risk band.';
COMMENT ON COLUMN health_screening_questionnaire.symptom_persistent_cough_over_3_weeks IS
    'Step 7: persistent cough lasting more than 3 weeks.';
COMMENT ON COLUMN health_screening_questionnaire.symptom_unexplained_weight_loss IS
    'Step 7: unexplained weight loss, which alone warrants GP review regardless of other findings.';
COMMENT ON COLUMN health_screening_questionnaire.symptom_joint_pain_restricting_movement IS
    'Step 7: joint pain restricting movement.';
COMMENT ON COLUMN health_screening_questionnaire.symptom_shortness_of_breath_on_exertion IS
    'Step 7: shortness of breath on exertion.';
COMMENT ON COLUMN health_screening_questionnaire.symptom_palpitations IS
    'Step 7: palpitations.';
COMMENT ON COLUMN health_screening_questionnaire.parq_diagnosed_heart_condition IS
    'Step 8, PAR-Q+ item 1: has a doctor ever diagnosed you with a heart condition.';
COMMENT ON COLUMN health_screening_questionnaire.parq_chest_pain_at_rest IS
    'Step 8, PAR-Q+ item 2: do you feel pain in your chest at rest.';
COMMENT ON COLUMN health_screening_questionnaire.parq_chest_pain_during_activity IS
    'Step 8, PAR-Q+ item 3: do you feel pain in your chest during, or caused by, physical activity in the last month.';
COMMENT ON COLUMN health_screening_questionnaire.parq_dizziness_or_loss_of_consciousness IS
    'Step 8, PAR-Q+ item 4: do you lose balance because of dizziness, or have you lost consciousness, in the last 12 months.';
COMMENT ON COLUMN health_screening_questionnaire.parq_other_chronic_medical_condition IS
    'Step 8, PAR-Q+ item 5: have you been diagnosed with another chronic medical condition.';
COMMENT ON COLUMN health_screening_questionnaire.parq_prescribed_medication_for_chronic_condition IS
    'Step 8, PAR-Q+ item 6: are you currently taking prescribed medication for a chronic medical condition.';
COMMENT ON COLUMN health_screening_questionnaire.parq_bone_or_joint_problem IS
    'Step 8, PAR-Q+ item 7: do you have a bone, joint, or soft-tissue problem that could be made worse by becoming more physically active.';
COMMENT ON COLUMN health_screening_questionnaire.height_as_cm IS
    'Step 9: height measurement in cm, optional.';
COMMENT ON COLUMN health_screening_questionnaire.weight_as_kg IS
    'Step 9: weight measurement in kg, optional.';
COMMENT ON COLUMN health_screening_questionnaire.body_mass_index IS
    'Step 9: body mass index, auto-computed from height and weight when both are present.';
COMMENT ON COLUMN health_screening_questionnaire.resting_blood_pressure_systolic IS
    'Step 9: resting systolic blood pressure in mmHg, optional.';
COMMENT ON COLUMN health_screening_questionnaire.resting_blood_pressure_diastolic IS
    'Step 9: resting diastolic blood pressure in mmHg, optional.';
COMMENT ON COLUMN health_screening_questionnaire.resting_heart_rate IS
    'Step 9: resting heart rate in beats per minute, optional.';
COMMENT ON COLUMN health_screening_questionnaire.job_role IS
    'Step 10: job role, free text. Shown only for occupational-pre-placement screens.';
COMMENT ON COLUMN health_screening_questionnaire.physical_demands_of_role IS
    'Step 10: physical demands of the role.';
COMMENT ON COLUMN health_screening_questionnaire.exposure_noise IS
    'Step 10: occupational noise exposure risk.';
COMMENT ON COLUMN health_screening_questionnaire.exposure_chemicals IS
    'Step 10: occupational chemical exposure risk.';
COMMENT ON COLUMN health_screening_questionnaire.exposure_manual_handling IS
    'Step 10: occupational manual-handling exposure risk.';
COMMENT ON COLUMN health_screening_questionnaire.exposure_other IS
    'Step 10: another occupational exposure risk.';
COMMENT ON COLUMN health_screening_questionnaire.exposure_other_detail IS
    'Step 10: detail of the other occupational exposure risk, free text.';
COMMENT ON COLUMN health_screening_questionnaire.stress_level IS
    'Step 11: self-reported stress level, 0 (none) to 4 (severe).';
COMMENT ON COLUMN health_screening_questionnaire.sleep_quality IS
    'Step 11: self-reported sleep quality, 0 (very poor) to 4 (very good).';
COMMENT ON COLUMN health_screening_questionnaire.mental_health_concern IS
    'Step 11: any current mental-health concern. Light-touch only; this monorepo has dedicated mental-health assessment forms.';
COMMENT ON COLUMN health_screening_questionnaire.mental_health_concern_note IS
    'Step 11: optional note on the mental-health concern.';
COMMENT ON COLUMN health_screening_questionnaire.vaccination_up_to_date IS
    'Step 12: whether vaccinations are up to date.';
COMMENT ON COLUMN health_screening_questionnaire.vaccination_gaps_note IS
    'Step 12: notable vaccination gaps, free text.';
COMMENT ON COLUMN health_screening_questionnaire.consent_to_screening IS
    'Step 13: consent to the screening.';
COMMENT ON COLUMN health_screening_questionnaire.information_accurate_confirmed IS
    'Step 13: confirmation that the information given is accurate to the best of the respondent''s knowledge.';
COMMENT ON COLUMN health_screening_questionnaire.interpreter_required IS
    'Step 13: whether an interpreter was required for this screening.';

CREATE INDEX health_screening_questionnaire_patient_id_index
    ON health_screening_questionnaire (patient_id);

CREATE INDEX health_screening_questionnaire_assessor_id_index
    ON health_screening_questionnaire (assessor_id);
