-- Dietetic assessment: the payload of the 16-step single-page wizard.
--
-- Column groups follow the wizard steps in order. Unanswered text and enum
-- columns default to the empty string; unanswered numeric, date, and time
-- columns are NULL. See ../index.md for the wizard table and ../spec/index.md
-- for the contract.

CREATE TABLE dietic_assessment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    dietitian_id UUID NOT NULL REFERENCES dietitian(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'reviewed', 'urgent')),

    -- Step 1: dietitian identification
    assessment_date DATE,
    assessment_time TIME,
    site_name VARCHAR(255) NOT NULL DEFAULT '',
    service_name VARCHAR(255) NOT NULL DEFAULT '',
    setting VARCHAR(30) NOT NULL DEFAULT '' CHECK (setting IN ('outpatient-clinic', 'inpatient-ward', 'community', 'home-visit', 'general-practice', 'care-home', 'telephone', 'video', '')),
    appointment_type VARCHAR(30) NOT NULL DEFAULT '' CHECK (appointment_type IN ('initial', 'review', 'specialist-programme', 'discharge', '')),
    planned_duration_minutes INTEGER CHECK (planned_duration_minutes IS NULL OR planned_duration_minutes BETWEEN 5 AND 240),
    interpreter_required VARCHAR(5) NOT NULL DEFAULT '' CHECK (interpreter_required IN ('yes', 'no', '')),
    interpreter_language VARCHAR(100) NOT NULL DEFAULT '',

    -- Step 2: patient identification and referral
    referral_source VARCHAR(40) NOT NULL DEFAULT '' CHECK (referral_source IN ('general-practitioner', 'hospital-consultant', 'ward-team', 'nurse', 'self-referral', 'care-home', 'social-care', 'speech-and-language-therapy', 'other', '')),
    referral_date DATE,
    referral_reason VARCHAR(500) NOT NULL DEFAULT '',
    primary_condition VARCHAR(255) NOT NULL DEFAULT '',
    consent_to_record VARCHAR(5) NOT NULL DEFAULT '' CHECK (consent_to_record IN ('yes', 'no', '')),
    accompanied_by VARCHAR(255) NOT NULL DEFAULT '',

    -- Step 3: medical history review
    condition_diabetes VARCHAR(20) NOT NULL DEFAULT '' CHECK (condition_diabetes IN ('none', 'type-1', 'type-2', 'gestational', 'other', '')),
    condition_coeliac VARCHAR(5) NOT NULL DEFAULT '' CHECK (condition_coeliac IN ('yes', 'no', '')),
    condition_inflammatory_bowel_disease VARCHAR(5) NOT NULL DEFAULT '' CHECK (condition_inflammatory_bowel_disease IN ('yes', 'no', '')),
    condition_chronic_kidney_disease VARCHAR(5) NOT NULL DEFAULT '' CHECK (condition_chronic_kidney_disease IN ('yes', 'no', '')),
    condition_liver_disease VARCHAR(5) NOT NULL DEFAULT '' CHECK (condition_liver_disease IN ('yes', 'no', '')),
    condition_cancer VARCHAR(5) NOT NULL DEFAULT '' CHECK (condition_cancer IN ('yes', 'no', '')),
    condition_cardiovascular_disease VARCHAR(5) NOT NULL DEFAULT '' CHECK (condition_cardiovascular_disease IN ('yes', 'no', '')),
    condition_respiratory_disease VARCHAR(5) NOT NULL DEFAULT '' CHECK (condition_respiratory_disease IN ('yes', 'no', '')),
    condition_stroke VARCHAR(5) NOT NULL DEFAULT '' CHECK (condition_stroke IN ('yes', 'no', '')),
    condition_dementia VARCHAR(5) NOT NULL DEFAULT '' CHECK (condition_dementia IN ('yes', 'no', '')),
    condition_eating_disorder VARCHAR(5) NOT NULL DEFAULT '' CHECK (condition_eating_disorder IN ('yes', 'no', '')),
    condition_other VARCHAR(500) NOT NULL DEFAULT '',
    recent_surgery VARCHAR(5) NOT NULL DEFAULT '' CHECK (recent_surgery IN ('yes', 'no', '')),
    recent_surgery_type VARCHAR(255) NOT NULL DEFAULT '',
    recent_surgery_date DATE,
    gastrointestinal_surgery VARCHAR(40) NOT NULL DEFAULT '' CHECK (gastrointestinal_surgery IN ('none', 'bariatric', 'bowel-resection', 'gastrectomy', 'oesophagectomy', 'whipple', 'stoma-formation', 'other', '')),
    current_symptoms TEXT NOT NULL DEFAULT '',
    family_history TEXT NOT NULL DEFAULT '',
    pregnancy_status VARCHAR(20) NOT NULL DEFAULT '' CHECK (pregnancy_status IN ('not-applicable', 'not-pregnant', 'pregnant', 'breastfeeding', 'prefer-not-to-say', '')),

    -- Step 4: medication and supplement check
    takes_prescription_medicines VARCHAR(5) NOT NULL DEFAULT '' CHECK (takes_prescription_medicines IN ('yes', 'no', '')),
    takes_over_the_counter_medicines VARCHAR(5) NOT NULL DEFAULT '' CHECK (takes_over_the_counter_medicines IN ('yes', 'no', '')),
    takes_vitamin_supplements VARCHAR(5) NOT NULL DEFAULT '' CHECK (takes_vitamin_supplements IN ('yes', 'no', '')),
    takes_mineral_supplements VARCHAR(5) NOT NULL DEFAULT '' CHECK (takes_mineral_supplements IN ('yes', 'no', '')),
    takes_herbal_products VARCHAR(5) NOT NULL DEFAULT '' CHECK (takes_herbal_products IN ('yes', 'no', '')),
    takes_oral_nutritional_supplements VARCHAR(5) NOT NULL DEFAULT '' CHECK (takes_oral_nutritional_supplements IN ('yes', 'no', '')),
    oral_nutritional_supplement_detail VARCHAR(500) NOT NULL DEFAULT '',
    enteral_nutrition VARCHAR(5) NOT NULL DEFAULT '' CHECK (enteral_nutrition IN ('yes', 'no', '')),
    enteral_route VARCHAR(20) NOT NULL DEFAULT '' CHECK (enteral_route IN ('nasogastric', 'nasojejunal', 'gastrostomy', 'jejunostomy', 'other', '')),
    enteral_tube_problem VARCHAR(5) NOT NULL DEFAULT '' CHECK (enteral_tube_problem IN ('yes', 'no', '')),
    parenteral_nutrition VARCHAR(5) NOT NULL DEFAULT '' CHECK (parenteral_nutrition IN ('yes', 'no', '')),
    drug_nutrient_interaction VARCHAR(5) NOT NULL DEFAULT '' CHECK (drug_nutrient_interaction IN ('yes', 'no', '')),
    drug_nutrient_interaction_detail VARCHAR(500) NOT NULL DEFAULT '',
    medication_adherence VARCHAR(10) NOT NULL DEFAULT '' CHECK (medication_adherence IN ('full', 'partial', 'none', 'unknown', '')),
    medication_notes TEXT NOT NULL DEFAULT '',

    -- Step 5: anthropometry and physical measurements
    measurement_method VARCHAR(15) NOT NULL DEFAULT '' CHECK (measurement_method IN ('measured', 'self-reported', 'estimated', 'declined', '')),
    height_as_cm NUMERIC(5,1) CHECK (height_as_cm IS NULL OR height_as_cm BETWEEN 50 AND 250),
    weight_as_kg NUMERIC(5,1) CHECK (weight_as_kg IS NULL OR weight_as_kg BETWEEN 15 AND 400),
    body_mass_index NUMERIC(4,1) CHECK (body_mass_index IS NULL OR body_mass_index BETWEEN 8 AND 100),
    mid_upper_arm_circumference_as_cm NUMERIC(4,1) CHECK (mid_upper_arm_circumference_as_cm IS NULL OR mid_upper_arm_circumference_as_cm BETWEEN 8 AND 70),
    calf_circumference_as_cm NUMERIC(4,1) CHECK (calf_circumference_as_cm IS NULL OR calf_circumference_as_cm BETWEEN 10 AND 80),
    waist_as_cm NUMERIC(5,1) CHECK (waist_as_cm IS NULL OR waist_as_cm BETWEEN 30 AND 250),
    usual_weight_as_kg NUMERIC(5,1) CHECK (usual_weight_as_kg IS NULL OR usual_weight_as_kg BETWEEN 15 AND 400),
    weight_3_months_ago_as_kg NUMERIC(5,1) CHECK (weight_3_months_ago_as_kg IS NULL OR weight_3_months_ago_as_kg BETWEEN 15 AND 400),
    weight_6_months_ago_as_kg NUMERIC(5,1) CHECK (weight_6_months_ago_as_kg IS NULL OR weight_6_months_ago_as_kg BETWEEN 15 AND 400),
    weight_loss_percent NUMERIC(4,1) CHECK (weight_loss_percent IS NULL OR weight_loss_percent BETWEEN -100 AND 100),
    weight_loss_is_intentional VARCHAR(5) NOT NULL DEFAULT '' CHECK (weight_loss_is_intentional IN ('yes', 'no', '')),
    weight_trend VARCHAR(15) NOT NULL DEFAULT '' CHECK (weight_trend IN ('losing', 'stable', 'gaining', 'fluctuating', 'unknown', '')),
    clothes_or_jewellery_looser VARCHAR(5) NOT NULL DEFAULT '' CHECK (clothes_or_jewellery_looser IN ('yes', 'no', '')),
    oedema_present VARCHAR(5) NOT NULL DEFAULT '' CHECK (oedema_present IN ('yes', 'no', '')),
    oedema_adjustment_kg NUMERIC(4,1) CHECK (oedema_adjustment_kg IS NULL OR oedema_adjustment_kg BETWEEN 0 AND 30),
    ascites_present VARCHAR(5) NOT NULL DEFAULT '' CHECK (ascites_present IN ('yes', 'no', '')),
    amputation_present VARCHAR(5) NOT NULL DEFAULT '' CHECK (amputation_present IN ('yes', 'no', '')),
    amputation_adjustment_percent NUMERIC(4,1) CHECK (amputation_adjustment_percent IS NULL OR amputation_adjustment_percent BETWEEN 0 AND 50),
    anthropometry_notes TEXT NOT NULL DEFAULT '',

    -- Step 6: biochemistry and clinical monitoring
    bloods_sample_date DATE,
    albumin_g_per_l NUMERIC(4,1),
    c_reactive_protein_mg_per_l NUMERIC(6,1),
    haemoglobin_g_per_l NUMERIC(4,1),
    ferritin_ug_per_l NUMERIC(7,1),
    vitamin_b12_ng_per_l NUMERIC(7,1),
    folate_ug_per_l NUMERIC(5,1),
    vitamin_d_nmol_per_l NUMERIC(5,1),
    hba1c_mmol_per_mol NUMERIC(4,1),
    sodium_mmol_per_l NUMERIC(4,1),
    potassium_mmol_per_l NUMERIC(3,1),
    magnesium_mmol_per_l NUMERIC(3,2),
    phosphate_mmol_per_l NUMERIC(3,2),
    corrected_calcium_mmol_per_l NUMERIC(3,2),
    urea_mmol_per_l NUMERIC(4,1),
    creatinine_umol_per_l NUMERIC(6,1),
    egfr_ml_per_min NUMERIC(4,1),
    alanine_aminotransferase_u_per_l NUMERIC(6,1),
    bilirubin_umol_per_l NUMERIC(5,1),
    total_cholesterol_mmol_per_l NUMERIC(4,1),
    triglycerides_mmol_per_l NUMERIC(4,1),
    biochemistry_notes TEXT NOT NULL DEFAULT '',

    -- Step 7: nutrition-focused physical examination
    subcutaneous_fat_loss VARCHAR(15) NOT NULL DEFAULT '' CHECK (subcutaneous_fat_loss IN ('none', 'mild', 'moderate', 'severe', '')),
    muscle_wasting_temples VARCHAR(5) NOT NULL DEFAULT '' CHECK (muscle_wasting_temples IN ('yes', 'no', '')),
    muscle_wasting_clavicles VARCHAR(5) NOT NULL DEFAULT '' CHECK (muscle_wasting_clavicles IN ('yes', 'no', '')),
    muscle_wasting_quadriceps VARCHAR(5) NOT NULL DEFAULT '' CHECK (muscle_wasting_quadriceps IN ('yes', 'no', '')),
    muscle_wasting_severity VARCHAR(15) NOT NULL DEFAULT '' CHECK (muscle_wasting_severity IN ('none', 'mild', 'moderate', 'severe', '')),
    peripheral_oedema_severity VARCHAR(15) NOT NULL DEFAULT '' CHECK (peripheral_oedema_severity IN ('none', 'mild', 'moderate', 'severe', '')),
    oral_health VARCHAR(15) NOT NULL DEFAULT '' CHECK (oral_health IN ('good', 'fair', 'poor', '')),
    dentition VARCHAR(20) NOT NULL DEFAULT '' CHECK (dentition IN ('good', 'some-missing', 'edentulous', 'dentures-fitting', 'dentures-loose', '')),
    chewing_ability VARCHAR(15) NOT NULL DEFAULT '' CHECK (chewing_ability IN ('normal', 'reduced', 'unable', '')),
    tongue_and_mucosa VARCHAR(30) NOT NULL DEFAULT '' CHECK (tongue_and_mucosa IN ('normal', 'glossitis', 'stomatitis', 'angular-cheilitis', 'oral-thrush', 'dry', 'other', '')),
    skin_condition VARCHAR(30) NOT NULL DEFAULT '' CHECK (skin_condition IN ('normal', 'dry', 'flaky', 'poor-wound-healing', 'bruising', 'other', '')),
    hair_condition VARCHAR(30) NOT NULL DEFAULT '' CHECK (hair_condition IN ('normal', 'thin', 'brittle', 'easily-plucked', 'other', '')),
    nail_condition VARCHAR(30) NOT NULL DEFAULT '' CHECK (nail_condition IN ('normal', 'brittle', 'spoon-shaped', 'ridged', 'other', '')),
    pressure_ulcer_present VARCHAR(5) NOT NULL DEFAULT '' CHECK (pressure_ulcer_present IN ('yes', 'no', '')),
    pressure_ulcer_category VARCHAR(15) NOT NULL DEFAULT '' CHECK (pressure_ulcer_category IN ('1', '2', '3', '4', 'unstageable', '')),
    hand_grip_strength_kg NUMERIC(4,1) CHECK (hand_grip_strength_kg IS NULL OR hand_grip_strength_kg BETWEEN 0 AND 100),
    physical_exam_notes TEXT NOT NULL DEFAULT '',

    -- Step 8: dietary recall
    meals_per_day INTEGER CHECK (meals_per_day IS NULL OR meals_per_day BETWEEN 0 AND 12),
    snacks_per_day INTEGER CHECK (snacks_per_day IS NULL OR snacks_per_day BETWEEN 0 AND 12),
    recall_breakfast TEXT NOT NULL DEFAULT '',
    recall_mid_morning TEXT NOT NULL DEFAULT '',
    recall_lunch TEXT NOT NULL DEFAULT '',
    recall_afternoon TEXT NOT NULL DEFAULT '',
    recall_dinner TEXT NOT NULL DEFAULT '',
    recall_evening TEXT NOT NULL DEFAULT '',
    portion_size VARCHAR(15) NOT NULL DEFAULT '' CHECK (portion_size IN ('small', 'medium', 'large', 'varies', '')),
    appetite VARCHAR(15) NOT NULL DEFAULT '' CHECK (appetite IN ('good', 'fair', 'poor', 'absent', '')),
    appetite_score_0_10 INTEGER CHECK (appetite_score_0_10 IS NULL OR appetite_score_0_10 BETWEEN 0 AND 10),
    proportion_of_usual_intake_percent INTEGER CHECK (proportion_of_usual_intake_percent IS NULL OR proportion_of_usual_intake_percent BETWEEN 0 AND 200),
    meals_out_per_week INTEGER CHECK (meals_out_per_week IS NULL OR meals_out_per_week BETWEEN 0 AND 30),
    takeaways_per_week INTEGER CHECK (takeaways_per_week IS NULL OR takeaways_per_week BETWEEN 0 AND 30),
    food_diary_completed VARCHAR(5) NOT NULL DEFAULT '' CHECK (food_diary_completed IN ('yes', 'no', '')),
    estimated_energy_intake_kcal INTEGER CHECK (estimated_energy_intake_kcal IS NULL OR estimated_energy_intake_kcal BETWEEN 0 AND 10000),
    estimated_protein_intake_g INTEGER CHECK (estimated_protein_intake_g IS NULL OR estimated_protein_intake_g BETWEEN 0 AND 500),
    eats_alone VARCHAR(5) NOT NULL DEFAULT '' CHECK (eats_alone IN ('yes', 'no', '')),
    dietary_recall_notes TEXT NOT NULL DEFAULT '',

    -- Step 9: fluid intake and hydration
    fluid_intake_ml_per_day INTEGER CHECK (fluid_intake_ml_per_day IS NULL OR fluid_intake_ml_per_day BETWEEN 0 AND 10000),
    fluid_types VARCHAR(500) NOT NULL DEFAULT '',
    caffeinated_drinks_per_day INTEGER CHECK (caffeinated_drinks_per_day IS NULL OR caffeinated_drinks_per_day BETWEEN 0 AND 30),
    alcohol_units_per_week NUMERIC(5,1) CHECK (alcohol_units_per_week IS NULL OR alcohol_units_per_week BETWEEN 0 AND 300),
    thickened_fluids VARCHAR(5) NOT NULL DEFAULT '' CHECK (thickened_fluids IN ('yes', 'no', '')),
    thickened_fluids_iddsi_level VARCHAR(5) NOT NULL DEFAULT '' CHECK (thickened_fluids_iddsi_level IN ('0', '1', '2', '3', '4', '')),
    hydration_signs VARCHAR(30) NOT NULL DEFAULT '' CHECK (hydration_signs IN ('well-hydrated', 'mild-dehydration', 'moderate-dehydration', 'severe-dehydration', 'fluid-overload', '')),
    fluid_restriction VARCHAR(5) NOT NULL DEFAULT '' CHECK (fluid_restriction IN ('yes', 'no', '')),
    fluid_restriction_ml_per_day INTEGER CHECK (fluid_restriction_ml_per_day IS NULL OR fluid_restriction_ml_per_day BETWEEN 0 AND 5000),
    hydration_notes TEXT NOT NULL DEFAULT '',

    -- Step 10: food preferences, allergies, and cultural requirements
    has_food_allergy VARCHAR(5) NOT NULL DEFAULT '' CHECK (has_food_allergy IN ('yes', 'no', '')),
    has_food_intolerance VARCHAR(5) NOT NULL DEFAULT '' CHECK (has_food_intolerance IN ('yes', 'no', '')),
    foods_avoided TEXT NOT NULL DEFAULT '',
    avoidance_reason VARCHAR(30) NOT NULL DEFAULT '' CHECK (avoidance_reason IN ('allergy', 'intolerance', 'medical-advice', 'religious', 'cultural', 'ethical', 'dislike', 'cost', 'other', '')),
    dislikes TEXT NOT NULL DEFAULT '',
    therapeutic_diet VARCHAR(40) NOT NULL DEFAULT '' CHECK (therapeutic_diet IN ('none', 'gluten-free', 'low-fodmap', 'renal', 'diabetic', 'low-sodium', 'low-potassium', 'high-energy-high-protein', 'ketogenic', 'low-residue', 'other', '')),
    dietary_pattern VARCHAR(30) NOT NULL DEFAULT '' CHECK (dietary_pattern IN ('omnivore', 'vegetarian', 'vegan', 'pescatarian', 'halal', 'kosher', 'other', '')),
    religious_or_cultural_requirement VARCHAR(500) NOT NULL DEFAULT '',
    fasting_practice VARCHAR(500) NOT NULL DEFAULT '',
    texture_modified_diet VARCHAR(5) NOT NULL DEFAULT '' CHECK (texture_modified_diet IN ('yes', 'no', '')),
    texture_modified_iddsi_level VARCHAR(5) NOT NULL DEFAULT '' CHECK (texture_modified_iddsi_level IN ('3', '4', '5', '6', '7', '')),
    preferences_notes TEXT NOT NULL DEFAULT '',

    -- Step 11: gastrointestinal and swallowing
    appetite_change VARCHAR(15) NOT NULL DEFAULT '' CHECK (appetite_change IN ('none', 'increased', 'decreased', '')),
    early_satiety VARCHAR(5) NOT NULL DEFAULT '' CHECK (early_satiety IN ('yes', 'no', '')),
    nausea VARCHAR(5) NOT NULL DEFAULT '' CHECK (nausea IN ('yes', 'no', '')),
    vomiting VARCHAR(5) NOT NULL DEFAULT '' CHECK (vomiting IN ('yes', 'no', '')),
    dysphagia VARCHAR(5) NOT NULL DEFAULT '' CHECK (dysphagia IN ('yes', 'no', '')),
    dysphagia_screen_outcome VARCHAR(20) NOT NULL DEFAULT '' CHECK (dysphagia_screen_outcome IN ('pass', 'fail', 'not-done', '')),
    speech_and_language_therapy VARCHAR(5) NOT NULL DEFAULT '' CHECK (speech_and_language_therapy IN ('yes', 'no', '')),
    reflux VARCHAR(5) NOT NULL DEFAULT '' CHECK (reflux IN ('yes', 'no', '')),
    abdominal_pain VARCHAR(5) NOT NULL DEFAULT '' CHECK (abdominal_pain IN ('yes', 'no', '')),
    bloating VARCHAR(5) NOT NULL DEFAULT '' CHECK (bloating IN ('yes', 'no', '')),
    bowel_frequency_per_week INTEGER CHECK (bowel_frequency_per_week IS NULL OR bowel_frequency_per_week BETWEEN 0 AND 100),
    bristol_stool_type VARCHAR(5) NOT NULL DEFAULT '' CHECK (bristol_stool_type IN ('1', '2', '3', '4', '5', '6', '7', '')),
    constipation VARCHAR(5) NOT NULL DEFAULT '' CHECK (constipation IN ('yes', 'no', '')),
    diarrhoea VARCHAR(5) NOT NULL DEFAULT '' CHECK (diarrhoea IN ('yes', 'no', '')),
    stoma_present VARCHAR(5) NOT NULL DEFAULT '' CHECK (stoma_present IN ('yes', 'no', '')),
    stoma_output_ml_per_day INTEGER CHECK (stoma_output_ml_per_day IS NULL OR stoma_output_ml_per_day BETWEEN 0 AND 10000),
    malabsorption_signs VARCHAR(5) NOT NULL DEFAULT '' CHECK (malabsorption_signs IN ('yes', 'no', '')),
    gastrointestinal_notes TEXT NOT NULL DEFAULT '',

    -- Step 12: lifestyle and environment
    living_situation VARCHAR(30) NOT NULL DEFAULT '' CHECK (living_situation IN ('alone', 'with-partner', 'with-family', 'shared-house', 'care-home', 'supported-living', 'homeless', 'other', '')),
    who_shops VARCHAR(20) NOT NULL DEFAULT '' CHECK (who_shops IN ('patient', 'family', 'carer', 'delivery', 'other', '')),
    who_cooks VARCHAR(20) NOT NULL DEFAULT '' CHECK (who_cooks IN ('patient', 'family', 'carer', 'meal-service', 'other', '')),
    cooking_skills VARCHAR(15) NOT NULL DEFAULT '' CHECK (cooking_skills IN ('confident', 'basic', 'limited', 'none', '')),
    cooking_confidence_0_10 INTEGER CHECK (cooking_confidence_0_10 IS NULL OR cooking_confidence_0_10 BETWEEN 0 AND 10),
    has_cooker VARCHAR(5) NOT NULL DEFAULT '' CHECK (has_cooker IN ('yes', 'no', '')),
    has_fridge VARCHAR(5) NOT NULL DEFAULT '' CHECK (has_fridge IN ('yes', 'no', '')),
    has_freezer VARCHAR(5) NOT NULL DEFAULT '' CHECK (has_freezer IN ('yes', 'no', '')),
    has_microwave VARCHAR(5) NOT NULL DEFAULT '' CHECK (has_microwave IN ('yes', 'no', '')),
    food_budget_per_week NUMERIC(7,2) CHECK (food_budget_per_week IS NULL OR food_budget_per_week BETWEEN 0 AND 10000),
    worried_food_would_run_out VARCHAR(5) NOT NULL DEFAULT '' CHECK (worried_food_would_run_out IN ('yes', 'no', '')),
    skipped_meals_for_money VARCHAR(5) NOT NULL DEFAULT '' CHECK (skipped_meals_for_money IN ('yes', 'no', '')),
    uses_food_bank VARCHAR(5) NOT NULL DEFAULT '' CHECK (uses_food_bank IN ('yes', 'no', '')),
    access_to_shops VARCHAR(15) NOT NULL DEFAULT '' CHECK (access_to_shops IN ('easy', 'moderate', 'difficult', 'none', '')),
    has_transport VARCHAR(5) NOT NULL DEFAULT '' CHECK (has_transport IN ('yes', 'no', '')),
    work_pattern VARCHAR(25) NOT NULL DEFAULT '' CHECK (work_pattern IN ('full-time', 'part-time', 'shift-work', 'night-shift', 'unemployed', 'retired', 'student', 'carer', 'unable-to-work', '')),
    meal_support VARCHAR(30) NOT NULL DEFAULT '' CHECK (meal_support IN ('none', 'family', 'care-worker', 'meals-on-wheels', 'day-centre', 'care-home-catering', 'other', '')),
    social_support VARCHAR(15) NOT NULL DEFAULT '' CHECK (social_support IN ('good', 'some', 'limited', 'none', '')),
    environment_notes TEXT NOT NULL DEFAULT '',

    -- Step 13: physical activity and function
    activity_level VARCHAR(20) NOT NULL DEFAULT '' CHECK (activity_level IN ('sedentary', 'lightly-active', 'moderately-active', 'very-active', '')),
    exercise_type VARCHAR(255) NOT NULL DEFAULT '',
    exercise_minutes_per_week INTEGER CHECK (exercise_minutes_per_week IS NULL OR exercise_minutes_per_week BETWEEN 0 AND 3000),
    sedentary_hours_per_day NUMERIC(3,1) CHECK (sedentary_hours_per_day IS NULL OR sedentary_hours_per_day BETWEEN 0 AND 24),
    mobility VARCHAR(25) NOT NULL DEFAULT '' CHECK (mobility IN ('independent', 'walking-aid', 'wheelchair', 'bed-bound', '')),
    falls_in_last_12_months INTEGER CHECK (falls_in_last_12_months IS NULL OR falls_in_last_12_months BETWEEN 0 AND 100),
    sarcf_strength INTEGER CHECK (sarcf_strength IS NULL OR sarcf_strength BETWEEN 0 AND 2),
    sarcf_walking INTEGER CHECK (sarcf_walking IS NULL OR sarcf_walking BETWEEN 0 AND 2),
    sarcf_rising_from_chair INTEGER CHECK (sarcf_rising_from_chair IS NULL OR sarcf_rising_from_chair BETWEEN 0 AND 2),
    sarcf_climbing_stairs INTEGER CHECK (sarcf_climbing_stairs IS NULL OR sarcf_climbing_stairs BETWEEN 0 AND 2),
    sarcf_falls INTEGER CHECK (sarcf_falls IS NULL OR sarcf_falls BETWEEN 0 AND 2),
    eats_independently VARCHAR(5) NOT NULL DEFAULT '' CHECK (eats_independently IN ('yes', 'no', '')),
    feeding_assistance_required VARCHAR(20) NOT NULL DEFAULT '' CHECK (feeding_assistance_required IN ('none', 'prompting', 'partial', 'full', '')),
    function_notes TEXT NOT NULL DEFAULT '',

    -- Step 14: behavioural, psychological, and readiness to change
    motivation_0_10 INTEGER CHECK (motivation_0_10 IS NULL OR motivation_0_10 BETWEEN 0 AND 10),
    stage_of_change VARCHAR(20) NOT NULL DEFAULT '' CHECK (stage_of_change IN ('precontemplation', 'contemplation', 'preparation', 'action', 'maintenance', 'relapse', '')),
    self_efficacy_0_10 INTEGER CHECK (self_efficacy_0_10 IS NULL OR self_efficacy_0_10 BETWEEN 0 AND 10),
    previous_attempts TEXT NOT NULL DEFAULT '',
    barriers TEXT NOT NULL DEFAULT '',
    scoff_make_yourself_sick VARCHAR(5) NOT NULL DEFAULT '' CHECK (scoff_make_yourself_sick IN ('yes', 'no', '')),
    scoff_lost_control VARCHAR(5) NOT NULL DEFAULT '' CHECK (scoff_lost_control IN ('yes', 'no', '')),
    scoff_lost_one_stone VARCHAR(5) NOT NULL DEFAULT '' CHECK (scoff_lost_one_stone IN ('yes', 'no', '')),
    scoff_believe_yourself_fat VARCHAR(5) NOT NULL DEFAULT '' CHECK (scoff_believe_yourself_fat IN ('yes', 'no', '')),
    scoff_food_dominates VARCHAR(5) NOT NULL DEFAULT '' CHECK (scoff_food_dominates IN ('yes', 'no', '')),
    mood VARCHAR(15) NOT NULL DEFAULT '' CHECK (mood IN ('good', 'low', 'depressed', 'variable', '')),
    anxiety VARCHAR(15) NOT NULL DEFAULT '' CHECK (anxiety IN ('none', 'mild', 'moderate', 'severe', '')),
    cognitive_impairment VARCHAR(15) NOT NULL DEFAULT '' CHECK (cognitive_impairment IN ('none', 'mild', 'moderate', 'severe', '')),
    capacity_concern VARCHAR(5) NOT NULL DEFAULT '' CHECK (capacity_concern IN ('yes', 'no', '')),
    safeguarding_concern VARCHAR(5) NOT NULL DEFAULT '' CHECK (safeguarding_concern IN ('yes', 'no', '')),
    health_literacy VARCHAR(15) NOT NULL DEFAULT '' CHECK (health_literacy IN ('high', 'moderate', 'low', '')),
    preferred_learning_style VARCHAR(20) NOT NULL DEFAULT '' CHECK (preferred_learning_style IN ('verbal', 'written', 'visual', 'demonstration', 'digital', '')),
    patient_goal_in_own_words TEXT NOT NULL DEFAULT '',

    -- Step 15: screening inputs and nutrition diagnosis
    acutely_ill VARCHAR(5) NOT NULL DEFAULT '' CHECK (acutely_ill IN ('yes', 'no', '')),
    no_nutritional_intake_over_5_days VARCHAR(5) NOT NULL DEFAULT '' CHECK (no_nutritional_intake_over_5_days IN ('yes', 'no', '')),
    days_of_negligible_intake INTEGER CHECK (days_of_negligible_intake IS NULL OR days_of_negligible_intake BETWEEN 0 AND 365),
    nrs_2002_score INTEGER CHECK (nrs_2002_score IS NULL OR nrs_2002_score BETWEEN 0 AND 7),
    energy_requirement_kcal INTEGER CHECK (energy_requirement_kcal IS NULL OR energy_requirement_kcal BETWEEN 0 AND 10000),
    protein_requirement_g INTEGER CHECK (protein_requirement_g IS NULL OR protein_requirement_g BETWEEN 0 AND 500),
    fluid_requirement_ml INTEGER CHECK (fluid_requirement_ml IS NULL OR fluid_requirement_ml BETWEEN 0 AND 10000),
    requirement_equation VARCHAR(30) NOT NULL DEFAULT '' CHECK (requirement_equation IN ('henry', 'schofield', 'harris-benedict', 'mifflin-st-jeor', 'kcal-per-kg', 'indirect-calorimetry', 'other', '')),
    pes_problem VARCHAR(500) NOT NULL DEFAULT '',
    pes_etiology VARCHAR(500) NOT NULL DEFAULT '',
    pes_signs_symptoms VARCHAR(500) NOT NULL DEFAULT '',

    -- Step 16: nutrition care plan, monitoring, and sign-off
    intervention_type VARCHAR(40) NOT NULL DEFAULT '' CHECK (intervention_type IN ('dietary-counselling', 'food-first-fortification', 'oral-nutritional-supplements', 'texture-modification', 'enteral-nutrition', 'parenteral-nutrition', 'weight-management', 'no-intervention', 'other', '')),
    prescribed_supplement VARCHAR(255) NOT NULL DEFAULT '',
    prescribed_supplement_dose VARCHAR(255) NOT NULL DEFAULT '',
    texture_modification_plan VARCHAR(255) NOT NULL DEFAULT '',
    goal_1 VARCHAR(500) NOT NULL DEFAULT '',
    goal_2 VARCHAR(500) NOT NULL DEFAULT '',
    goal_3 VARCHAR(500) NOT NULL DEFAULT '',
    education_provided TEXT NOT NULL DEFAULT '',
    resources_given TEXT NOT NULL DEFAULT '',
    monitoring_indicators TEXT NOT NULL DEFAULT '',
    review_interval_weeks INTEGER CHECK (review_interval_weeks IS NULL OR review_interval_weeks BETWEEN 0 AND 260),
    review_date DATE,
    onward_referral VARCHAR(500) NOT NULL DEFAULT '',
    additional_notes TEXT NOT NULL DEFAULT ''
);

