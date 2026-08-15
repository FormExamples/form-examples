#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use loco_rs::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::_entities::health_screening_questionnaires::{ActiveModel, Entity, Model};

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub patient_id: i64,
    pub assessor_id: i64,
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
    fn update(&self, item: &mut ActiveModel) {
      item.deleted_at = Set(self.deleted_at);
      item.patient_id = Set(self.patient_id);
      item.assessor_id = Set(self.assessor_id);
      item.status = Set(self.status.clone());
      item.screening_purpose = Set(self.screening_purpose.clone());
      item.site_name = Set(self.site_name.clone());
      item.assessment_date = Set(self.assessment_date);
      item.assessment_mode = Set(self.assessment_mode.clone());
      item.usual_activity_level = Set(self.usual_activity_level.clone());
      item.moderate_exercise_days_per_week = Set(self.moderate_exercise_days_per_week);
      item.fruit_and_vegetable_portions_per_day = Set(self.fruit_and_vegetable_portions_per_day);
      item.diet_notes = Set(self.diet_notes.clone());
      item.smoking_status = Set(self.smoking_status.clone());
      item.cigarettes_per_day = Set(self.cigarettes_per_day);
      item.audit_c_frequency = Set(self.audit_c_frequency);
      item.audit_c_typical_quantity = Set(self.audit_c_typical_quantity);
      item.audit_c_binge_frequency = Set(self.audit_c_binge_frequency);
      item.condition_diabetes = Set(self.condition_diabetes.clone());
      item.condition_hypertension = Set(self.condition_hypertension.clone());
      item.condition_asthma = Set(self.condition_asthma.clone());
      item.condition_copd = Set(self.condition_copd.clone());
      item.condition_heart_disease = Set(self.condition_heart_disease.clone());
      item.condition_kidney_disease = Set(self.condition_kidney_disease.clone());
      item.condition_thyroid = Set(self.condition_thyroid.clone());
      item.condition_other = Set(self.condition_other.clone());
      item.past_surgeries = Set(self.past_surgeries.clone());
      item.current_medications = Set(self.current_medications.clone());
      item.known_drug_allergies = Set(self.known_drug_allergies.clone());
      item.family_history_premature_cardiac_event = Set(self.family_history_premature_cardiac_event.clone());
      item.family_history_other = Set(self.family_history_other.clone());
      item.symptom_unexplained_chest_pain = Set(self.symptom_unexplained_chest_pain.clone());
      item.symptom_dizzy_spells_or_fainting = Set(self.symptom_dizzy_spells_or_fainting.clone());
      item.symptom_persistent_cough_over_3_weeks = Set(self.symptom_persistent_cough_over_3_weeks.clone());
      item.symptom_unexplained_weight_loss = Set(self.symptom_unexplained_weight_loss.clone());
      item.symptom_joint_pain_restricting_movement = Set(self.symptom_joint_pain_restricting_movement.clone());
      item.symptom_shortness_of_breath_on_exertion = Set(self.symptom_shortness_of_breath_on_exertion.clone());
      item.symptom_palpitations = Set(self.symptom_palpitations.clone());
      item.parq_diagnosed_heart_condition = Set(self.parq_diagnosed_heart_condition.clone());
      item.parq_chest_pain_at_rest = Set(self.parq_chest_pain_at_rest.clone());
      item.parq_chest_pain_during_activity = Set(self.parq_chest_pain_during_activity.clone());
      item.parq_dizziness_or_loss_of_consciousness = Set(self.parq_dizziness_or_loss_of_consciousness.clone());
      item.parq_other_chronic_medical_condition = Set(self.parq_other_chronic_medical_condition.clone());
      item.parq_prescribed_medication_for_chronic_condition = Set(self.parq_prescribed_medication_for_chronic_condition.clone());
      item.parq_bone_or_joint_problem = Set(self.parq_bone_or_joint_problem.clone());
      item.height_as_cm = Set(self.height_as_cm);
      item.weight_as_kg = Set(self.weight_as_kg);
      item.body_mass_index = Set(self.body_mass_index);
      item.resting_blood_pressure_systolic = Set(self.resting_blood_pressure_systolic);
      item.resting_blood_pressure_diastolic = Set(self.resting_blood_pressure_diastolic);
      item.resting_heart_rate = Set(self.resting_heart_rate);
      item.job_role = Set(self.job_role.clone());
      item.physical_demands_of_role = Set(self.physical_demands_of_role.clone());
      item.exposure_noise = Set(self.exposure_noise.clone());
      item.exposure_chemicals = Set(self.exposure_chemicals.clone());
      item.exposure_manual_handling = Set(self.exposure_manual_handling.clone());
      item.exposure_other = Set(self.exposure_other.clone());
      item.exposure_other_detail = Set(self.exposure_other_detail.clone());
      item.stress_level = Set(self.stress_level);
      item.sleep_quality = Set(self.sleep_quality);
      item.mental_health_concern = Set(self.mental_health_concern.clone());
      item.mental_health_concern_note = Set(self.mental_health_concern_note.clone());
      item.vaccination_up_to_date = Set(self.vaccination_up_to_date.clone());
      item.vaccination_gaps_note = Set(self.vaccination_gaps_note.clone());
      item.consent_to_screening = Set(self.consent_to_screening.clone());
      item.information_accurate_confirmed = Set(self.information_accurate_confirmed.clone());
      item.interpreter_required = Set(self.interpreter_required.clone());
      }
}

async fn load_item(ctx: &AppContext, id: i64) -> Result<Model> {
    let item = Entity::find_by_id(id).one(&ctx.db).await?;
    item.ok_or_else(|| Error::NotFound)
}

#[debug_handler]
pub async fn list(State(ctx): State<AppContext>) -> Result<Response> {
    format::json(Entity::find().all(&ctx.db).await?)
}

#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let mut item = ActiveModel {
        ..Default::default()
    };
    params.update(&mut item);
    let item = item.insert(&ctx.db).await?;
    format::json(item)
}

#[debug_handler]
pub async fn update(
    Path(id): Path<i64>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = load_item(&ctx, id).await?;
    let mut item = item.into_active_model();
    params.update(&mut item);
    let item = item.update(&ctx.db).await?;
    format::json(item)
}

#[debug_handler]
pub async fn remove(Path(id): Path<i64>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?.delete(&ctx.db).await?;
    format::empty()
}

#[debug_handler]
pub async fn get_one(Path(id): Path<i64>, State(ctx): State<AppContext>) -> Result<Response> {
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
