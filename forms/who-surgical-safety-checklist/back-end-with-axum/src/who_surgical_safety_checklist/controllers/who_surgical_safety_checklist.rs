//! Who surgical safety checklist module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::who_surgical_safety_checklists::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Status.
    pub status: String,
    /// Site name.
    pub site_name: String,
    /// Operating room.
    pub operating_room: String,
    /// Case date.
    pub case_date: Option<Date>,
    /// Case start at.
    pub case_start_at: Option<DateTimeWithTimeZone>,
    /// Case end at.
    pub case_end_at: Option<DateTimeWithTimeZone>,
    /// Planned procedure.
    pub planned_procedure: String,
    /// Surgical specialty.
    pub surgical_specialty: String,
    /// Urgency.
    pub urgency: String,
    /// Laterality.
    pub laterality: String,
    /// Is paediatric.
    pub is_paediatric: String,
    /// Abandoned reason.
    pub abandoned_reason: String,
    /// Sign in identity site procedure consent.
    pub sign_in_identity_site_procedure_consent: String,
    /// Sign in site marked.
    pub sign_in_site_marked: String,
    /// Sign in anaesthesia check complete.
    pub sign_in_anaesthesia_check_complete: String,
    /// Sign in pulse oximeter on patient.
    pub sign_in_pulse_oximeter_on_patient: String,
    /// Sign in known allergy.
    pub sign_in_known_allergy: String,
    /// Sign in known allergy detail.
    pub sign_in_known_allergy_detail: String,
    /// Sign in difficult airway aspiration risk.
    pub sign_in_difficult_airway_aspiration_risk: String,
    /// Sign in blood loss risk.
    pub sign_in_blood_loss_risk: String,
    /// Sign in completed at.
    pub sign_in_completed_at: Option<DateTimeWithTimeZone>,
    /// Time out team introductions confirmed.
    pub time_out_team_introductions_confirmed: String,
    /// Time out patient procedure incision confirmed.
    pub time_out_patient_procedure_incision_confirmed: String,
    /// Time out antibiotic prophylaxis within 60min.
    pub time_out_antibiotic_prophylaxis_within_60min: String,
    /// Time out surgeon critical steps.
    pub time_out_surgeon_critical_steps: String,
    /// Time out surgeon case duration minutes.
    pub time_out_surgeon_case_duration_minutes: Option<i32>,
    /// Time out surgeon anticipated blood loss ml.
    pub time_out_surgeon_anticipated_blood_loss_ml: Option<i32>,
    /// Time out anaesthetist patient concerns.
    pub time_out_anaesthetist_patient_concerns: String,
    /// Time out nursing sterility confirmed.
    pub time_out_nursing_sterility_confirmed: String,
    /// Time out nursing equipment concerns.
    pub time_out_nursing_equipment_concerns: String,
    /// Time out essential imaging displayed.
    pub time_out_essential_imaging_displayed: String,
    /// Time out completed at.
    pub time_out_completed_at: Option<DateTimeWithTimeZone>,
    /// Sign out procedure name confirmed.
    pub sign_out_procedure_name_confirmed: String,
    /// Sign out counts confirmed.
    pub sign_out_counts_confirmed: String,
    /// Sign out specimens labelled.
    pub sign_out_specimens_labelled: String,
    /// Sign out equipment problems.
    pub sign_out_equipment_problems: String,
    /// Sign out recovery concerns.
    pub sign_out_recovery_concerns: String,
    /// Sign out completed at.
    pub sign_out_completed_at: Option<DateTimeWithTimeZone>,
    /// Patient id.
    pub patient_id: Uuid,
    /// Surgeon id.
    pub surgeon_id: Option<Uuid>,
    /// Anaesthetist id.
    pub anaesthetist_id: Option<Uuid>,
    /// Lead nurse id.
    pub lead_nurse_id: Option<Uuid>,
    /// Sign in coordinator id.
    pub sign_in_coordinator_id: Option<Uuid>,
    /// Time out coordinator id.
    pub time_out_coordinator_id: Option<Uuid>,
    /// Sign out coordinator id.
    pub sign_out_coordinator_id: Option<Uuid>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO who_surgical_safety_checklists (status, site_name, \
            operating_room, case_date, case_start_at, case_end_at, planned_procedure, \
            surgical_specialty, urgency, laterality, is_paediatric, abandoned_reason, \
            sign_in_identity_site_procedure_consent, sign_in_site_marked, \
            sign_in_anaesthesia_check_complete, sign_in_pulse_oximeter_on_patient, \
            sign_in_known_allergy, sign_in_known_allergy_detail, \
            sign_in_difficult_airway_aspiration_risk, sign_in_blood_loss_risk, \
            sign_in_completed_at, time_out_team_introductions_confirmed, \
            time_out_patient_procedure_incision_confirmed, \
            time_out_antibiotic_prophylaxis_within_60min, \
            time_out_surgeon_critical_steps, time_out_surgeon_case_duration_minutes, \
            time_out_surgeon_anticipated_blood_loss_ml, \
            time_out_anaesthetist_patient_concerns, \
            time_out_nursing_sterility_confirmed, time_out_nursing_equipment_concerns, \
            time_out_essential_imaging_displayed, time_out_completed_at, \
            sign_out_procedure_name_confirmed, sign_out_counts_confirmed, \
            sign_out_specimens_labelled, sign_out_equipment_problems, \
            sign_out_recovery_concerns, sign_out_completed_at, patient_id, surgeon_id, \
            anaesthetist_id, lead_nurse_id, sign_in_coordinator_id, \
            time_out_coordinator_id, sign_out_coordinator_id) VALUES ($1, $2, $3, $4, \
            $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, \
            $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, \
            $36, $37, $38, $39, $40, $41, $42, $43, $44, $45) RETURNING *",
        )
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(&self.operating_room)
        .bind(self.case_date)
        .bind(self.case_start_at)
        .bind(self.case_end_at)
        .bind(&self.planned_procedure)
        .bind(&self.surgical_specialty)
        .bind(&self.urgency)
        .bind(&self.laterality)
        .bind(&self.is_paediatric)
        .bind(&self.abandoned_reason)
        .bind(&self.sign_in_identity_site_procedure_consent)
        .bind(&self.sign_in_site_marked)
        .bind(&self.sign_in_anaesthesia_check_complete)
        .bind(&self.sign_in_pulse_oximeter_on_patient)
        .bind(&self.sign_in_known_allergy)
        .bind(&self.sign_in_known_allergy_detail)
        .bind(&self.sign_in_difficult_airway_aspiration_risk)
        .bind(&self.sign_in_blood_loss_risk)
        .bind(self.sign_in_completed_at)
        .bind(&self.time_out_team_introductions_confirmed)
        .bind(&self.time_out_patient_procedure_incision_confirmed)
        .bind(&self.time_out_antibiotic_prophylaxis_within_60min)
        .bind(&self.time_out_surgeon_critical_steps)
        .bind(self.time_out_surgeon_case_duration_minutes)
        .bind(self.time_out_surgeon_anticipated_blood_loss_ml)
        .bind(&self.time_out_anaesthetist_patient_concerns)
        .bind(&self.time_out_nursing_sterility_confirmed)
        .bind(&self.time_out_nursing_equipment_concerns)
        .bind(&self.time_out_essential_imaging_displayed)
        .bind(self.time_out_completed_at)
        .bind(&self.sign_out_procedure_name_confirmed)
        .bind(&self.sign_out_counts_confirmed)
        .bind(&self.sign_out_specimens_labelled)
        .bind(&self.sign_out_equipment_problems)
        .bind(&self.sign_out_recovery_concerns)
        .bind(self.sign_out_completed_at)
        .bind(self.patient_id)
        .bind(self.surgeon_id)
        .bind(self.anaesthetist_id)
        .bind(self.lead_nurse_id)
        .bind(self.sign_in_coordinator_id)
        .bind(self.time_out_coordinator_id)
        .bind(self.sign_out_coordinator_id)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE who_surgical_safety_checklists SET status = $2, site_name = $3, \
            operating_room = $4, case_date = $5, case_start_at = $6, case_end_at = $7, \
            planned_procedure = $8, surgical_specialty = $9, urgency = $10, laterality = \
            $11, is_paediatric = $12, abandoned_reason = $13, \
            sign_in_identity_site_procedure_consent = $14, sign_in_site_marked = $15, \
            sign_in_anaesthesia_check_complete = $16, sign_in_pulse_oximeter_on_patient \
            = $17, sign_in_known_allergy = $18, sign_in_known_allergy_detail = $19, \
            sign_in_difficult_airway_aspiration_risk = $20, sign_in_blood_loss_risk = \
            $21, sign_in_completed_at = $22, time_out_team_introductions_confirmed = \
            $23, time_out_patient_procedure_incision_confirmed = $24, \
            time_out_antibiotic_prophylaxis_within_60min = $25, \
            time_out_surgeon_critical_steps = $26, \
            time_out_surgeon_case_duration_minutes = $27, \
            time_out_surgeon_anticipated_blood_loss_ml = $28, \
            time_out_anaesthetist_patient_concerns = $29, \
            time_out_nursing_sterility_confirmed = $30, \
            time_out_nursing_equipment_concerns = $31, \
            time_out_essential_imaging_displayed = $32, time_out_completed_at = $33, \
            sign_out_procedure_name_confirmed = $34, sign_out_counts_confirmed = $35, \
            sign_out_specimens_labelled = $36, sign_out_equipment_problems = $37, \
            sign_out_recovery_concerns = $38, sign_out_completed_at = $39, patient_id = \
            $40, surgeon_id = $41, anaesthetist_id = $42, lead_nurse_id = $43, \
            sign_in_coordinator_id = $44, time_out_coordinator_id = $45, \
            sign_out_coordinator_id = $46, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(&self.operating_room)
        .bind(self.case_date)
        .bind(self.case_start_at)
        .bind(self.case_end_at)
        .bind(&self.planned_procedure)
        .bind(&self.surgical_specialty)
        .bind(&self.urgency)
        .bind(&self.laterality)
        .bind(&self.is_paediatric)
        .bind(&self.abandoned_reason)
        .bind(&self.sign_in_identity_site_procedure_consent)
        .bind(&self.sign_in_site_marked)
        .bind(&self.sign_in_anaesthesia_check_complete)
        .bind(&self.sign_in_pulse_oximeter_on_patient)
        .bind(&self.sign_in_known_allergy)
        .bind(&self.sign_in_known_allergy_detail)
        .bind(&self.sign_in_difficult_airway_aspiration_risk)
        .bind(&self.sign_in_blood_loss_risk)
        .bind(self.sign_in_completed_at)
        .bind(&self.time_out_team_introductions_confirmed)
        .bind(&self.time_out_patient_procedure_incision_confirmed)
        .bind(&self.time_out_antibiotic_prophylaxis_within_60min)
        .bind(&self.time_out_surgeon_critical_steps)
        .bind(self.time_out_surgeon_case_duration_minutes)
        .bind(self.time_out_surgeon_anticipated_blood_loss_ml)
        .bind(&self.time_out_anaesthetist_patient_concerns)
        .bind(&self.time_out_nursing_sterility_confirmed)
        .bind(&self.time_out_nursing_equipment_concerns)
        .bind(&self.time_out_essential_imaging_displayed)
        .bind(self.time_out_completed_at)
        .bind(&self.sign_out_procedure_name_confirmed)
        .bind(&self.sign_out_counts_confirmed)
        .bind(&self.sign_out_specimens_labelled)
        .bind(&self.sign_out_equipment_problems)
        .bind(&self.sign_out_recovery_concerns)
        .bind(self.sign_out_completed_at)
        .bind(self.patient_id)
        .bind(self.surgeon_id)
        .bind(self.anaesthetist_id)
        .bind(self.lead_nurse_id)
        .bind(self.sign_in_coordinator_id)
        .bind(self.time_out_coordinator_id)
        .bind(self.sign_out_coordinator_id)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

/// List.
#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = paging::resolve(&params)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    paging::respond(page, total, rows)
}

/// Add.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

/// Update.
#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

/// Remove.
#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

/// Get one.
#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

/// Routes.
pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/who_surgical_safety_checklists/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