CREATE INDEX dietic_assessment_patient_id_index
    ON dietic_assessment (patient_id);

CREATE INDEX dietic_assessment_dietitian_id_index
    ON dietic_assessment (dietitian_id);

CREATE INDEX dietic_assessment_status_index
    ON dietic_assessment (status);

CREATE INDEX dietic_assessment_assessment_date_index
    ON dietic_assessment (assessment_date);

CREATE TRIGGER trigger_dietic_assessment_updated_at
    BEFORE UPDATE ON dietic_assessment
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE dietic_assessment IS
    'Dietetic assessment: the payload of the 16-step single-page wizard, covering medical history, medication and supplements, dietary recall, lifestyle and food environment, and physical measurements.';
COMMENT ON COLUMN dietic_assessment.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN dietic_assessment.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN dietic_assessment.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN dietic_assessment.deleted_at IS
    'Soft-delete timestamp; NULL when the row is live.';
COMMENT ON COLUMN dietic_assessment.patient_id IS
    'Foreign key to the patient table.';
COMMENT ON COLUMN dietic_assessment.dietitian_id IS
    'Foreign key to the dietitian table, i.e. the registered practitioner conducting the assessment.';
COMMENT ON COLUMN dietic_assessment.status IS
    'Workflow status of the assessment: draft, submitted, reviewed, or urgent.';
