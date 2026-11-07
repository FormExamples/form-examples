#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::dietic_assessments::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub dietitian_id: Uuid,
    pub status: String,
    pub assessment_date: Option<Date>,
    pub assessment_time: Option<String>,
    pub site_name: String,
    pub service_name: String,
    pub setting: String,
    pub appointment_type: String,
    pub planned_duration_minutes: Option<i32>,
    pub interpreter_required: String,
    pub interpreter_language: String,
    pub referral_source: String,
    pub referral_date: Option<Date>,
    pub referral_reason: String,
    pub primary_condition: String,
    pub consent_to_record: String,
    pub accompanied_by: String,
    pub condition_diabetes: String,
    pub condition_coeliac: String,
    pub condition_inflammatory_bowel_disease: String,
    pub condition_chronic_kidney_disease: String,
    pub condition_liver_disease: String,
    pub condition_cancer: String,
    pub condition_cardiovascular_disease: String,
    pub condition_respiratory_disease: String,
    pub condition_stroke: String,
    pub condition_dementia: String,
    pub condition_eating_disorder: String,
    pub condition_other: String,
    pub recent_surgery: String,
    pub recent_surgery_type: String,
    pub recent_surgery_date: Option<Date>,
    pub gastrointestinal_surgery: String,
    pub current_symptoms: String,
    pub family_history: String,
    pub pregnancy_status: String,
    pub takes_prescription_medicines: String,
    pub takes_over_the_counter_medicines: String,
    pub takes_vitamin_supplements: String,
    pub takes_mineral_supplements: String,
    pub takes_herbal_products: String,
    pub takes_oral_nutritional_supplements: String,
    pub oral_nutritional_supplement_detail: String,
    pub enteral_nutrition: String,
    pub enteral_route: String,
    pub enteral_tube_problem: String,
    pub parenteral_nutrition: String,
    pub drug_nutrient_interaction: String,
    pub drug_nutrient_interaction_detail: String,
    pub medication_adherence: String,
    pub medication_notes: String,
    pub measurement_method: String,
    pub height_as_cm: Option<f64>,
    pub weight_as_kg: Option<f64>,
    pub body_mass_index: Option<f64>,
    pub mid_upper_arm_circumference_as_cm: Option<f64>,
    pub calf_circumference_as_cm: Option<f64>,
    pub waist_as_cm: Option<f64>,
    pub usual_weight_as_kg: Option<f64>,
    pub weight_3_months_ago_as_kg: Option<f64>,
    pub weight_6_months_ago_as_kg: Option<f64>,
    pub weight_loss_percent: Option<f64>,
    pub weight_loss_is_intentional: String,
    pub weight_trend: String,
    pub clothes_or_jewellery_looser: String,
    pub oedema_present: String,
    pub oedema_adjustment_kg: Option<f64>,
    pub ascites_present: String,
    pub amputation_present: String,
    pub amputation_adjustment_percent: Option<f64>,
    pub anthropometry_notes: String,
    pub bloods_sample_date: Option<Date>,
    pub albumin_g_per_l: Option<f64>,
    pub c_reactive_protein_mg_per_l: Option<f64>,
    pub haemoglobin_g_per_l: Option<f64>,
    pub ferritin_ug_per_l: Option<f64>,
    pub vitamin_b12_ng_per_l: Option<f64>,
    pub folate_ug_per_l: Option<f64>,
    pub vitamin_d_nmol_per_l: Option<f64>,
    pub hba1c_mmol_per_mol: Option<f64>,
    pub sodium_mmol_per_l: Option<f64>,
    pub potassium_mmol_per_l: Option<f64>,
    pub magnesium_mmol_per_l: Option<f64>,
    pub phosphate_mmol_per_l: Option<f64>,
    pub corrected_calcium_mmol_per_l: Option<f64>,
    pub urea_mmol_per_l: Option<f64>,
    pub creatinine_umol_per_l: Option<f64>,
    pub egfr_ml_per_min: Option<f64>,
    pub alanine_aminotransferase_u_per_l: Option<f64>,
    pub bilirubin_umol_per_l: Option<f64>,
    pub total_cholesterol_mmol_per_l: Option<f64>,
    pub triglycerides_mmol_per_l: Option<f64>,
    pub biochemistry_notes: String,
    pub subcutaneous_fat_loss: String,
    pub muscle_wasting_temples: String,
    pub muscle_wasting_clavicles: String,
    pub muscle_wasting_quadriceps: String,
    pub muscle_wasting_severity: String,
    pub peripheral_oedema_severity: String,
    pub oral_health: String,
    pub dentition: String,
    pub chewing_ability: String,
    pub tongue_and_mucosa: String,
    pub skin_condition: String,
    pub hair_condition: String,
    pub nail_condition: String,
    pub pressure_ulcer_present: String,
    pub pressure_ulcer_category: String,
    pub hand_grip_strength_kg: Option<f64>,
    pub physical_exam_notes: String,
    pub meals_per_day: Option<i32>,
    pub snacks_per_day: Option<i32>,
    pub recall_breakfast: String,
    pub recall_mid_morning: String,
    pub recall_lunch: String,
    pub recall_afternoon: String,
    pub recall_dinner: String,
    pub recall_evening: String,
    pub portion_size: String,
    pub appetite: String,
    pub appetite_score_0_10: Option<i32>,
    pub proportion_of_usual_intake_percent: Option<i32>,
    pub meals_out_per_week: Option<i32>,
    pub takeaways_per_week: Option<i32>,
    pub food_diary_completed: String,
    pub estimated_energy_intake_kcal: Option<i32>,
    pub estimated_protein_intake_g: Option<i32>,
    pub eats_alone: String,
    pub dietary_recall_notes: String,
    pub fluid_intake_ml_per_day: Option<i32>,
    pub fluid_types: String,
    pub caffeinated_drinks_per_day: Option<i32>,
    pub alcohol_units_per_week: Option<f64>,
    pub thickened_fluids: String,
    pub thickened_fluids_iddsi_level: String,
    pub hydration_signs: String,
    pub fluid_restriction: String,
    pub fluid_restriction_ml_per_day: Option<i32>,
    pub hydration_notes: String,
    pub has_food_allergy: String,
    pub has_food_intolerance: String,
    pub foods_avoided: String,
    pub avoidance_reason: String,
    pub dislikes: String,
    pub therapeutic_diet: String,
    pub dietary_pattern: String,
    pub religious_or_cultural_requirement: String,
    pub fasting_practice: String,
    pub texture_modified_diet: String,
    pub texture_modified_iddsi_level: String,
    pub preferences_notes: String,
    pub appetite_change: String,
    pub early_satiety: String,
    pub nausea: String,
    pub vomiting: String,
    pub dysphagia: String,
    pub dysphagia_screen_outcome: String,
    pub speech_and_language_therapy: String,
    pub reflux: String,
    pub abdominal_pain: String,
    pub bloating: String,
    pub bowel_frequency_per_week: Option<i32>,
    pub bristol_stool_type: String,
    pub constipation: String,
    pub diarrhoea: String,
    pub stoma_present: String,
    pub stoma_output_ml_per_day: Option<i32>,
    pub malabsorption_signs: String,
    pub gastrointestinal_notes: String,
    pub living_situation: String,
    pub who_shops: String,
    pub who_cooks: String,
    pub cooking_skills: String,
    pub cooking_confidence_0_10: Option<i32>,
    pub has_cooker: String,
    pub has_fridge: String,
    pub has_freezer: String,
    pub has_microwave: String,
    pub food_budget_per_week: Option<f64>,
    pub worried_food_would_run_out: String,
    pub skipped_meals_for_money: String,
    pub uses_food_bank: String,
    pub access_to_shops: String,
    pub has_transport: String,
    pub work_pattern: String,
    pub meal_support: String,
    pub social_support: String,
    pub environment_notes: String,
    pub activity_level: String,
    pub exercise_type: String,
    pub exercise_minutes_per_week: Option<i32>,
    pub sedentary_hours_per_day: Option<f64>,
    pub mobility: String,
    pub falls_in_last_12_months: Option<i32>,
    pub sarcf_strength: Option<i32>,
    pub sarcf_walking: Option<i32>,
    pub sarcf_rising_from_chair: Option<i32>,
    pub sarcf_climbing_stairs: Option<i32>,
    pub sarcf_falls: Option<i32>,
    pub eats_independently: String,
    pub feeding_assistance_required: String,
    pub function_notes: String,
    pub motivation_0_10: Option<i32>,
    pub stage_of_change: String,
    pub self_efficacy_0_10: Option<i32>,
    pub previous_attempts: String,
    pub barriers: String,
    pub scoff_make_yourself_sick: String,
    pub scoff_lost_control: String,
    pub scoff_lost_one_stone: String,
    pub scoff_believe_yourself_fat: String,
    pub scoff_food_dominates: String,
    pub mood: String,
    pub anxiety: String,
    pub cognitive_impairment: String,
    pub capacity_concern: String,
    pub safeguarding_concern: String,
    pub health_literacy: String,
    pub preferred_learning_style: String,
    pub patient_goal_in_own_words: String,
    pub acutely_ill: String,
    pub no_nutritional_intake_over_5_days: String,
    pub days_of_negligible_intake: Option<i32>,
    pub nrs_2002_score: Option<i32>,
    pub energy_requirement_kcal: Option<i32>,
    pub protein_requirement_g: Option<i32>,
    pub fluid_requirement_ml: Option<i32>,
    pub requirement_equation: String,
    pub pes_problem: String,
    pub pes_etiology: String,
    pub pes_signs_symptoms: String,
    pub intervention_type: String,
    pub prescribed_supplement: String,
    pub prescribed_supplement_dose: String,
    pub texture_modification_plan: String,
    pub goal_1: String,
    pub goal_2: String,
    pub goal_3: String,
    pub education_provided: String,
    pub resources_given: String,
    pub monitoring_indicators: String,
    pub review_interval_weeks: Option<i32>,
    pub review_date: Option<Date>,
    pub onward_referral: String,
    pub additional_notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO dietic_assessments (patient_id, dietitian_id, status, \
            assessment_date, assessment_time, site_name, service_name, setting, \
            appointment_type, planned_duration_minutes, interpreter_required, \
            interpreter_language, referral_source, referral_date, referral_reason, \
            primary_condition, consent_to_record, accompanied_by, condition_diabetes, \
            condition_coeliac, condition_inflammatory_bowel_disease, \
            condition_chronic_kidney_disease, condition_liver_disease, condition_cancer, \
            condition_cardiovascular_disease, condition_respiratory_disease, \
            condition_stroke, condition_dementia, condition_eating_disorder, \
            condition_other, recent_surgery, recent_surgery_type, recent_surgery_date, \
            gastrointestinal_surgery, current_symptoms, family_history, \
            pregnancy_status, takes_prescription_medicines, \
            takes_over_the_counter_medicines, takes_vitamin_supplements, \
            takes_mineral_supplements, takes_herbal_products, \
            takes_oral_nutritional_supplements, oral_nutritional_supplement_detail, \
            enteral_nutrition, enteral_route, enteral_tube_problem, \
            parenteral_nutrition, drug_nutrient_interaction, \
            drug_nutrient_interaction_detail, medication_adherence, medication_notes, \
            measurement_method, height_as_cm, weight_as_kg, body_mass_index, \
            mid_upper_arm_circumference_as_cm, calf_circumference_as_cm, waist_as_cm, \
            usual_weight_as_kg, weight_3_months_ago_as_kg, weight_6_months_ago_as_kg, \
            weight_loss_percent, weight_loss_is_intentional, weight_trend, \
            clothes_or_jewellery_looser, oedema_present, oedema_adjustment_kg, \
            ascites_present, amputation_present, amputation_adjustment_percent, \
            anthropometry_notes, bloods_sample_date, albumin_g_per_l, \
            c_reactive_protein_mg_per_l, haemoglobin_g_per_l, ferritin_ug_per_l, \
            vitamin_b12_ng_per_l, folate_ug_per_l, vitamin_d_nmol_per_l, \
            hba1c_mmol_per_mol, sodium_mmol_per_l, potassium_mmol_per_l, \
            magnesium_mmol_per_l, phosphate_mmol_per_l, corrected_calcium_mmol_per_l, \
            urea_mmol_per_l, creatinine_umol_per_l, egfr_ml_per_min, \
            alanine_aminotransferase_u_per_l, bilirubin_umol_per_l, \
            total_cholesterol_mmol_per_l, triglycerides_mmol_per_l, biochemistry_notes, \
            subcutaneous_fat_loss, muscle_wasting_temples, muscle_wasting_clavicles, \
            muscle_wasting_quadriceps, muscle_wasting_severity, \
            peripheral_oedema_severity, oral_health, dentition, chewing_ability, \
            tongue_and_mucosa, skin_condition, hair_condition, nail_condition, \
            pressure_ulcer_present, pressure_ulcer_category, hand_grip_strength_kg, \
            physical_exam_notes, meals_per_day, snacks_per_day, recall_breakfast, \
            recall_mid_morning, recall_lunch, recall_afternoon, recall_dinner, \
            recall_evening, portion_size, appetite, appetite_score_0_10, \
            proportion_of_usual_intake_percent, meals_out_per_week, takeaways_per_week, \
            food_diary_completed, estimated_energy_intake_kcal, \
            estimated_protein_intake_g, eats_alone, dietary_recall_notes, \
            fluid_intake_ml_per_day, fluid_types, caffeinated_drinks_per_day, \
            alcohol_units_per_week, thickened_fluids, thickened_fluids_iddsi_level, \
            hydration_signs, fluid_restriction, fluid_restriction_ml_per_day, \
            hydration_notes, has_food_allergy, has_food_intolerance, foods_avoided, \
            avoidance_reason, dislikes, therapeutic_diet, dietary_pattern, \
            religious_or_cultural_requirement, fasting_practice, texture_modified_diet, \
            texture_modified_iddsi_level, preferences_notes, appetite_change, \
            early_satiety, nausea, vomiting, dysphagia, dysphagia_screen_outcome, \
            speech_and_language_therapy, reflux, abdominal_pain, bloating, \
            bowel_frequency_per_week, bristol_stool_type, constipation, diarrhoea, \
            stoma_present, stoma_output_ml_per_day, malabsorption_signs, \
            gastrointestinal_notes, living_situation, who_shops, who_cooks, \
            cooking_skills, cooking_confidence_0_10, has_cooker, has_fridge, \
            has_freezer, has_microwave, food_budget_per_week, \
            worried_food_would_run_out, skipped_meals_for_money, uses_food_bank, \
            access_to_shops, has_transport, work_pattern, meal_support, social_support, \
            environment_notes, activity_level, exercise_type, exercise_minutes_per_week, \
            sedentary_hours_per_day, mobility, falls_in_last_12_months, sarcf_strength, \
            sarcf_walking, sarcf_rising_from_chair, sarcf_climbing_stairs, sarcf_falls, \
            eats_independently, feeding_assistance_required, function_notes, \
            motivation_0_10, stage_of_change, self_efficacy_0_10, previous_attempts, \
            barriers, scoff_make_yourself_sick, scoff_lost_control, \
            scoff_lost_one_stone, scoff_believe_yourself_fat, scoff_food_dominates, \
            mood, anxiety, cognitive_impairment, capacity_concern, safeguarding_concern, \
            health_literacy, preferred_learning_style, patient_goal_in_own_words, \
            acutely_ill, no_nutritional_intake_over_5_days, days_of_negligible_intake, \
            nrs_2002_score, energy_requirement_kcal, protein_requirement_g, \
            fluid_requirement_ml, requirement_equation, pes_problem, pes_etiology, \
            pes_signs_symptoms, intervention_type, prescribed_supplement, \
            prescribed_supplement_dose, texture_modification_plan, goal_1, goal_2, \
            goal_3, education_provided, resources_given, monitoring_indicators, \
            review_interval_weeks, review_date, onward_referral, additional_notes) \
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, \
            $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, \
            $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, \
            $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, \
            $61, $62, $63, $64, $65, $66, $67, $68, $69, $70, $71, $72, $73, $74, $75, \
            $76, $77, $78, $79, $80, $81, $82, $83, $84, $85, $86, $87, $88, $89, $90, \
            $91, $92, $93, $94, $95, $96, $97, $98, $99, $100, $101, $102, $103, $104, \
            $105, $106, $107, $108, $109, $110, $111, $112, $113, $114, $115, $116, \
            $117, $118, $119, $120, $121, $122, $123, $124, $125, $126, $127, $128, \
            $129, $130, $131, $132, $133, $134, $135, $136, $137, $138, $139, $140, \
            $141, $142, $143, $144, $145, $146, $147, $148, $149, $150, $151, $152, \
            $153, $154, $155, $156, $157, $158, $159, $160, $161, $162, $163, $164, \
            $165, $166, $167, $168, $169, $170, $171, $172, $173, $174, $175, $176, \
            $177, $178, $179, $180, $181, $182, $183, $184, $185, $186, $187, $188, \
            $189, $190, $191, $192, $193, $194, $195, $196, $197, $198, $199, $200, \
            $201, $202, $203, $204, $205, $206, $207, $208, $209, $210, $211, $212, \
            $213, $214, $215, $216, $217, $218, $219, $220, $221, $222, $223, $224, \
            $225, $226, $227, $228, $229, $230, $231, $232, $233, $234, $235, $236, \
            $237, $238, $239, $240, $241, $242, $243, $244, $245, $246) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.dietitian_id)
        .bind(&self.status)
        .bind(self.assessment_date)
        .bind(&self.assessment_time)
        .bind(&self.site_name)
        .bind(&self.service_name)
        .bind(&self.setting)
        .bind(&self.appointment_type)
        .bind(self.planned_duration_minutes)
        .bind(&self.interpreter_required)
        .bind(&self.interpreter_language)
        .bind(&self.referral_source)
        .bind(self.referral_date)
        .bind(&self.referral_reason)
        .bind(&self.primary_condition)
        .bind(&self.consent_to_record)
        .bind(&self.accompanied_by)
        .bind(&self.condition_diabetes)
        .bind(&self.condition_coeliac)
        .bind(&self.condition_inflammatory_bowel_disease)
        .bind(&self.condition_chronic_kidney_disease)
        .bind(&self.condition_liver_disease)
        .bind(&self.condition_cancer)
        .bind(&self.condition_cardiovascular_disease)
        .bind(&self.condition_respiratory_disease)
        .bind(&self.condition_stroke)
        .bind(&self.condition_dementia)
        .bind(&self.condition_eating_disorder)
        .bind(&self.condition_other)
        .bind(&self.recent_surgery)
        .bind(&self.recent_surgery_type)
        .bind(self.recent_surgery_date)
        .bind(&self.gastrointestinal_surgery)
        .bind(&self.current_symptoms)
        .bind(&self.family_history)
        .bind(&self.pregnancy_status)
        .bind(&self.takes_prescription_medicines)
        .bind(&self.takes_over_the_counter_medicines)
        .bind(&self.takes_vitamin_supplements)
        .bind(&self.takes_mineral_supplements)
        .bind(&self.takes_herbal_products)
        .bind(&self.takes_oral_nutritional_supplements)
        .bind(&self.oral_nutritional_supplement_detail)
        .bind(&self.enteral_nutrition)
        .bind(&self.enteral_route)
        .bind(&self.enteral_tube_problem)
        .bind(&self.parenteral_nutrition)
        .bind(&self.drug_nutrient_interaction)
        .bind(&self.drug_nutrient_interaction_detail)
        .bind(&self.medication_adherence)
        .bind(&self.medication_notes)
        .bind(&self.measurement_method)
        .bind(self.height_as_cm)
        .bind(self.weight_as_kg)
        .bind(self.body_mass_index)
        .bind(self.mid_upper_arm_circumference_as_cm)
        .bind(self.calf_circumference_as_cm)
        .bind(self.waist_as_cm)
        .bind(self.usual_weight_as_kg)
        .bind(self.weight_3_months_ago_as_kg)
        .bind(self.weight_6_months_ago_as_kg)
        .bind(self.weight_loss_percent)
        .bind(&self.weight_loss_is_intentional)
        .bind(&self.weight_trend)
        .bind(&self.clothes_or_jewellery_looser)
        .bind(&self.oedema_present)
        .bind(self.oedema_adjustment_kg)
        .bind(&self.ascites_present)
        .bind(&self.amputation_present)
        .bind(self.amputation_adjustment_percent)
        .bind(&self.anthropometry_notes)
        .bind(self.bloods_sample_date)
        .bind(self.albumin_g_per_l)
        .bind(self.c_reactive_protein_mg_per_l)
        .bind(self.haemoglobin_g_per_l)
        .bind(self.ferritin_ug_per_l)
        .bind(self.vitamin_b12_ng_per_l)
        .bind(self.folate_ug_per_l)
        .bind(self.vitamin_d_nmol_per_l)
        .bind(self.hba1c_mmol_per_mol)
        .bind(self.sodium_mmol_per_l)
        .bind(self.potassium_mmol_per_l)
        .bind(self.magnesium_mmol_per_l)
        .bind(self.phosphate_mmol_per_l)
        .bind(self.corrected_calcium_mmol_per_l)
        .bind(self.urea_mmol_per_l)
        .bind(self.creatinine_umol_per_l)
        .bind(self.egfr_ml_per_min)
        .bind(self.alanine_aminotransferase_u_per_l)
        .bind(self.bilirubin_umol_per_l)
        .bind(self.total_cholesterol_mmol_per_l)
        .bind(self.triglycerides_mmol_per_l)
        .bind(&self.biochemistry_notes)
        .bind(&self.subcutaneous_fat_loss)
        .bind(&self.muscle_wasting_temples)
        .bind(&self.muscle_wasting_clavicles)
        .bind(&self.muscle_wasting_quadriceps)
        .bind(&self.muscle_wasting_severity)
        .bind(&self.peripheral_oedema_severity)
        .bind(&self.oral_health)
        .bind(&self.dentition)
        .bind(&self.chewing_ability)
        .bind(&self.tongue_and_mucosa)
        .bind(&self.skin_condition)
        .bind(&self.hair_condition)
        .bind(&self.nail_condition)
        .bind(&self.pressure_ulcer_present)
        .bind(&self.pressure_ulcer_category)
        .bind(self.hand_grip_strength_kg)
        .bind(&self.physical_exam_notes)
        .bind(self.meals_per_day)
        .bind(self.snacks_per_day)
        .bind(&self.recall_breakfast)
        .bind(&self.recall_mid_morning)
        .bind(&self.recall_lunch)
        .bind(&self.recall_afternoon)
        .bind(&self.recall_dinner)
        .bind(&self.recall_evening)
        .bind(&self.portion_size)
        .bind(&self.appetite)
        .bind(self.appetite_score_0_10)
        .bind(self.proportion_of_usual_intake_percent)
        .bind(self.meals_out_per_week)
        .bind(self.takeaways_per_week)
        .bind(&self.food_diary_completed)
        .bind(self.estimated_energy_intake_kcal)
        .bind(self.estimated_protein_intake_g)
        .bind(&self.eats_alone)
        .bind(&self.dietary_recall_notes)
        .bind(self.fluid_intake_ml_per_day)
        .bind(&self.fluid_types)
        .bind(self.caffeinated_drinks_per_day)
        .bind(self.alcohol_units_per_week)
        .bind(&self.thickened_fluids)
        .bind(&self.thickened_fluids_iddsi_level)
        .bind(&self.hydration_signs)
        .bind(&self.fluid_restriction)
        .bind(self.fluid_restriction_ml_per_day)
        .bind(&self.hydration_notes)
        .bind(&self.has_food_allergy)
        .bind(&self.has_food_intolerance)
        .bind(&self.foods_avoided)
        .bind(&self.avoidance_reason)
        .bind(&self.dislikes)
        .bind(&self.therapeutic_diet)
        .bind(&self.dietary_pattern)
        .bind(&self.religious_or_cultural_requirement)
        .bind(&self.fasting_practice)
        .bind(&self.texture_modified_diet)
        .bind(&self.texture_modified_iddsi_level)
        .bind(&self.preferences_notes)
        .bind(&self.appetite_change)
        .bind(&self.early_satiety)
        .bind(&self.nausea)
        .bind(&self.vomiting)
        .bind(&self.dysphagia)
        .bind(&self.dysphagia_screen_outcome)
        .bind(&self.speech_and_language_therapy)
        .bind(&self.reflux)
        .bind(&self.abdominal_pain)
        .bind(&self.bloating)
        .bind(self.bowel_frequency_per_week)
        .bind(&self.bristol_stool_type)
        .bind(&self.constipation)
        .bind(&self.diarrhoea)
        .bind(&self.stoma_present)
        .bind(self.stoma_output_ml_per_day)
        .bind(&self.malabsorption_signs)
        .bind(&self.gastrointestinal_notes)
        .bind(&self.living_situation)
        .bind(&self.who_shops)
        .bind(&self.who_cooks)
        .bind(&self.cooking_skills)
        .bind(self.cooking_confidence_0_10)
        .bind(&self.has_cooker)
        .bind(&self.has_fridge)
        .bind(&self.has_freezer)
        .bind(&self.has_microwave)
        .bind(self.food_budget_per_week)
        .bind(&self.worried_food_would_run_out)
        .bind(&self.skipped_meals_for_money)
        .bind(&self.uses_food_bank)
        .bind(&self.access_to_shops)
        .bind(&self.has_transport)
        .bind(&self.work_pattern)
        .bind(&self.meal_support)
        .bind(&self.social_support)
        .bind(&self.environment_notes)
        .bind(&self.activity_level)
        .bind(&self.exercise_type)
        .bind(self.exercise_minutes_per_week)
        .bind(self.sedentary_hours_per_day)
        .bind(&self.mobility)
        .bind(self.falls_in_last_12_months)
        .bind(self.sarcf_strength)
        .bind(self.sarcf_walking)
        .bind(self.sarcf_rising_from_chair)
        .bind(self.sarcf_climbing_stairs)
        .bind(self.sarcf_falls)
        .bind(&self.eats_independently)
        .bind(&self.feeding_assistance_required)
        .bind(&self.function_notes)
        .bind(self.motivation_0_10)
        .bind(&self.stage_of_change)
        .bind(self.self_efficacy_0_10)
        .bind(&self.previous_attempts)
        .bind(&self.barriers)
        .bind(&self.scoff_make_yourself_sick)
        .bind(&self.scoff_lost_control)
        .bind(&self.scoff_lost_one_stone)
        .bind(&self.scoff_believe_yourself_fat)
        .bind(&self.scoff_food_dominates)
        .bind(&self.mood)
        .bind(&self.anxiety)
        .bind(&self.cognitive_impairment)
        .bind(&self.capacity_concern)
        .bind(&self.safeguarding_concern)
        .bind(&self.health_literacy)
        .bind(&self.preferred_learning_style)
        .bind(&self.patient_goal_in_own_words)
        .bind(&self.acutely_ill)
        .bind(&self.no_nutritional_intake_over_5_days)
        .bind(self.days_of_negligible_intake)
        .bind(self.nrs_2002_score)
        .bind(self.energy_requirement_kcal)
        .bind(self.protein_requirement_g)
        .bind(self.fluid_requirement_ml)
        .bind(&self.requirement_equation)
        .bind(&self.pes_problem)
        .bind(&self.pes_etiology)
        .bind(&self.pes_signs_symptoms)
        .bind(&self.intervention_type)
        .bind(&self.prescribed_supplement)
        .bind(&self.prescribed_supplement_dose)
        .bind(&self.texture_modification_plan)
        .bind(&self.goal_1)
        .bind(&self.goal_2)
        .bind(&self.goal_3)
        .bind(&self.education_provided)
        .bind(&self.resources_given)
        .bind(&self.monitoring_indicators)
        .bind(self.review_interval_weeks)
        .bind(self.review_date)
        .bind(&self.onward_referral)
        .bind(&self.additional_notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE dietic_assessments SET patient_id = $2, dietitian_id = $3, status = \
            $4, assessment_date = $5, assessment_time = $6, site_name = $7, service_name \
            = $8, setting = $9, appointment_type = $10, planned_duration_minutes = $11, \
            interpreter_required = $12, interpreter_language = $13, referral_source = \
            $14, referral_date = $15, referral_reason = $16, primary_condition = $17, \
            consent_to_record = $18, accompanied_by = $19, condition_diabetes = $20, \
            condition_coeliac = $21, condition_inflammatory_bowel_disease = $22, \
            condition_chronic_kidney_disease = $23, condition_liver_disease = $24, \
            condition_cancer = $25, condition_cardiovascular_disease = $26, \
            condition_respiratory_disease = $27, condition_stroke = $28, \
            condition_dementia = $29, condition_eating_disorder = $30, condition_other = \
            $31, recent_surgery = $32, recent_surgery_type = $33, recent_surgery_date = \
            $34, gastrointestinal_surgery = $35, current_symptoms = $36, family_history \
            = $37, pregnancy_status = $38, takes_prescription_medicines = $39, \
            takes_over_the_counter_medicines = $40, takes_vitamin_supplements = $41, \
            takes_mineral_supplements = $42, takes_herbal_products = $43, \
            takes_oral_nutritional_supplements = $44, oral_nutritional_supplement_detail \
            = $45, enteral_nutrition = $46, enteral_route = $47, enteral_tube_problem = \
            $48, parenteral_nutrition = $49, drug_nutrient_interaction = $50, \
            drug_nutrient_interaction_detail = $51, medication_adherence = $52, \
            medication_notes = $53, measurement_method = $54, height_as_cm = $55, \
            weight_as_kg = $56, body_mass_index = $57, mid_upper_arm_circumference_as_cm \
            = $58, calf_circumference_as_cm = $59, waist_as_cm = $60, usual_weight_as_kg \
            = $61, weight_3_months_ago_as_kg = $62, weight_6_months_ago_as_kg = $63, \
            weight_loss_percent = $64, weight_loss_is_intentional = $65, weight_trend = \
            $66, clothes_or_jewellery_looser = $67, oedema_present = $68, \
            oedema_adjustment_kg = $69, ascites_present = $70, amputation_present = $71, \
            amputation_adjustment_percent = $72, anthropometry_notes = $73, \
            bloods_sample_date = $74, albumin_g_per_l = $75, c_reactive_protein_mg_per_l \
            = $76, haemoglobin_g_per_l = $77, ferritin_ug_per_l = $78, \
            vitamin_b12_ng_per_l = $79, folate_ug_per_l = $80, vitamin_d_nmol_per_l = \
            $81, hba1c_mmol_per_mol = $82, sodium_mmol_per_l = $83, potassium_mmol_per_l \
            = $84, magnesium_mmol_per_l = $85, phosphate_mmol_per_l = $86, \
            corrected_calcium_mmol_per_l = $87, urea_mmol_per_l = $88, \
            creatinine_umol_per_l = $89, egfr_ml_per_min = $90, \
            alanine_aminotransferase_u_per_l = $91, bilirubin_umol_per_l = $92, \
            total_cholesterol_mmol_per_l = $93, triglycerides_mmol_per_l = $94, \
            biochemistry_notes = $95, subcutaneous_fat_loss = $96, \
            muscle_wasting_temples = $97, muscle_wasting_clavicles = $98, \
            muscle_wasting_quadriceps = $99, muscle_wasting_severity = $100, \
            peripheral_oedema_severity = $101, oral_health = $102, dentition = $103, \
            chewing_ability = $104, tongue_and_mucosa = $105, skin_condition = $106, \
            hair_condition = $107, nail_condition = $108, pressure_ulcer_present = $109, \
            pressure_ulcer_category = $110, hand_grip_strength_kg = $111, \
            physical_exam_notes = $112, meals_per_day = $113, snacks_per_day = $114, \
            recall_breakfast = $115, recall_mid_morning = $116, recall_lunch = $117, \
            recall_afternoon = $118, recall_dinner = $119, recall_evening = $120, \
            portion_size = $121, appetite = $122, appetite_score_0_10 = $123, \
            proportion_of_usual_intake_percent = $124, meals_out_per_week = $125, \
            takeaways_per_week = $126, food_diary_completed = $127, \
            estimated_energy_intake_kcal = $128, estimated_protein_intake_g = $129, \
            eats_alone = $130, dietary_recall_notes = $131, fluid_intake_ml_per_day = \
            $132, fluid_types = $133, caffeinated_drinks_per_day = $134, \
            alcohol_units_per_week = $135, thickened_fluids = $136, \
            thickened_fluids_iddsi_level = $137, hydration_signs = $138, \
            fluid_restriction = $139, fluid_restriction_ml_per_day = $140, \
            hydration_notes = $141, has_food_allergy = $142, has_food_intolerance = \
            $143, foods_avoided = $144, avoidance_reason = $145, dislikes = $146, \
            therapeutic_diet = $147, dietary_pattern = $148, \
            religious_or_cultural_requirement = $149, fasting_practice = $150, \
            texture_modified_diet = $151, texture_modified_iddsi_level = $152, \
            preferences_notes = $153, appetite_change = $154, early_satiety = $155, \
            nausea = $156, vomiting = $157, dysphagia = $158, dysphagia_screen_outcome = \
            $159, speech_and_language_therapy = $160, reflux = $161, abdominal_pain = \
            $162, bloating = $163, bowel_frequency_per_week = $164, bristol_stool_type = \
            $165, constipation = $166, diarrhoea = $167, stoma_present = $168, \
            stoma_output_ml_per_day = $169, malabsorption_signs = $170, \
            gastrointestinal_notes = $171, living_situation = $172, who_shops = $173, \
            who_cooks = $174, cooking_skills = $175, cooking_confidence_0_10 = $176, \
            has_cooker = $177, has_fridge = $178, has_freezer = $179, has_microwave = \
            $180, food_budget_per_week = $181, worried_food_would_run_out = $182, \
            skipped_meals_for_money = $183, uses_food_bank = $184, access_to_shops = \
            $185, has_transport = $186, work_pattern = $187, meal_support = $188, \
            social_support = $189, environment_notes = $190, activity_level = $191, \
            exercise_type = $192, exercise_minutes_per_week = $193, \
            sedentary_hours_per_day = $194, mobility = $195, falls_in_last_12_months = \
            $196, sarcf_strength = $197, sarcf_walking = $198, sarcf_rising_from_chair = \
            $199, sarcf_climbing_stairs = $200, sarcf_falls = $201, eats_independently = \
            $202, feeding_assistance_required = $203, function_notes = $204, \
            motivation_0_10 = $205, stage_of_change = $206, self_efficacy_0_10 = $207, \
            previous_attempts = $208, barriers = $209, scoff_make_yourself_sick = $210, \
            scoff_lost_control = $211, scoff_lost_one_stone = $212, \
            scoff_believe_yourself_fat = $213, scoff_food_dominates = $214, mood = $215, \
            anxiety = $216, cognitive_impairment = $217, capacity_concern = $218, \
            safeguarding_concern = $219, health_literacy = $220, \
            preferred_learning_style = $221, patient_goal_in_own_words = $222, \
            acutely_ill = $223, no_nutritional_intake_over_5_days = $224, \
            days_of_negligible_intake = $225, nrs_2002_score = $226, \
            energy_requirement_kcal = $227, protein_requirement_g = $228, \
            fluid_requirement_ml = $229, requirement_equation = $230, pes_problem = \
            $231, pes_etiology = $232, pes_signs_symptoms = $233, intervention_type = \
            $234, prescribed_supplement = $235, prescribed_supplement_dose = $236, \
            texture_modification_plan = $237, goal_1 = $238, goal_2 = $239, goal_3 = \
            $240, education_provided = $241, resources_given = $242, \
            monitoring_indicators = $243, review_interval_weeks = $244, review_date = \
            $245, onward_referral = $246, additional_notes = $247, updated_at = now() \
            WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.dietitian_id)
        .bind(&self.status)
        .bind(self.assessment_date)
        .bind(&self.assessment_time)
        .bind(&self.site_name)
        .bind(&self.service_name)
        .bind(&self.setting)
        .bind(&self.appointment_type)
        .bind(self.planned_duration_minutes)
        .bind(&self.interpreter_required)
        .bind(&self.interpreter_language)
        .bind(&self.referral_source)
        .bind(self.referral_date)
        .bind(&self.referral_reason)
        .bind(&self.primary_condition)
        .bind(&self.consent_to_record)
        .bind(&self.accompanied_by)
        .bind(&self.condition_diabetes)
        .bind(&self.condition_coeliac)
        .bind(&self.condition_inflammatory_bowel_disease)
        .bind(&self.condition_chronic_kidney_disease)
        .bind(&self.condition_liver_disease)
        .bind(&self.condition_cancer)
        .bind(&self.condition_cardiovascular_disease)
        .bind(&self.condition_respiratory_disease)
        .bind(&self.condition_stroke)
        .bind(&self.condition_dementia)
        .bind(&self.condition_eating_disorder)
        .bind(&self.condition_other)
        .bind(&self.recent_surgery)
        .bind(&self.recent_surgery_type)
        .bind(self.recent_surgery_date)
        .bind(&self.gastrointestinal_surgery)
        .bind(&self.current_symptoms)
        .bind(&self.family_history)
        .bind(&self.pregnancy_status)
        .bind(&self.takes_prescription_medicines)
        .bind(&self.takes_over_the_counter_medicines)
        .bind(&self.takes_vitamin_supplements)
        .bind(&self.takes_mineral_supplements)
        .bind(&self.takes_herbal_products)
        .bind(&self.takes_oral_nutritional_supplements)
        .bind(&self.oral_nutritional_supplement_detail)
        .bind(&self.enteral_nutrition)
        .bind(&self.enteral_route)
        .bind(&self.enteral_tube_problem)
        .bind(&self.parenteral_nutrition)
        .bind(&self.drug_nutrient_interaction)
        .bind(&self.drug_nutrient_interaction_detail)
        .bind(&self.medication_adherence)
        .bind(&self.medication_notes)
        .bind(&self.measurement_method)
        .bind(self.height_as_cm)
        .bind(self.weight_as_kg)
        .bind(self.body_mass_index)
        .bind(self.mid_upper_arm_circumference_as_cm)
        .bind(self.calf_circumference_as_cm)
        .bind(self.waist_as_cm)
        .bind(self.usual_weight_as_kg)
        .bind(self.weight_3_months_ago_as_kg)
        .bind(self.weight_6_months_ago_as_kg)
        .bind(self.weight_loss_percent)
        .bind(&self.weight_loss_is_intentional)
        .bind(&self.weight_trend)
        .bind(&self.clothes_or_jewellery_looser)
        .bind(&self.oedema_present)
        .bind(self.oedema_adjustment_kg)
        .bind(&self.ascites_present)
        .bind(&self.amputation_present)
        .bind(self.amputation_adjustment_percent)
        .bind(&self.anthropometry_notes)
        .bind(self.bloods_sample_date)
        .bind(self.albumin_g_per_l)
        .bind(self.c_reactive_protein_mg_per_l)
        .bind(self.haemoglobin_g_per_l)
        .bind(self.ferritin_ug_per_l)
        .bind(self.vitamin_b12_ng_per_l)
        .bind(self.folate_ug_per_l)
        .bind(self.vitamin_d_nmol_per_l)
        .bind(self.hba1c_mmol_per_mol)
        .bind(self.sodium_mmol_per_l)
        .bind(self.potassium_mmol_per_l)
        .bind(self.magnesium_mmol_per_l)
        .bind(self.phosphate_mmol_per_l)
        .bind(self.corrected_calcium_mmol_per_l)
        .bind(self.urea_mmol_per_l)
        .bind(self.creatinine_umol_per_l)
        .bind(self.egfr_ml_per_min)
        .bind(self.alanine_aminotransferase_u_per_l)
        .bind(self.bilirubin_umol_per_l)
        .bind(self.total_cholesterol_mmol_per_l)
        .bind(self.triglycerides_mmol_per_l)
        .bind(&self.biochemistry_notes)
        .bind(&self.subcutaneous_fat_loss)
        .bind(&self.muscle_wasting_temples)
        .bind(&self.muscle_wasting_clavicles)
        .bind(&self.muscle_wasting_quadriceps)
        .bind(&self.muscle_wasting_severity)
        .bind(&self.peripheral_oedema_severity)
        .bind(&self.oral_health)
        .bind(&self.dentition)
        .bind(&self.chewing_ability)
        .bind(&self.tongue_and_mucosa)
        .bind(&self.skin_condition)
        .bind(&self.hair_condition)
        .bind(&self.nail_condition)
        .bind(&self.pressure_ulcer_present)
        .bind(&self.pressure_ulcer_category)
        .bind(self.hand_grip_strength_kg)
        .bind(&self.physical_exam_notes)
        .bind(self.meals_per_day)
        .bind(self.snacks_per_day)
        .bind(&self.recall_breakfast)
        .bind(&self.recall_mid_morning)
        .bind(&self.recall_lunch)
        .bind(&self.recall_afternoon)
        .bind(&self.recall_dinner)
        .bind(&self.recall_evening)
        .bind(&self.portion_size)
        .bind(&self.appetite)
        .bind(self.appetite_score_0_10)
        .bind(self.proportion_of_usual_intake_percent)
        .bind(self.meals_out_per_week)
        .bind(self.takeaways_per_week)
        .bind(&self.food_diary_completed)
        .bind(self.estimated_energy_intake_kcal)
        .bind(self.estimated_protein_intake_g)
        .bind(&self.eats_alone)
        .bind(&self.dietary_recall_notes)
        .bind(self.fluid_intake_ml_per_day)
        .bind(&self.fluid_types)
        .bind(self.caffeinated_drinks_per_day)
        .bind(self.alcohol_units_per_week)
        .bind(&self.thickened_fluids)
        .bind(&self.thickened_fluids_iddsi_level)
        .bind(&self.hydration_signs)
        .bind(&self.fluid_restriction)
        .bind(self.fluid_restriction_ml_per_day)
        .bind(&self.hydration_notes)
        .bind(&self.has_food_allergy)
        .bind(&self.has_food_intolerance)
        .bind(&self.foods_avoided)
        .bind(&self.avoidance_reason)
        .bind(&self.dislikes)
        .bind(&self.therapeutic_diet)
        .bind(&self.dietary_pattern)
        .bind(&self.religious_or_cultural_requirement)
        .bind(&self.fasting_practice)
        .bind(&self.texture_modified_diet)
        .bind(&self.texture_modified_iddsi_level)
        .bind(&self.preferences_notes)
        .bind(&self.appetite_change)
        .bind(&self.early_satiety)
        .bind(&self.nausea)
        .bind(&self.vomiting)
        .bind(&self.dysphagia)
        .bind(&self.dysphagia_screen_outcome)
        .bind(&self.speech_and_language_therapy)
        .bind(&self.reflux)
        .bind(&self.abdominal_pain)
        .bind(&self.bloating)
        .bind(self.bowel_frequency_per_week)
        .bind(&self.bristol_stool_type)
        .bind(&self.constipation)
        .bind(&self.diarrhoea)
        .bind(&self.stoma_present)
        .bind(self.stoma_output_ml_per_day)
        .bind(&self.malabsorption_signs)
        .bind(&self.gastrointestinal_notes)
        .bind(&self.living_situation)
        .bind(&self.who_shops)
        .bind(&self.who_cooks)
        .bind(&self.cooking_skills)
        .bind(self.cooking_confidence_0_10)
        .bind(&self.has_cooker)
        .bind(&self.has_fridge)
        .bind(&self.has_freezer)
        .bind(&self.has_microwave)
        .bind(self.food_budget_per_week)
        .bind(&self.worried_food_would_run_out)
        .bind(&self.skipped_meals_for_money)
        .bind(&self.uses_food_bank)
        .bind(&self.access_to_shops)
        .bind(&self.has_transport)
        .bind(&self.work_pattern)
        .bind(&self.meal_support)
        .bind(&self.social_support)
        .bind(&self.environment_notes)
        .bind(&self.activity_level)
        .bind(&self.exercise_type)
        .bind(self.exercise_minutes_per_week)
        .bind(self.sedentary_hours_per_day)
        .bind(&self.mobility)
        .bind(self.falls_in_last_12_months)
        .bind(self.sarcf_strength)
        .bind(self.sarcf_walking)
        .bind(self.sarcf_rising_from_chair)
        .bind(self.sarcf_climbing_stairs)
        .bind(self.sarcf_falls)
        .bind(&self.eats_independently)
        .bind(&self.feeding_assistance_required)
        .bind(&self.function_notes)
        .bind(self.motivation_0_10)
        .bind(&self.stage_of_change)
        .bind(self.self_efficacy_0_10)
        .bind(&self.previous_attempts)
        .bind(&self.barriers)
        .bind(&self.scoff_make_yourself_sick)
        .bind(&self.scoff_lost_control)
        .bind(&self.scoff_lost_one_stone)
        .bind(&self.scoff_believe_yourself_fat)
        .bind(&self.scoff_food_dominates)
        .bind(&self.mood)
        .bind(&self.anxiety)
        .bind(&self.cognitive_impairment)
        .bind(&self.capacity_concern)
        .bind(&self.safeguarding_concern)
        .bind(&self.health_literacy)
        .bind(&self.preferred_learning_style)
        .bind(&self.patient_goal_in_own_words)
        .bind(&self.acutely_ill)
        .bind(&self.no_nutritional_intake_over_5_days)
        .bind(self.days_of_negligible_intake)
        .bind(self.nrs_2002_score)
        .bind(self.energy_requirement_kcal)
        .bind(self.protein_requirement_g)
        .bind(self.fluid_requirement_ml)
        .bind(&self.requirement_equation)
        .bind(&self.pes_problem)
        .bind(&self.pes_etiology)
        .bind(&self.pes_signs_symptoms)
        .bind(&self.intervention_type)
        .bind(&self.prescribed_supplement)
        .bind(&self.prescribed_supplement_dose)
        .bind(&self.texture_modification_plan)
        .bind(&self.goal_1)
        .bind(&self.goal_2)
        .bind(&self.goal_3)
        .bind(&self.education_provided)
        .bind(&self.resources_given)
        .bind(&self.monitoring_indicators)
        .bind(self.review_interval_weeks)
        .bind(self.review_date)
        .bind(&self.onward_referral)
        .bind(&self.additional_notes)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = params.resolve(PAGE_LIMITS)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    Ok(page.respond(total, rows))
}

#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/dietic_assessments/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
