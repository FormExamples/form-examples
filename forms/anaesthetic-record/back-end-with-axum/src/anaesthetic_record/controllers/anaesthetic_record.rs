#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::anaesthetic_records::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub theatre: String,
    pub operation_date: Option<Date>,
    pub anaesthetist_name: String,
    pub assistant_name: String,
    pub surgeon_name: String,
    pub planned_procedure: String,
    pub urgency: String,
    pub machine_checked: String,
    pub who_sign_in: String,
    pub who_time_out: String,
    pub consent_confirmed: String,
    pub fasting_confirmed: String,
    pub iv_access: String,
    pub allergy_band_checked: String,
    pub documented_allergies: String,
    pub asa_status: String,
    pub asa_emergency_modifier: String,
    pub mallampati_class: Option<i32>,
    pub mouth_opening_cm: Option<f64>,
    pub thyromental_distance_cm: Option<f64>,
    pub dentition: String,
    pub anticipated_difficult_airway: String,
    pub prior_difficult_intubation: String,
    pub airway_technique: String,
    pub device_size: String,
    pub tube_depth_cm: Option<f64>,
    pub cuffed: String,
    pub cormack_lehane_grade: Option<i32>,
    pub intubation_attempts: Option<i32>,
    pub capnography_confirmed: String,
    pub monitoring_modalities: String,
    pub anaesthetic_technique: String,
    pub crystalloid_ml: Option<f64>,
    pub colloid_ml: Option<f64>,
    pub blood_products_ml: Option<f64>,
    pub estimated_blood_loss_ml: Option<f64>,
    pub urine_output_ml: Option<f64>,
    pub cell_salvage_ml: Option<f64>,
    pub regional_technique: String,
    pub regional_level: String,
    pub regional_drug: String,
    pub regional_dose_mg: Option<f64>,
    pub block_height: String,
    pub regional_complications: String,
    pub recovery_destination: String,
    pub handover_airway_status: String,
    pub analgesia_plan: String,
    pub antiemetic_plan: String,
    pub oxygen_plan: String,
    pub outstanding_tasks: String,
    pub handover_at: Option<DateTimeWithTimeZone>,
    pub receiving_practitioner: String,
    pub anaesthetist_signature: String,
    pub signed_at: Option<DateTimeWithTimeZone>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO anaesthetic_records (patient_id, clinician_id, theatre, \
            operation_date, anaesthetist_name, assistant_name, surgeon_name, \
            planned_procedure, urgency, machine_checked, who_sign_in, who_time_out, \
            consent_confirmed, fasting_confirmed, iv_access, allergy_band_checked, \
            documented_allergies, asa_status, asa_emergency_modifier, mallampati_class, \
            mouth_opening_cm, thyromental_distance_cm, dentition, \
            anticipated_difficult_airway, prior_difficult_intubation, airway_technique, \
            device_size, tube_depth_cm, cuffed, cormack_lehane_grade, \
            intubation_attempts, capnography_confirmed, monitoring_modalities, \
            anaesthetic_technique, crystalloid_ml, colloid_ml, blood_products_ml, \
            estimated_blood_loss_ml, urine_output_ml, cell_salvage_ml, \
            regional_technique, regional_level, regional_drug, regional_dose_mg, \
            block_height, regional_complications, recovery_destination, \
            handover_airway_status, analgesia_plan, antiemetic_plan, oxygen_plan, \
            outstanding_tasks, handover_at, receiving_practitioner, \
            anaesthetist_signature, signed_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, \
            $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, \
            $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, \
            $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, \
            $54, $55, $56) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.theatre)
        .bind(self.operation_date)
        .bind(&self.anaesthetist_name)
        .bind(&self.assistant_name)
        .bind(&self.surgeon_name)
        .bind(&self.planned_procedure)
        .bind(&self.urgency)
        .bind(&self.machine_checked)
        .bind(&self.who_sign_in)
        .bind(&self.who_time_out)
        .bind(&self.consent_confirmed)
        .bind(&self.fasting_confirmed)
        .bind(&self.iv_access)
        .bind(&self.allergy_band_checked)
        .bind(&self.documented_allergies)
        .bind(&self.asa_status)
        .bind(&self.asa_emergency_modifier)
        .bind(self.mallampati_class)
        .bind(self.mouth_opening_cm)
        .bind(self.thyromental_distance_cm)
        .bind(&self.dentition)
        .bind(&self.anticipated_difficult_airway)
        .bind(&self.prior_difficult_intubation)
        .bind(&self.airway_technique)
        .bind(&self.device_size)
        .bind(self.tube_depth_cm)
        .bind(&self.cuffed)
        .bind(self.cormack_lehane_grade)
        .bind(self.intubation_attempts)
        .bind(&self.capnography_confirmed)
        .bind(&self.monitoring_modalities)
        .bind(&self.anaesthetic_technique)
        .bind(self.crystalloid_ml)
        .bind(self.colloid_ml)
        .bind(self.blood_products_ml)
        .bind(self.estimated_blood_loss_ml)
        .bind(self.urine_output_ml)
        .bind(self.cell_salvage_ml)
        .bind(&self.regional_technique)
        .bind(&self.regional_level)
        .bind(&self.regional_drug)
        .bind(self.regional_dose_mg)
        .bind(&self.block_height)
        .bind(&self.regional_complications)
        .bind(&self.recovery_destination)
        .bind(&self.handover_airway_status)
        .bind(&self.analgesia_plan)
        .bind(&self.antiemetic_plan)
        .bind(&self.oxygen_plan)
        .bind(&self.outstanding_tasks)
        .bind(self.handover_at)
        .bind(&self.receiving_practitioner)
        .bind(&self.anaesthetist_signature)
        .bind(self.signed_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE anaesthetic_records SET patient_id = $2, clinician_id = $3, theatre = \
            $4, operation_date = $5, anaesthetist_name = $6, assistant_name = $7, \
            surgeon_name = $8, planned_procedure = $9, urgency = $10, machine_checked = \
            $11, who_sign_in = $12, who_time_out = $13, consent_confirmed = $14, \
            fasting_confirmed = $15, iv_access = $16, allergy_band_checked = $17, \
            documented_allergies = $18, asa_status = $19, asa_emergency_modifier = $20, \
            mallampati_class = $21, mouth_opening_cm = $22, thyromental_distance_cm = \
            $23, dentition = $24, anticipated_difficult_airway = $25, \
            prior_difficult_intubation = $26, airway_technique = $27, device_size = $28, \
            tube_depth_cm = $29, cuffed = $30, cormack_lehane_grade = $31, \
            intubation_attempts = $32, capnography_confirmed = $33, \
            monitoring_modalities = $34, anaesthetic_technique = $35, crystalloid_ml = \
            $36, colloid_ml = $37, blood_products_ml = $38, estimated_blood_loss_ml = \
            $39, urine_output_ml = $40, cell_salvage_ml = $41, regional_technique = $42, \
            regional_level = $43, regional_drug = $44, regional_dose_mg = $45, \
            block_height = $46, regional_complications = $47, recovery_destination = \
            $48, handover_airway_status = $49, analgesia_plan = $50, antiemetic_plan = \
            $51, oxygen_plan = $52, outstanding_tasks = $53, handover_at = $54, \
            receiving_practitioner = $55, anaesthetist_signature = $56, signed_at = $57, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.theatre)
        .bind(self.operation_date)
        .bind(&self.anaesthetist_name)
        .bind(&self.assistant_name)
        .bind(&self.surgeon_name)
        .bind(&self.planned_procedure)
        .bind(&self.urgency)
        .bind(&self.machine_checked)
        .bind(&self.who_sign_in)
        .bind(&self.who_time_out)
        .bind(&self.consent_confirmed)
        .bind(&self.fasting_confirmed)
        .bind(&self.iv_access)
        .bind(&self.allergy_band_checked)
        .bind(&self.documented_allergies)
        .bind(&self.asa_status)
        .bind(&self.asa_emergency_modifier)
        .bind(self.mallampati_class)
        .bind(self.mouth_opening_cm)
        .bind(self.thyromental_distance_cm)
        .bind(&self.dentition)
        .bind(&self.anticipated_difficult_airway)
        .bind(&self.prior_difficult_intubation)
        .bind(&self.airway_technique)
        .bind(&self.device_size)
        .bind(self.tube_depth_cm)
        .bind(&self.cuffed)
        .bind(self.cormack_lehane_grade)
        .bind(self.intubation_attempts)
        .bind(&self.capnography_confirmed)
        .bind(&self.monitoring_modalities)
        .bind(&self.anaesthetic_technique)
        .bind(self.crystalloid_ml)
        .bind(self.colloid_ml)
        .bind(self.blood_products_ml)
        .bind(self.estimated_blood_loss_ml)
        .bind(self.urine_output_ml)
        .bind(self.cell_salvage_ml)
        .bind(&self.regional_technique)
        .bind(&self.regional_level)
        .bind(&self.regional_drug)
        .bind(self.regional_dose_mg)
        .bind(&self.block_height)
        .bind(&self.regional_complications)
        .bind(&self.recovery_destination)
        .bind(&self.handover_airway_status)
        .bind(&self.analgesia_plan)
        .bind(&self.antiemetic_plan)
        .bind(&self.oxygen_plan)
        .bind(&self.outstanding_tasks)
        .bind(self.handover_at)
        .bind(&self.receiving_practitioner)
        .bind(&self.anaesthetist_signature)
        .bind(self.signed_at)
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
        .prefix("api/anaesthetic_records/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