COMMENT ON COLUMN dietic_assessment.assessment_date IS
    'Date the assessment was conducted.';
COMMENT ON COLUMN dietic_assessment.assessment_time IS
    'Time the assessment was conducted.';
COMMENT ON COLUMN dietic_assessment.site_name IS
    'Site where the assessment was conducted, such as the hospital, clinic, or care home.';
COMMENT ON COLUMN dietic_assessment.service_name IS
    'Dietetic service conducting the assessment, such as the acute dietetics team or the community nutrition service.';
COMMENT ON COLUMN dietic_assessment.setting IS
    'Setting of the appointment, such as outpatient clinic, inpatient ward, home visit, or video consultation.';
COMMENT ON COLUMN dietic_assessment.appointment_type IS
    'Type of appointment, where an initial appointment typically runs 45 to 60 minutes and a specialist programme up to 90 minutes.';
COMMENT ON COLUMN dietic_assessment.planned_duration_minutes IS
    'Planned appointment duration in minutes, such as 45 to 60 for an initial general clinical or outpatient visit.';
COMMENT ON COLUMN dietic_assessment.interpreter_required IS
    'Whether an interpreter is required for the consultation.';
COMMENT ON COLUMN dietic_assessment.interpreter_language IS
    'Language the interpreter is required for.';
