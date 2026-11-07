#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::health_screening_questionnaires::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub assessor_id: Uuid,
    pub status: String,
    pub screening_purpose: String,
    pub site_name: String,
    pub assessment_date: Option<Date>,
    pub assessment_mode: String,
    pub usual_activity_level: String,
    pub moderate_exercise_days_per_week: Option<i32>,
    pub fruit_and_vegetable_portions_per_day: Option<i32>,
    pub diet_notes: String,
    pub smoking_status: String,
    pub cigarettes_per_day: Option<i32>,
    pub audit_c_frequency: Option<i32>,
    pub audit_c_typical_quantity: Option<i32>,
    pub audit_c_binge_frequency: Option<i32>,
    pub condition_diabetes: String,
    pub condition_hypertension: String,
    pub condition_asthma: String,
    pub condition_copd: String,
    pub condition_heart_disease: String,
    pub condition_kidney_disease: String,
    pub condition_thyroid: String,
    pub condition_other: String,
    pub past_surgeries: String,
    pub current_medications: String,
    pub known_drug_allergies: String,
    pub family_history_premature_cardiac_event: String,
    pub family_history_other: String,
    pub symptom_unexplained_chest_pain: String,
    pub symptom_dizzy_spells_or_fainting: String,
    pub symptom_persistent_cough_over_3_weeks: String,
    pub symptom_unexplained_weight_loss: String,
    pub symptom_joint_pain_restricting_movement: String,
    pub symptom_shortness_of_breath_on_exertion: String,
    pub symptom_palpitations: String,
    pub parq_diagnosed_heart_condition: String,
    pub parq_chest_pain_at_rest: String,
    pub parq_chest_pain_during_activity: String,
    pub parq_dizziness_or_loss_of_consciousness: String,
    pub parq_other_chronic_medical_condition: String,
    pub parq_prescribed_medication_for_chronic_condition: String,
    pub parq_bone_or_joint_problem: String,
    pub height_as_cm: Option<f64>,
    pub weight_as_kg: Option<f64>,
    pub body_mass_index: Option<f64>,
    pub resting_blood_pressure_systolic: Option<i32>,
    pub resting_blood_pressure_diastolic: Option<i32>,
    pub resting_heart_rate: Option<i32>,
    pub job_role: String,
    pub physical_demands_of_role: String,
    pub exposure_noise: String,
    pub exposure_chemicals: String,
    pub exposure_manual_handling: String,
    pub exposure_other: String,
    pub exposure_other_detail: String,
    pub stress_level: Option<i32>,
    pub sleep_quality: Option<i32>,
    pub mental_health_concern: String,
    pub mental_health_concern_note: String,
    pub vaccination_up_to_date: String,
    pub vaccination_gaps_note: String,
    pub consent_to_screening: String,
    pub information_accurate_confirmed: String,
    pub interpreter_required: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO health_screening_questionnaires (patient_id, assessor_id, \
            status, screening_purpose, site_name, assessment_date, assessment_mode, \
            usual_activity_level, moderate_exercise_days_per_week, \
            fruit_and_vegetable_portions_per_day, diet_notes, smoking_status, \
            cigarettes_per_day, audit_c_frequency, audit_c_typical_quantity, \
            audit_c_binge_frequency, condition_diabetes, condition_hypertension, \
            condition_asthma, condition_copd, condition_heart_disease, \
            condition_kidney_disease, condition_thyroid, condition_other, \
            past_surgeries, current_medications, known_drug_allergies, \
            family_history_premature_cardiac_event, family_history_other, \
            symptom_unexplained_chest_pain, symptom_dizzy_spells_or_fainting, \
            symptom_persistent_cough_over_3_weeks, symptom_unexplained_weight_loss, \
            symptom_joint_pain_restricting_movement, \
            symptom_shortness_of_breath_on_exertion, symptom_palpitations, \
            parq_diagnosed_heart_condition, parq_chest_pain_at_rest, \
            parq_chest_pain_during_activity, parq_dizziness_or_loss_of_consciousness, \
            parq_other_chronic_medical_condition, \
            parq_prescribed_medication_for_chronic_condition, \
            parq_bone_or_joint_problem, height_as_cm, weight_as_kg, body_mass_index, \
            resting_blood_pressure_systolic, resting_blood_pressure_diastolic, \
            resting_heart_rate, job_role, physical_demands_of_role, exposure_noise, \
            exposure_chemicals, exposure_manual_handling, exposure_other, \
            exposure_other_detail, stress_level, sleep_quality, mental_health_concern, \
            mental_health_concern_note, vaccination_up_to_date, vaccination_gaps_note, \
            consent_to_screening, information_accurate_confirmed, interpreter_required) \
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, \
            $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, \
            $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, \
            $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, \
            $61, $62, $63, $64, $65) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.assessor_id)
        .bind(&self.status)
        .bind(&self.screening_purpose)
        .bind(&self.site_name)
        .bind(self.assessment_date)
        .bind(&self.assessment_mode)
        .bind(&self.usual_activity_level)
        .bind(self.moderate_exercise_days_per_week)
        .bind(self.fruit_and_vegetable_portions_per_day)
        .bind(&self.diet_notes)
        .bind(&self.smoking_status)
        .bind(self.cigarettes_per_day)
        .bind(self.audit_c_frequency)
        .bind(self.audit_c_typical_quantity)
        .bind(self.audit_c_binge_frequency)
        .bind(&self.condition_diabetes)
        .bind(&self.condition_hypertension)
        .bind(&self.condition_asthma)
        .bind(&self.condition_copd)
        .bind(&self.condition_heart_disease)
        .bind(&self.condition_kidney_disease)
        .bind(&self.condition_thyroid)
        .bind(&self.condition_other)
        .bind(&self.past_surgeries)
        .bind(&self.current_medications)
        .bind(&self.known_drug_allergies)
        .bind(&self.family_history_premature_cardiac_event)
        .bind(&self.family_history_other)
        .bind(&self.symptom_unexplained_chest_pain)
        .bind(&self.symptom_dizzy_spells_or_fainting)
        .bind(&self.symptom_persistent_cough_over_3_weeks)
        .bind(&self.symptom_unexplained_weight_loss)
        .bind(&self.symptom_joint_pain_restricting_movement)
        .bind(&self.symptom_shortness_of_breath_on_exertion)
        .bind(&self.symptom_palpitations)
        .bind(&self.parq_diagnosed_heart_condition)
        .bind(&self.parq_chest_pain_at_rest)
        .bind(&self.parq_chest_pain_during_activity)
        .bind(&self.parq_dizziness_or_loss_of_consciousness)
        .bind(&self.parq_other_chronic_medical_condition)
        .bind(&self.parq_prescribed_medication_for_chronic_condition)
        .bind(&self.parq_bone_or_joint_problem)
        .bind(self.height_as_cm)
        .bind(self.weight_as_kg)
        .bind(self.body_mass_index)
        .bind(self.resting_blood_pressure_systolic)
        .bind(self.resting_blood_pressure_diastolic)
        .bind(self.resting_heart_rate)
        .bind(&self.job_role)
        .bind(&self.physical_demands_of_role)
        .bind(&self.exposure_noise)
        .bind(&self.exposure_chemicals)
        .bind(&self.exposure_manual_handling)
        .bind(&self.exposure_other)
        .bind(&self.exposure_other_detail)
        .bind(self.stress_level)
        .bind(self.sleep_quality)
        .bind(&self.mental_health_concern)
        .bind(&self.mental_health_concern_note)
        .bind(&self.vaccination_up_to_date)
        .bind(&self.vaccination_gaps_note)
        .bind(&self.consent_to_screening)
        .bind(&self.information_accurate_confirmed)
        .bind(&self.interpreter_required)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE health_screening_questionnaires SET patient_id = $2, assessor_id = \
            $3, status = $4, screening_purpose = $5, site_name = $6, assessment_date = \
            $7, assessment_mode = $8, usual_activity_level = $9, \
            moderate_exercise_days_per_week = $10, fruit_and_vegetable_portions_per_day \
            = $11, diet_notes = $12, smoking_status = $13, cigarettes_per_day = $14, \
            audit_c_frequency = $15, audit_c_typical_quantity = $16, \
            audit_c_binge_frequency = $17, condition_diabetes = $18, \
            condition_hypertension = $19, condition_asthma = $20, condition_copd = $21, \
            condition_heart_disease = $22, condition_kidney_disease = $23, \
            condition_thyroid = $24, condition_other = $25, past_surgeries = $26, \
            current_medications = $27, known_drug_allergies = $28, \
            family_history_premature_cardiac_event = $29, family_history_other = $30, \
            symptom_unexplained_chest_pain = $31, symptom_dizzy_spells_or_fainting = \
            $32, symptom_persistent_cough_over_3_weeks = $33, \
            symptom_unexplained_weight_loss = $34, \
            symptom_joint_pain_restricting_movement = $35, \
            symptom_shortness_of_breath_on_exertion = $36, symptom_palpitations = $37, \
            parq_diagnosed_heart_condition = $38, parq_chest_pain_at_rest = $39, \
            parq_chest_pain_during_activity = $40, \
            parq_dizziness_or_loss_of_consciousness = $41, \
            parq_other_chronic_medical_condition = $42, \
            parq_prescribed_medication_for_chronic_condition = $43, \
            parq_bone_or_joint_problem = $44, height_as_cm = $45, weight_as_kg = $46, \
            body_mass_index = $47, resting_blood_pressure_systolic = $48, \
            resting_blood_pressure_diastolic = $49, resting_heart_rate = $50, job_role = \
            $51, physical_demands_of_role = $52, exposure_noise = $53, \
            exposure_chemicals = $54, exposure_manual_handling = $55, exposure_other = \
            $56, exposure_other_detail = $57, stress_level = $58, sleep_quality = $59, \
            mental_health_concern = $60, mental_health_concern_note = $61, \
            vaccination_up_to_date = $62, vaccination_gaps_note = $63, \
            consent_to_screening = $64, information_accurate_confirmed = $65, \
            interpreter_required = $66, updated_at = now() WHERE id = $1 AND deleted_at \
            IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.assessor_id)
        .bind(&self.status)
        .bind(&self.screening_purpose)
        .bind(&self.site_name)
        .bind(self.assessment_date)
        .bind(&self.assessment_mode)
        .bind(&self.usual_activity_level)
        .bind(self.moderate_exercise_days_per_week)
        .bind(self.fruit_and_vegetable_portions_per_day)
        .bind(&self.diet_notes)
        .bind(&self.smoking_status)
        .bind(self.cigarettes_per_day)
        .bind(self.audit_c_frequency)
        .bind(self.audit_c_typical_quantity)
        .bind(self.audit_c_binge_frequency)
        .bind(&self.condition_diabetes)
        .bind(&self.condition_hypertension)
        .bind(&self.condition_asthma)
        .bind(&self.condition_copd)
        .bind(&self.condition_heart_disease)
        .bind(&self.condition_kidney_disease)
        .bind(&self.condition_thyroid)
        .bind(&self.condition_other)
        .bind(&self.past_surgeries)
        .bind(&self.current_medications)
        .bind(&self.known_drug_allergies)
        .bind(&self.family_history_premature_cardiac_event)
        .bind(&self.family_history_other)
        .bind(&self.symptom_unexplained_chest_pain)
        .bind(&self.symptom_dizzy_spells_or_fainting)
        .bind(&self.symptom_persistent_cough_over_3_weeks)
        .bind(&self.symptom_unexplained_weight_loss)
        .bind(&self.symptom_joint_pain_restricting_movement)
        .bind(&self.symptom_shortness_of_breath_on_exertion)
        .bind(&self.symptom_palpitations)
        .bind(&self.parq_diagnosed_heart_condition)
        .bind(&self.parq_chest_pain_at_rest)
        .bind(&self.parq_chest_pain_during_activity)
        .bind(&self.parq_dizziness_or_loss_of_consciousness)
        .bind(&self.parq_other_chronic_medical_condition)
        .bind(&self.parq_prescribed_medication_for_chronic_condition)
        .bind(&self.parq_bone_or_joint_problem)
        .bind(self.height_as_cm)
        .bind(self.weight_as_kg)
        .bind(self.body_mass_index)
        .bind(self.resting_blood_pressure_systolic)
        .bind(self.resting_blood_pressure_diastolic)
        .bind(self.resting_heart_rate)
        .bind(&self.job_role)
        .bind(&self.physical_demands_of_role)
        .bind(&self.exposure_noise)
        .bind(&self.exposure_chemicals)
        .bind(&self.exposure_manual_handling)
        .bind(&self.exposure_other)
        .bind(&self.exposure_other_detail)
        .bind(self.stress_level)
        .bind(self.sleep_quality)
        .bind(&self.mental_health_concern)
        .bind(&self.mental_health_concern_note)
        .bind(&self.vaccination_up_to_date)
        .bind(&self.vaccination_gaps_note)
        .bind(&self.consent_to_screening)
        .bind(&self.information_accurate_confirmed)
        .bind(&self.interpreter_required)
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
        .prefix("api/health_screening_questionnaires/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
