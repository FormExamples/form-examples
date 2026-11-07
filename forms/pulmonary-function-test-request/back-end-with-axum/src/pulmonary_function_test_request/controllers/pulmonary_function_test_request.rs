#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::pulmonary_function_test_requests::Model;

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
    pub test_type: String,
    pub primary_indication: String,
    pub clinical_question: String,
    pub relevant_history: String,
    pub symptom_breathlessness: bool,
    pub symptom_cough: bool,
    pub symptom_wheeze: bool,
    pub smoking_status: String,
    pub current_inhalers: String,
    pub recent_respiratory_infection: bool,
    pub recent_mi_or_eye_abdominal_surgery: bool,
    pub suspected_active_tuberculosis: bool,
    pub urgency: String,
    pub supervising_consultant: String,
    pub requester_contact: String,
    pub notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO pulmonary_function_test_requests (patient_id, clinician_id, \
            status, site_name, setting, referral_date, requested_by_date, test_type, \
            primary_indication, clinical_question, relevant_history, \
            symptom_breathlessness, symptom_cough, symptom_wheeze, smoking_status, \
            current_inhalers, recent_respiratory_infection, \
            recent_mi_or_eye_abdominal_surgery, suspected_active_tuberculosis, urgency, \
            supervising_consultant, requester_contact, notes) VALUES ($1, $2, $3, $4, \
            $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, \
            $21, $22, $23) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(&self.setting)
        .bind(self.referral_date)
        .bind(self.requested_by_date)
        .bind(&self.test_type)
        .bind(&self.primary_indication)
        .bind(&self.clinical_question)
        .bind(&self.relevant_history)
        .bind(self.symptom_breathlessness)
        .bind(self.symptom_cough)
        .bind(self.symptom_wheeze)
        .bind(&self.smoking_status)
        .bind(&self.current_inhalers)
        .bind(self.recent_respiratory_infection)
        .bind(self.recent_mi_or_eye_abdominal_surgery)
        .bind(self.suspected_active_tuberculosis)
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
            "UPDATE pulmonary_function_test_requests SET patient_id = $2, clinician_id = \
            $3, status = $4, site_name = $5, setting = $6, referral_date = $7, \
            requested_by_date = $8, test_type = $9, primary_indication = $10, \
            clinical_question = $11, relevant_history = $12, symptom_breathlessness = \
            $13, symptom_cough = $14, symptom_wheeze = $15, smoking_status = $16, \
            current_inhalers = $17, recent_respiratory_infection = $18, \
            recent_mi_or_eye_abdominal_surgery = $19, suspected_active_tuberculosis = \
            $20, urgency = $21, supervising_consultant = $22, requester_contact = $23, \
            notes = $24, updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(&self.setting)
        .bind(self.referral_date)
        .bind(self.requested_by_date)
        .bind(&self.test_type)
        .bind(&self.primary_indication)
        .bind(&self.clinical_question)
        .bind(&self.relevant_history)
        .bind(self.symptom_breathlessness)
        .bind(self.symptom_cough)
        .bind(self.symptom_wheeze)
        .bind(&self.smoking_status)
        .bind(&self.current_inhalers)
        .bind(self.recent_respiratory_infection)
        .bind(self.recent_mi_or_eye_abdominal_surgery)
        .bind(self.suspected_active_tuberculosis)
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
        .prefix("api/pulmonary_function_test_requests/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