COMMENT ON COLUMN dietic_assessment.referral_source IS
    'Who referred the patient to the dietetic service.';
COMMENT ON COLUMN dietic_assessment.referral_date IS
    'Date the referral was made.';
COMMENT ON COLUMN dietic_assessment.referral_reason IS
    'Reason for referral, as stated by the referrer.';
COMMENT ON COLUMN dietic_assessment.primary_condition IS
    'Primary presenting condition that the dietetic assessment addresses.';
COMMENT ON COLUMN dietic_assessment.consent_to_record IS
    'Whether the patient consented to the assessment being recorded.';
COMMENT ON COLUMN dietic_assessment.accompanied_by IS
    'Who accompanied the patient to the appointment, such as a relative, carer, or advocate.';
COMMENT ON COLUMN dietic_assessment.condition_diabetes IS
    'Diabetes diagnosis and type, because carbohydrate and energy advice differs by type.';
COMMENT ON COLUMN dietic_assessment.condition_coeliac IS
    'Whether the patient has coeliac disease, which requires a strict gluten-free diet and satisfies the GLIM reduced-assimilation etiologic criterion.';
COMMENT ON COLUMN dietic_assessment.condition_inflammatory_bowel_disease IS
    'Whether the patient has inflammatory bowel disease, i.e. Crohn disease or ulcerative colitis.';
