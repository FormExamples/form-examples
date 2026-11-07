#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::genetic_test_requests::Model;

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
    pub clinical_details: String,
    pub family_history: String,
    pub suspected_condition: String,
    pub consent_obtained: bool,
    pub genetic_counselling_offered: bool,
    pub affected_relative_tested: bool,
    pub specimen_type: String,
    pub urgency: String,
    pub supervising_consultant: String,
    pub requester_contact: String,
    pub notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO genetic_test_requests (patient_id, clinician_id, status, \
            site_name, setting, referral_date, requested_by_date, test_type, \
            primary_indication, clinical_question, clinical_details, family_history, \
            suspected_condition, consent_obtained, genetic_counselling_offered, \
            affected_relative_tested, specimen_type, urgency, supervising_consultant, \
            requester_contact, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, \
            $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING *",
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
        .bind(&self.clinical_details)
        .bind(&self.family_history)
        .bind(&self.suspected_condition)
        .bind(self.consent_obtained)
        .bind(self.genetic_counselling_offered)
        .bind(self.affected_relative_tested)
        .bind(&self.specimen_type)
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
            "UPDATE genetic_test_requests SET patient_id = $2, clinician_id = $3, status \
            = $4, site_name = $5, setting = $6, referral_date = $7, requested_by_date = \
            $8, test_type = $9, primary_indication = $10, clinical_question = $11, \
            clinical_details = $12, family_history = $13, suspected_condition = $14, \
            consent_obtained = $15, genetic_counselling_offered = $16, \
            affected_relative_tested = $17, specimen_type = $18, urgency = $19, \
            supervising_consultant = $20, requester_contact = $21, notes = $22, \
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
        .bind(&self.test_type)
        .bind(&self.primary_indication)
        .bind(&self.clinical_question)
        .bind(&self.clinical_details)
        .bind(&self.family_history)
        .bind(&self.suspected_condition)
        .bind(self.consent_obtained)
        .bind(self.genetic_counselling_offered)
        .bind(self.affected_relative_tested)
        .bind(&self.specimen_type)
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
    OriginalUri(uri): OriginalUri,
) -> Result<Response> {
    let page = cursor_page(&ctx, &uri)?;
    let rows = Model::page(&db(&ctx), &page).await?;
    Ok(page.respond(rows))
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
        .prefix("api/genetic_test_requests/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
