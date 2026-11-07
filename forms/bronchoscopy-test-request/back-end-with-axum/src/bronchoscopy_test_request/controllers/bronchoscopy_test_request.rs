#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::bronchoscopy_test_requests::Model;

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
    pub procedure: String,
    pub primary_indication: String,
    pub clinical_question: String,
    pub relevant_history: String,
    pub symptom_haemoptysis: bool,
    pub symptom_cough: bool,
    pub symptom_breathlessness: bool,
    pub symptom_weight_loss: bool,
    pub imaging_findings: String,
    pub taking_anticoagulant: bool,
    pub anticoagulant_agent: String,
    pub taking_antiplatelet: bool,
    pub antiplatelet_agent: String,
    pub platelet_count: Option<f64>,
    pub oxygen_dependent: bool,
    pub asa_grade: String,
    pub sedation: String,
    pub urgency: String,
    pub supervising_consultant: String,
    pub requester_contact: String,
    pub notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO bronchoscopy_test_requests (patient_id, clinician_id, status, \
            site_name, setting, referral_date, requested_by_date, procedure, \
            primary_indication, clinical_question, relevant_history, \
            symptom_haemoptysis, symptom_cough, symptom_breathlessness, \
            symptom_weight_loss, imaging_findings, taking_anticoagulant, \
            anticoagulant_agent, taking_antiplatelet, antiplatelet_agent, \
            platelet_count, oxygen_dependent, asa_grade, sedation, urgency, \
            supervising_consultant, requester_contact, notes) VALUES ($1, $2, $3, $4, \
            $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, \
            $21, $22, $23, $24, $25, $26, $27, $28) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(&self.setting)
        .bind(self.referral_date)
        .bind(self.requested_by_date)
        .bind(&self.procedure)
        .bind(&self.primary_indication)
        .bind(&self.clinical_question)
        .bind(&self.relevant_history)
        .bind(self.symptom_haemoptysis)
        .bind(self.symptom_cough)
        .bind(self.symptom_breathlessness)
        .bind(self.symptom_weight_loss)
        .bind(&self.imaging_findings)
        .bind(self.taking_anticoagulant)
        .bind(&self.anticoagulant_agent)
        .bind(self.taking_antiplatelet)
        .bind(&self.antiplatelet_agent)
        .bind(self.platelet_count)
        .bind(self.oxygen_dependent)
        .bind(&self.asa_grade)
        .bind(&self.sedation)
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
            "UPDATE bronchoscopy_test_requests SET patient_id = $2, clinician_id = $3, \
            status = $4, site_name = $5, setting = $6, referral_date = $7, \
            requested_by_date = $8, procedure = $9, primary_indication = $10, \
            clinical_question = $11, relevant_history = $12, symptom_haemoptysis = $13, \
            symptom_cough = $14, symptom_breathlessness = $15, symptom_weight_loss = \
            $16, imaging_findings = $17, taking_anticoagulant = $18, anticoagulant_agent \
            = $19, taking_antiplatelet = $20, antiplatelet_agent = $21, platelet_count = \
            $22, oxygen_dependent = $23, asa_grade = $24, sedation = $25, urgency = $26, \
            supervising_consultant = $27, requester_contact = $28, notes = $29, \
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
        .bind(&self.procedure)
        .bind(&self.primary_indication)
        .bind(&self.clinical_question)
        .bind(&self.relevant_history)
        .bind(self.symptom_haemoptysis)
        .bind(self.symptom_cough)
        .bind(self.symptom_breathlessness)
        .bind(self.symptom_weight_loss)
        .bind(&self.imaging_findings)
        .bind(self.taking_anticoagulant)
        .bind(&self.anticoagulant_agent)
        .bind(self.taking_antiplatelet)
        .bind(&self.antiplatelet_agent)
        .bind(self.platelet_count)
        .bind(self.oxygen_dependent)
        .bind(&self.asa_grade)
        .bind(&self.sedation)
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
        .prefix("api/bronchoscopy_test_requests/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