COMMENT ON COLUMN dietic_assessment.condition_chronic_kidney_disease IS
    'Whether the patient has chronic kidney disease, which constrains protein, potassium, and phosphate advice.';
COMMENT ON COLUMN dietic_assessment.condition_liver_disease IS
    'Whether the patient has liver disease, which changes protein and sodium targets and can mask weight loss behind ascites.';
COMMENT ON COLUMN dietic_assessment.condition_cancer IS
    'Whether the patient has a cancer diagnosis, which satisfies the GLIM inflammation and disease burden etiologic criterion.';
COMMENT ON COLUMN dietic_assessment.condition_cardiovascular_disease IS
    'Whether the patient has cardiovascular disease.';
COMMENT ON COLUMN dietic_assessment.condition_respiratory_disease IS
    'Whether the patient has respiratory disease such as chronic obstructive pulmonary disease, which raises energy expenditure.';
COMMENT ON COLUMN dietic_assessment.condition_stroke IS
    'Whether the patient has had a stroke, which commonly brings dysphagia and feeding dependence.';
COMMENT ON COLUMN dietic_assessment.condition_dementia IS
    'Whether the patient has dementia, which affects appetite, capacity, and the ability to self-feed.';
COMMENT ON COLUMN dietic_assessment.condition_eating_disorder IS
    'Whether the patient has a diagnosed eating disorder, which fires the disordered-eating-concern safety flag.';
COMMENT ON COLUMN dietic_assessment.condition_other IS
    'Any other diagnosed condition relevant to the nutritional assessment.';
COMMENT ON COLUMN dietic_assessment.recent_surgery IS
    'Whether the patient has had recent surgery.';
COMMENT ON COLUMN dietic_assessment.recent_surgery_type IS
    'Type of recent surgery.';
COMMENT ON COLUMN dietic_assessment.recent_surgery_date IS
    'Date of the recent surgery.';
COMMENT ON COLUMN dietic_assessment.gastrointestinal_surgery IS
    'Any gastrointestinal surgery the patient has had, because resection, bypass, and stoma formation each change absorption.';
COMMENT ON COLUMN dietic_assessment.current_symptoms IS
    'Current symptoms the patient reports that bear on nutrition.';
COMMENT ON COLUMN dietic_assessment.family_history IS
    'Relevant family history, such as coeliac disease, diabetes, or inherited metabolic disease.';
COMMENT ON COLUMN dietic_assessment.pregnancy_status IS
    'Pregnancy and lactation status, because energy, protein, and micronutrient requirements differ.';
COMMENT ON COLUMN dietic_assessment.takes_prescription_medicines IS
    'Whether the patient takes prescription medicines.';
COMMENT ON COLUMN dietic_assessment.takes_over_the_counter_medicines IS
    'Whether the patient takes over-the-counter medicines.';
COMMENT ON COLUMN dietic_assessment.takes_vitamin_supplements IS
    'Whether the patient takes vitamin supplements.';
COMMENT ON COLUMN dietic_assessment.takes_mineral_supplements IS
    'Whether the patient takes mineral supplements.';
COMMENT ON COLUMN dietic_assessment.takes_herbal_products IS
    'Whether the patient takes herbal or complementary products, which can interact with prescribed medicines.';
COMMENT ON COLUMN dietic_assessment.takes_oral_nutritional_supplements IS
    'Whether the patient is already taking oral nutritional supplements.';
COMMENT ON COLUMN dietic_assessment.oral_nutritional_supplement_detail IS
    'Which oral nutritional supplements the patient takes, at what dose, and how well they are tolerated.';
COMMENT ON COLUMN dietic_assessment.enteral_nutrition IS
    'Whether the patient is receiving enteral tube feeding.';
COMMENT ON COLUMN dietic_assessment.enteral_route IS
    'Route of enteral feeding, such as nasogastric, gastrostomy, or jejunostomy.';
COMMENT ON COLUMN dietic_assessment.enteral_tube_problem IS
    'Whether there is a tube or tolerance problem, which fires the enteral-tube-complication safety flag.';
COMMENT ON COLUMN dietic_assessment.parenteral_nutrition IS
    'Whether the patient is receiving parenteral nutrition.';
COMMENT ON COLUMN dietic_assessment.drug_nutrient_interaction IS
    'Whether a drug-nutrient interaction was identified during the medication review.';
COMMENT ON COLUMN dietic_assessment.drug_nutrient_interaction_detail IS
    'Description of the drug-nutrient interaction identified.';
COMMENT ON COLUMN dietic_assessment.medication_adherence IS
    'Reported adherence to prescribed medicines and supplements.';
COMMENT ON COLUMN dietic_assessment.medication_notes IS
    'Free-text notes from the medication and supplement review.';
COMMENT ON COLUMN dietic_assessment.measurement_method IS
    'How height and weight were obtained: measured, self-reported, estimated, or declined. Declined is a first-class answer; the MUST body mass index component is then estimated from mid-upper-arm circumference.';
COMMENT ON COLUMN dietic_assessment.height_as_cm IS
    'Height in cm, such as for calculating body mass index.';
COMMENT ON COLUMN dietic_assessment.weight_as_kg IS
    'Weight in kg, such as for calculating body mass index and percentage weight loss.';
COMMENT ON COLUMN dietic_assessment.body_mass_index IS
    'Body mass index in kg per square metre, auto-computed from height and weight, and scored as MUST step 1.';
COMMENT ON COLUMN dietic_assessment.mid_upper_arm_circumference_as_cm IS
    'Mid-upper-arm circumference in cm. Below 23.5 suggests body mass index below 20; above 32.0 suggests body mass index above 30. Used to estimate the MUST body mass index component when weighing is declined or impractical.';
COMMENT ON COLUMN dietic_assessment.calf_circumference_as_cm IS
    'Calf circumference in cm, supporting the GLIM reduced-muscle-mass phenotypic criterion.';
COMMENT ON COLUMN dietic_assessment.waist_as_cm IS
    'Waist circumference in cm, such as for assessing central adiposity.';
COMMENT ON COLUMN dietic_assessment.usual_weight_as_kg IS
    'The patient''s usual or pre-illness weight in kg, i.e. the baseline for percentage weight loss.';
COMMENT ON COLUMN dietic_assessment.weight_3_months_ago_as_kg IS
    'Weight in kg three months ago, where known.';
COMMENT ON COLUMN dietic_assessment.weight_6_months_ago_as_kg IS
    'Weight in kg six months ago, i.e. the outer bound of the MUST weight-loss window.';
COMMENT ON COLUMN dietic_assessment.weight_loss_percent IS
    'Percentage unplanned weight loss over the last three to six months, auto-computed, and scored as MUST step 2.';
COMMENT ON COLUMN dietic_assessment.weight_loss_is_intentional IS
    'Whether the weight loss was intentional. Only unplanned loss scores in MUST, so intentional loss is recorded but scored zero.';
COMMENT ON COLUMN dietic_assessment.weight_trend IS
    'Direction of the weight trend: losing, stable, gaining, fluctuating, or unknown.';
COMMENT ON COLUMN dietic_assessment.clothes_or_jewellery_looser IS
    'Whether clothes or jewellery have become looser, i.e. the MUST subjective criterion used when no usual weight is available.';
