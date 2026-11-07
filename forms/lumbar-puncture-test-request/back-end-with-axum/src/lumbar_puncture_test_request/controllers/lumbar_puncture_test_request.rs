#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::lumbar_puncture_test_requests::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub status: String,
    pub site_name: String,
    pub setting: String,
    pub referral_date: Option<Date>,
    pub requested_by_date: Option<Date>,
    pub procedure_intent: String,
    pub primary_indication: String,
    pub clinical_question: String,
    pub relevant_history: String,
    pub suspected_raised_intracranial_pressure: bool,
    pub focal_neurological_signs: bool,
    pub reduced_consciousness: bool,
    pub ct_head_status: String,
    pub taking_anticoagulant: bool,
    pub anticoagulant_agent: String,
    pub taking_antiplatelet: bool,
    pub antiplatelet_agent: String,
    pub inr: Option<f64>,
    pub platelet_count: Option<f64>,
    pub bleeding_disorder: bool,
    pub local_skin_infection: bool,
    pub opening_pressure_required: bool,
    pub urgency: String,
    pub supervising_consultant: String,
    pub requester_contact: String,
    pub notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO lumbar_puncture_test_requests (patient_id, clinician_id, status, \
            site_name, setting, referral_date, requested_by_date, procedure_intent, \
            primary_indication, clinical_question, relevant_history, \
            suspected_raised_intracranial_pressure, focal_neurological_signs, \
            reduced_consciousness, ct_head_status, taking_anticoagulant, \
            anticoagulant_agent, taking_antiplatelet, antiplatelet_agent, inr, \
            platelet_count, bleeding_disorder, local_skin_infection, \
            opening_pressure_required, urgency, supervising_consultant, \
            requester_contact, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, \
            $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, \
            $26, $27, $28) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(&self.setting)
        .bind(self.referral_date)
        .bind(self.requested_by_date)
        .bind(&self.procedure_intent)
        .bind(&self.primary_indication)
        .bind(&self.clinical_question)
        .bind(&self.relevant_history)
        .bind(self.suspected_raised_intracranial_pressure)
        .bind(self.focal_neurological_signs)
        .bind(self.reduced_consciousness)
        .bind(&self.ct_head_status)
        .bind(self.taking_anticoagulant)
        .bind(&self.anticoagulant_agent)
        .bind(self.taking_antiplatelet)
        .bind(&self.antiplatelet_agent)
        .bind(self.inr)
        .bind(self.platelet_count)
        .bind(self.bleeding_disorder)
        .bind(self.local_skin_infection)
        .bind(self.opening_pressure_required)
        .bind(&self.urgency)
        .bind(&self.supervising_consultant)
        .bind(&self.requester_contact)
        .bind(&self.notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE lumbar_puncture_test_requests SET patient_id = $2, clinician_id = $3, \
            status = $4, site_name = $5, setting = $6, referral_date = $7, \
            requested_by_date = $8, procedure_intent = $9, primary_indication = $10, \
            clinical_question = $11, relevant_history = $12, \
            suspected_raised_intracranial_pressure = $13, focal_neurological_signs = \
            $14, reduced_consciousness = $15, ct_head_status = $16, taking_anticoagulant \
            = $17, anticoagulant_agent = $18, taking_antiplatelet = $19, \
            antiplatelet_agent = $20, inr = $21, platelet_count = $22, bleeding_disorder \
            = $23, local_skin_infection = $24, opening_pressure_required = $25, urgency \
            = $26, supervising_consultant = $27, requester_contact = $28, notes = $29, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(&self.setting)
        .bind(self.referral_date)
        .bind(self.requested_by_date)
        .bind(&self.procedure_intent)
        .bind(&self.primary_indication)
        .bind(&self.clinical_question)
        .bind(&self.relevant_history)
        .bind(self.suspected_raised_intracranial_pressure)
        .bind(self.focal_neurological_signs)
        .bind(self.reduced_consciousness)
        .bind(&self.ct_head_status)
        .bind(self.taking_anticoagulant)
        .bind(&self.anticoagulant_agent)
        .bind(self.taking_antiplatelet)
        .bind(&self.antiplatelet_agent)
        .bind(self.inr)
        .bind(self.platelet_count)
        .bind(self.bleeding_disorder)
        .bind(self.local_skin_infection)
        .bind(self.opening_pressure_required)
        .bind(&self.urgency)
        .bind(&self.supervising_consultant)
        .bind(&self.requester_contact)
        .bind(&self.notes)
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
    let page = paging::resolve(&params)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    paging::respond(page, total, rows)
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
        .prefix("api/lumbar_puncture_test_requests/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