COMMENT ON COLUMN dietic_assessment.oedema_present IS
    'Whether oedema is present, because fluid weight masks true weight loss.';
COMMENT ON COLUMN dietic_assessment.oedema_adjustment_kg IS
    'Weight adjustment in kg subtracted for oedema before body mass index is computed.';
COMMENT ON COLUMN dietic_assessment.ascites_present IS
    'Whether ascites is present, because fluid weight masks true weight loss.';
COMMENT ON COLUMN dietic_assessment.amputation_present IS
    'Whether the patient has an amputation, which changes the interpretation of weight and body mass index.';
COMMENT ON COLUMN dietic_assessment.amputation_adjustment_percent IS
    'Percentage of body weight attributed to the absent limb, used to interpret weight and body mass index.';
COMMENT ON COLUMN dietic_assessment.anthropometry_notes IS
    'Free-text notes about the measurements, such as why weighing was declined.';
COMMENT ON COLUMN dietic_assessment.bloods_sample_date IS
    'Date the blood sample was taken, so the report can say how current the biochemistry is.';
COMMENT ON COLUMN dietic_assessment.albumin_g_per_l IS
    'Serum albumin in g per litre. A marker of inflammation rather than of protein intake, so it supports the GLIM inflammation criterion rather than diagnosing malnutrition.';
COMMENT ON COLUMN dietic_assessment.c_reactive_protein_mg_per_l IS
    'C-reactive protein in mg per litre, supporting the GLIM inflammation and disease burden etiologic criterion.';
COMMENT ON COLUMN dietic_assessment.haemoglobin_g_per_l IS
    'Haemoglobin in g per litre.';
COMMENT ON COLUMN dietic_assessment.ferritin_ug_per_l IS
    'Ferritin in micrograms per litre, i.e. the iron store marker.';
COMMENT ON COLUMN dietic_assessment.vitamin_b12_ng_per_l IS
    'Vitamin B12 in nanograms per litre.';
COMMENT ON COLUMN dietic_assessment.folate_ug_per_l IS
    'Serum folate in micrograms per litre.';
COMMENT ON COLUMN dietic_assessment.vitamin_d_nmol_per_l IS
    '25-hydroxyvitamin D in nmol per litre.';
COMMENT ON COLUMN dietic_assessment.hba1c_mmol_per_mol IS
    'Glycated haemoglobin in mmol per mol. Above 75 fires the uncontrolled-diabetes safety flag.';
COMMENT ON COLUMN dietic_assessment.sodium_mmol_per_l IS
    'Serum sodium in mmol per litre.';
COMMENT ON COLUMN dietic_assessment.potassium_mmol_per_l IS
    'Serum potassium in mmol per litre. A low pre-feeding value is a NICE CG32 refeeding-syndrome high-risk criterion.';
COMMENT ON COLUMN dietic_assessment.magnesium_mmol_per_l IS
    'Serum magnesium in mmol per litre. A low pre-feeding value is a NICE CG32 refeeding-syndrome high-risk criterion.';
COMMENT ON COLUMN dietic_assessment.phosphate_mmol_per_l IS
    'Serum phosphate in mmol per litre. A low pre-feeding value is a NICE CG32 refeeding-syndrome high-risk criterion.';
COMMENT ON COLUMN dietic_assessment.corrected_calcium_mmol_per_l IS
    'Albumin-corrected calcium in mmol per litre.';
COMMENT ON COLUMN dietic_assessment.urea_mmol_per_l IS
    'Serum urea in mmol per litre.';
COMMENT ON COLUMN dietic_assessment.creatinine_umol_per_l IS
    'Serum creatinine in micromol per litre.';
COMMENT ON COLUMN dietic_assessment.egfr_ml_per_min IS
    'Estimated glomerular filtration rate in ml per minute per 1.73 square metres. Below 30 with a high-protein or high-potassium plan fires the renal-dietary-conflict safety flag.';
COMMENT ON COLUMN dietic_assessment.alanine_aminotransferase_u_per_l IS
    'Alanine aminotransferase in units per litre.';
COMMENT ON COLUMN dietic_assessment.bilirubin_umol_per_l IS
    'Total bilirubin in micromol per litre.';
COMMENT ON COLUMN dietic_assessment.total_cholesterol_mmol_per_l IS
    'Total cholesterol in mmol per litre.';
COMMENT ON COLUMN dietic_assessment.triglycerides_mmol_per_l IS
    'Triglycerides in mmol per litre.';
COMMENT ON COLUMN dietic_assessment.biochemistry_notes IS
    'Free-text notes about the biochemistry results.';
COMMENT ON COLUMN dietic_assessment.subcutaneous_fat_loss IS
    'Severity of subcutaneous fat loss on physical examination, such as at the orbital, triceps, and rib regions.';
COMMENT ON COLUMN dietic_assessment.muscle_wasting_temples IS
    'Whether temporal muscle wasting is present on physical examination.';
COMMENT ON COLUMN dietic_assessment.muscle_wasting_clavicles IS
    'Whether clavicular muscle wasting is present on physical examination.';
COMMENT ON COLUMN dietic_assessment.muscle_wasting_quadriceps IS
    'Whether quadriceps muscle wasting is present on physical examination.';
COMMENT ON COLUMN dietic_assessment.muscle_wasting_severity IS
    'Overall severity of muscle wasting, which satisfies the GLIM reduced-muscle-mass phenotypic criterion when body-composition measurement is unavailable.';
COMMENT ON COLUMN dietic_assessment.peripheral_oedema_severity IS
    'Severity of peripheral oedema on physical examination.';
COMMENT ON COLUMN dietic_assessment.oral_health IS
    'Overall oral health, because poor oral health limits what can be eaten.';
COMMENT ON COLUMN dietic_assessment.dentition IS
    'State of the dentition, including whether dentures fit, because chewing capacity constrains texture.';
COMMENT ON COLUMN dietic_assessment.chewing_ability IS
    'Ability to chew: normal, reduced, or unable.';
COMMENT ON COLUMN dietic_assessment.tongue_and_mucosa IS
    'Tongue and oral mucosa findings, such as glossitis or angular cheilitis, which suggest micronutrient deficiency.';
COMMENT ON COLUMN dietic_assessment.skin_condition IS
    'Skin findings relevant to nutrition, such as poor wound healing or easy bruising.';
COMMENT ON COLUMN dietic_assessment.hair_condition IS
    'Hair findings relevant to nutrition, such as thin or easily plucked hair.';
COMMENT ON COLUMN dietic_assessment.nail_condition IS
    'Nail findings relevant to nutrition, such as spoon-shaped nails suggesting iron deficiency.';
COMMENT ON COLUMN dietic_assessment.pressure_ulcer_present IS
    'Whether a pressure ulcer is present.';
COMMENT ON COLUMN dietic_assessment.pressure_ulcer_category IS
    'Pressure ulcer category, where category 2 or above fires the pressure-ulcer safety flag and raises protein and energy requirements.';
COMMENT ON COLUMN dietic_assessment.hand_grip_strength_kg IS
    'Hand-grip strength in kg by dynamometer, compared against sex-adjusted cut-offs to support the sarcopenia-risk safety flag.';
COMMENT ON COLUMN dietic_assessment.physical_exam_notes IS
    'Free-text notes from the nutrition-focused physical examination.';
COMMENT ON COLUMN dietic_assessment.meals_per_day IS
    'Number of meals the patient eats in a typical day.';
COMMENT ON COLUMN dietic_assessment.snacks_per_day IS
    'Number of snacks the patient eats in a typical day.';
COMMENT ON COLUMN dietic_assessment.recall_breakfast IS
    '24-hour recall: what the patient ate and drank at breakfast.';
COMMENT ON COLUMN dietic_assessment.recall_mid_morning IS
    '24-hour recall: what the patient ate and drank mid-morning.';
COMMENT ON COLUMN dietic_assessment.recall_lunch IS
    '24-hour recall: what the patient ate and drank at lunch.';
COMMENT ON COLUMN dietic_assessment.recall_afternoon IS
    '24-hour recall: what the patient ate and drank in the afternoon.';
COMMENT ON COLUMN dietic_assessment.recall_dinner IS
    '24-hour recall: what the patient ate and drank at dinner.';
COMMENT ON COLUMN dietic_assessment.recall_evening IS
    '24-hour recall: what the patient ate and drank in the evening.';
COMMENT ON COLUMN dietic_assessment.portion_size IS
    'Typical portion size the patient describes.';
COMMENT ON COLUMN dietic_assessment.appetite IS
    'Overall appetite: good, fair, poor, or absent.';
COMMENT ON COLUMN dietic_assessment.appetite_score_0_10 IS
    'Appetite rated by the patient from 0 for none to 10 for normal.';
COMMENT ON COLUMN dietic_assessment.proportion_of_usual_intake_percent IS
    'Current intake as a percentage of the patient''s usual intake. Below 50 fires the inadequate-oral-intake safety flag and supports the GLIM reduced-intake etiologic criterion.';
COMMENT ON COLUMN dietic_assessment.meals_out_per_week IS
    'Number of meals eaten out per week.';
COMMENT ON COLUMN dietic_assessment.takeaways_per_week IS
    'Number of takeaway meals per week.';
COMMENT ON COLUMN dietic_assessment.food_diary_completed IS
    'Whether the patient completed a food diary before the appointment.';
COMMENT ON COLUMN dietic_assessment.estimated_energy_intake_kcal IS
    'Estimated current daily energy intake in kilocalories, from the recall or food diary.';
COMMENT ON COLUMN dietic_assessment.estimated_protein_intake_g IS
    'Estimated current daily protein intake in grams, from the recall or food diary.';
COMMENT ON COLUMN dietic_assessment.eats_alone IS
    'Whether the patient usually eats alone, which is associated with reduced intake in older adults.';
COMMENT ON COLUMN dietic_assessment.dietary_recall_notes IS
    'Free-text notes about the dietary recall.';
COMMENT ON COLUMN dietic_assessment.fluid_intake_ml_per_day IS
    'Usual daily fluid intake in ml.';
COMMENT ON COLUMN dietic_assessment.fluid_types IS
    'Types of drink the patient consumes, such as water, tea, juice, or milk-based drinks.';
COMMENT ON COLUMN dietic_assessment.caffeinated_drinks_per_day IS
    'Number of caffeinated drinks per day.';
COMMENT ON COLUMN dietic_assessment.alcohol_units_per_week IS
    'Alcohol consumption in United Kingdom units per week. Above 14 fires the alcohol-excess safety flag and is a NICE CG32 refeeding-risk criterion.';
COMMENT ON COLUMN dietic_assessment.thickened_fluids IS
    'Whether the patient takes thickened fluids for dysphagia.';
COMMENT ON COLUMN dietic_assessment.thickened_fluids_iddsi_level IS
    'IDDSI drink level 0 to 4, where 0 is thin and 4 is extremely thick.';
COMMENT ON COLUMN dietic_assessment.hydration_signs IS
    'Clinical hydration status observed, from well-hydrated through severe dehydration to fluid overload.';
COMMENT ON COLUMN dietic_assessment.fluid_restriction IS
    'Whether a fluid restriction is in place, such as for heart failure or dialysis.';
COMMENT ON COLUMN dietic_assessment.fluid_restriction_ml_per_day IS
    'Prescribed daily fluid restriction in ml.';
COMMENT ON COLUMN dietic_assessment.hydration_notes IS
    'Free-text notes about fluid intake and hydration.';
COMMENT ON COLUMN dietic_assessment.has_food_allergy IS
    'Whether the patient has any food allergy.';
COMMENT ON COLUMN dietic_assessment.has_food_intolerance IS
    'Whether the patient has any food intolerance.';
COMMENT ON COLUMN dietic_assessment.foods_avoided IS
    'Foods the patient avoids, whatever the reason.';
COMMENT ON COLUMN dietic_assessment.avoidance_reason IS
    'Why the patient avoids those foods, because allergy, medical advice, cost, and preference lead to different dietetic responses.';
COMMENT ON COLUMN dietic_assessment.dislikes IS
    'Foods the patient dislikes, which constrain what a care plan can realistically suggest.';
COMMENT ON COLUMN dietic_assessment.therapeutic_diet IS
    'Any therapeutic diet already in place, such as gluten-free, renal, or low-FODMAP.';
COMMENT ON COLUMN dietic_assessment.dietary_pattern IS
    'Overall dietary pattern, such as omnivore, vegetarian, vegan, halal, or kosher.';
COMMENT ON COLUMN dietic_assessment.religious_or_cultural_requirement IS
    'Religious or cultural dietary requirements the care plan must respect.';
COMMENT ON COLUMN dietic_assessment.fasting_practice IS
    'Fasting practices the patient observes, such as Ramadan, which change the timing of intake.';
COMMENT ON COLUMN dietic_assessment.texture_modified_diet IS
    'Whether the patient is on a texture-modified diet.';
COMMENT ON COLUMN dietic_assessment.texture_modified_iddsi_level IS
    'IDDSI food level 3 to 7, where 3 is liquidised and 7 is regular.';
COMMENT ON COLUMN dietic_assessment.preferences_notes IS
    'Free-text notes about preferences, allergies, and cultural requirements.';
COMMENT ON COLUMN dietic_assessment.appetite_change IS
    'Whether appetite has changed recently, and in which direction.';
COMMENT ON COLUMN dietic_assessment.early_satiety IS
    'Whether the patient feels full soon after starting to eat.';
COMMENT ON COLUMN dietic_assessment.nausea IS
    'Whether the patient has nausea.';
COMMENT ON COLUMN dietic_assessment.vomiting IS
    'Whether the patient is vomiting.';
COMMENT ON COLUMN dietic_assessment.dysphagia IS
    'Whether the patient has difficulty swallowing. Recorded dysphagia without a speech-and-language-therapy assessment fires the dysphagia-aspiration-risk safety flag.';
COMMENT ON COLUMN dietic_assessment.dysphagia_screen_outcome IS
    'Outcome of the swallow screen: pass, fail, or not done.';
COMMENT ON COLUMN dietic_assessment.speech_and_language_therapy IS
    'Whether speech and language therapy is involved in the patient''s care.';
COMMENT ON COLUMN dietic_assessment.reflux IS
    'Whether the patient has gastro-oesophageal reflux.';
COMMENT ON COLUMN dietic_assessment.abdominal_pain IS
    'Whether the patient has abdominal pain.';
COMMENT ON COLUMN dietic_assessment.bloating IS
    'Whether the patient has bloating.';
COMMENT ON COLUMN dietic_assessment.bowel_frequency_per_week IS
    'Number of bowel movements per week.';
COMMENT ON COLUMN dietic_assessment.bristol_stool_type IS
    'Bristol Stool Form Scale type 1 to 7, where 1 to 2 suggests constipation and 6 to 7 suggests diarrhoea.';
COMMENT ON COLUMN dietic_assessment.constipation IS
    'Whether the patient has constipation.';
COMMENT ON COLUMN dietic_assessment.diarrhoea IS
    'Whether the patient has diarrhoea.';
COMMENT ON COLUMN dietic_assessment.stoma_present IS
    'Whether the patient has a stoma or enterocutaneous fistula.';
COMMENT ON COLUMN dietic_assessment.stoma_output_ml_per_day IS
    'Stoma or fistula output in ml per day, where a high output impairs absorption and fluid balance.';
COMMENT ON COLUMN dietic_assessment.malabsorption_signs IS
    'Whether signs of malabsorption are present, such as steatorrhoea, which satisfies the GLIM reduced-assimilation etiologic criterion.';
COMMENT ON COLUMN dietic_assessment.gastrointestinal_notes IS
    'Free-text notes about gastrointestinal and swallowing findings.';
COMMENT ON COLUMN dietic_assessment.living_situation IS
    'The patient''s living situation, because it determines who provides food.';
COMMENT ON COLUMN dietic_assessment.who_shops IS
    'Who does the food shopping.';
COMMENT ON COLUMN dietic_assessment.who_cooks IS
    'Who prepares the meals.';
COMMENT ON COLUMN dietic_assessment.cooking_skills IS
    'The patient''s cooking skills, because a care plan must be achievable with them.';
COMMENT ON COLUMN dietic_assessment.cooking_confidence_0_10 IS
    'The patient''s confidence in cooking, from 0 for none to 10 for fully confident.';
COMMENT ON COLUMN dietic_assessment.has_cooker IS
    'Whether the patient has a working cooker.';
COMMENT ON COLUMN dietic_assessment.has_fridge IS
    'Whether the patient has a working fridge.';
COMMENT ON COLUMN dietic_assessment.has_freezer IS
    'Whether the patient has a working freezer.';
COMMENT ON COLUMN dietic_assessment.has_microwave IS
    'Whether the patient has a working microwave.';
COMMENT ON COLUMN dietic_assessment.food_budget_per_week IS
    'Weekly food budget in the local currency, because a care plan must be affordable.';
COMMENT ON COLUMN dietic_assessment.worried_food_would_run_out IS
    'Whether the patient worried that food would run out before there was money to buy more, i.e. the first food-insecurity screening question.';
COMMENT ON COLUMN dietic_assessment.skipped_meals_for_money IS
    'Whether the patient skipped meals because there was not enough money for food, i.e. the second food-insecurity screening question.';
COMMENT ON COLUMN dietic_assessment.uses_food_bank IS
    'Whether the patient uses a food bank.';
COMMENT ON COLUMN dietic_assessment.access_to_shops IS
    'How easily the patient can reach food shops.';
COMMENT ON COLUMN dietic_assessment.has_transport IS
    'Whether the patient has transport for food shopping.';
COMMENT ON COLUMN dietic_assessment.work_pattern IS
    'The patient''s work pattern, because shift and night work disrupt meal timing.';
COMMENT ON COLUMN dietic_assessment.meal_support IS
    'What meal support the patient receives, such as family, a care worker, or meals on wheels.';
COMMENT ON COLUMN dietic_assessment.social_support IS
    'Level of social support available to the patient.';
COMMENT ON COLUMN dietic_assessment.environment_notes IS
    'Free-text notes about lifestyle and food environment.';
COMMENT ON COLUMN dietic_assessment.activity_level IS
    'Overall physical activity level, which feeds the energy requirement estimate.';
COMMENT ON COLUMN dietic_assessment.exercise_type IS
    'Type of exercise the patient does.';
COMMENT ON COLUMN dietic_assessment.exercise_minutes_per_week IS
    'Minutes of exercise per week.';
COMMENT ON COLUMN dietic_assessment.sedentary_hours_per_day IS
    'Hours per day spent sedentary.';
COMMENT ON COLUMN dietic_assessment.mobility IS
    'Mobility status, from independent through walking aid and wheelchair to bed-bound.';
COMMENT ON COLUMN dietic_assessment.falls_in_last_12_months IS
    'Number of falls in the last 12 months, which is the SARC-F falls component and a sarcopenia indicator.';
COMMENT ON COLUMN dietic_assessment.sarcf_strength IS
    'SARC-F component: difficulty lifting and carrying 4.5 kg, scored 0 for none, 1 for some, 2 for a lot or unable.';
COMMENT ON COLUMN dietic_assessment.sarcf_walking IS
    'SARC-F component: difficulty walking across a room, scored 0 for none, 1 for some, 2 for a lot, uses aids, or unable.';
COMMENT ON COLUMN dietic_assessment.sarcf_rising_from_chair IS
    'SARC-F component: difficulty transferring from a chair or bed, scored 0 for none, 1 for some, 2 for a lot or unable without help.';
COMMENT ON COLUMN dietic_assessment.sarcf_climbing_stairs IS
    'SARC-F component: difficulty climbing a flight of ten stairs, scored 0 for none, 1 for some, 2 for a lot or unable.';
COMMENT ON COLUMN dietic_assessment.sarcf_falls IS
    'SARC-F component: number of falls in the past year, scored 0 for none, 1 for one to three, 2 for four or more.';
COMMENT ON COLUMN dietic_assessment.eats_independently IS
    'Whether the patient can eat and drink without assistance.';
COMMENT ON COLUMN dietic_assessment.feeding_assistance_required IS
    'Level of feeding assistance required: none, prompting, partial, or full.';
COMMENT ON COLUMN dietic_assessment.function_notes IS
    'Free-text notes about physical activity and function.';
COMMENT ON COLUMN dietic_assessment.motivation_0_10 IS
    'The patient''s motivation to change, from 0 for none to 10 for fully motivated.';
COMMENT ON COLUMN dietic_assessment.stage_of_change IS
    'Stage of change in the transtheoretical model, which sets how directive the intervention should be.';
COMMENT ON COLUMN dietic_assessment.self_efficacy_0_10 IS
    'The patient''s confidence in their ability to change, from 0 for none to 10 for fully confident.';
COMMENT ON COLUMN dietic_assessment.previous_attempts IS
    'Previous dietary changes the patient has attempted, and what happened.';
COMMENT ON COLUMN dietic_assessment.barriers IS
    'Barriers the patient identifies to making dietary changes.';
COMMENT ON COLUMN dietic_assessment.scoff_make_yourself_sick IS
    'SCOFF question: do you make yourself sick because you feel uncomfortably full?';
COMMENT ON COLUMN dietic_assessment.scoff_lost_control IS
    'SCOFF question: do you worry that you have lost control over how much you eat?';
COMMENT ON COLUMN dietic_assessment.scoff_lost_one_stone IS
    'SCOFF question: have you recently lost more than one stone, about 6 kg, in a three-month period?';
COMMENT ON COLUMN dietic_assessment.scoff_believe_yourself_fat IS
    'SCOFF question: do you believe yourself to be fat when others say you are too thin?';
COMMENT ON COLUMN dietic_assessment.scoff_food_dominates IS
    'SCOFF question: would you say that food dominates your life?';
COMMENT ON COLUMN dietic_assessment.mood IS
    'The patient''s mood, because low mood reduces appetite and adherence.';
COMMENT ON COLUMN dietic_assessment.anxiety IS
    'The patient''s anxiety level.';
COMMENT ON COLUMN dietic_assessment.cognitive_impairment IS
    'Degree of cognitive impairment, which affects recall accuracy and the ability to follow a plan.';
COMMENT ON COLUMN dietic_assessment.capacity_concern IS
    'Whether there is a concern about the patient''s capacity to consent to or follow the plan, which fires the capacity-concern safety flag.';
COMMENT ON COLUMN dietic_assessment.safeguarding_concern IS
    'Whether there is a safeguarding concern, such as self-neglect or malnutrition in a care setting, which fires the safeguarding safety flag.';
COMMENT ON COLUMN dietic_assessment.health_literacy IS
    'The patient''s health literacy, which sets the reading level of the resources given.';
COMMENT ON COLUMN dietic_assessment.preferred_learning_style IS
    'How the patient prefers to receive information, such as verbal, written, visual, or by demonstration.';
COMMENT ON COLUMN dietic_assessment.patient_goal_in_own_words IS
    'The patient''s own goal, recorded verbatim, so the care plan can be written against what the patient actually wants.';
COMMENT ON COLUMN dietic_assessment.acutely_ill IS
    'Whether the patient is acutely ill, i.e. the first half of the MUST step 3 acute disease effect criterion.';
COMMENT ON COLUMN dietic_assessment.no_nutritional_intake_over_5_days IS
    'Whether there has been, or is likely to be, no nutritional intake for more than five days, i.e. the second half of the MUST step 3 acute disease effect criterion.';
COMMENT ON COLUMN dietic_assessment.days_of_negligible_intake IS
    'Number of days of little or no nutritional intake, used for the NICE CG32 refeeding-syndrome risk criteria.';
COMMENT ON COLUMN dietic_assessment.nrs_2002_score IS
    'Nutritional Risk Screening 2002 total score, 0 to 7, where 3 or more indicates nutritional risk in the acute inpatient setting.';
COMMENT ON COLUMN dietic_assessment.energy_requirement_kcal IS
    'Estimated daily energy requirement in kilocalories, entered by the dietitian using the equation named below.';
COMMENT ON COLUMN dietic_assessment.protein_requirement_g IS
    'Estimated daily protein requirement in grams, entered by the dietitian.';
COMMENT ON COLUMN dietic_assessment.fluid_requirement_ml IS
    'Estimated daily fluid requirement in ml, entered by the dietitian.';
COMMENT ON COLUMN dietic_assessment.requirement_equation IS
    'Which equation or method was used to estimate requirements, because local policy governs the choice and the form does not compute it.';
COMMENT ON COLUMN dietic_assessment.pes_problem IS
    'PES statement problem, i.e. the nutrition and dietetic diagnosis.';
COMMENT ON COLUMN dietic_assessment.pes_etiology IS
    'PES statement etiology, i.e. what is causing the problem.';
COMMENT ON COLUMN dietic_assessment.pes_signs_symptoms IS
    'PES statement signs and symptoms, i.e. the evidence for the problem.';
COMMENT ON COLUMN dietic_assessment.intervention_type IS
    'Type of nutrition intervention chosen, from dietary counselling through food fortification and oral nutritional supplements to enteral or parenteral nutrition.';
COMMENT ON COLUMN dietic_assessment.prescribed_supplement IS
    'Oral nutritional supplement prescribed, where one is prescribed.';
COMMENT ON COLUMN dietic_assessment.prescribed_supplement_dose IS
    'Dose and frequency of the prescribed supplement.';
COMMENT ON COLUMN dietic_assessment.texture_modification_plan IS
    'Texture modification plan, stated in IDDSI levels where applicable.';
COMMENT ON COLUMN dietic_assessment.goal_1 IS
    'First SMART goal, with its target, measure, and review date.';
COMMENT ON COLUMN dietic_assessment.goal_2 IS
    'Second SMART goal, with its target, measure, and review date.';
COMMENT ON COLUMN dietic_assessment.goal_3 IS
    'Third SMART goal, with its target, measure, and review date.';
COMMENT ON COLUMN dietic_assessment.education_provided IS
    'Education provided to the patient during the consultation.';
COMMENT ON COLUMN dietic_assessment.resources_given IS
    'Written or digital resources given to the patient.';
COMMENT ON COLUMN dietic_assessment.monitoring_indicators IS
    'What will be monitored to evaluate the intervention, such as weight, intake, or a biochemical marker.';
COMMENT ON COLUMN dietic_assessment.review_interval_weeks IS
    'Interval in weeks until the next review.';
COMMENT ON COLUMN dietic_assessment.review_date IS
    'Date of the next planned review.';
COMMENT ON COLUMN dietic_assessment.onward_referral IS
    'Onward referrals made, such as to speech and language therapy, the nutrition support team, or social prescribing.';
COMMENT ON COLUMN dietic_assessment.additional_notes IS
    'Any additional notes the dietitian records.';
