#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::four_a_test_for_deliriums::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub patient_identifier: String,
    pub patient_name: String,
    pub date_of_birth: Option<Date>,
    pub assessment_date: Option<Date>,
    pub assessment_time: Option<Time>,
    pub setting: String,
    pub assessor_name: String,
    pub assessor_role: String,
    pub alertness: String,
    pub amt4: String,
    pub attention_months: String,
    pub acute_change: String,
    pub acute_change_source: String,
    pub clinical_notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO four_a_test_for_deliriums (patient_id, clinician_id, \
            patient_identifier, patient_name, date_of_birth, assessment_date, \
            assessment_time, setting, assessor_name, assessor_role, alertness, amt4, \
            attention_months, acute_change, acute_change_source, clinical_notes) VALUES ($1, \
            $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.patient_identifier)
        .bind(&self.patient_name)
        .bind(self.date_of_birth)
        .bind(self.assessment_date)
        .bind(self.assessment_time)
        .bind(&self.setting)
        .bind(&self.assessor_name)
        .bind(&self.assessor_role)
        .bind(&self.alertness)
        .bind(&self.amt4)
        .bind(&self.attention_months)
        .bind(&self.acute_change)
        .bind(&self.acute_change_source)
        .bind(&self.clinical_notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE four_a_test_for_deliriums SET patient_id = $2, clinician_id = $3, \
            patient_identifier = $4, patient_name = $5, date_of_birth = $6, \
            assessment_date = $7, assessment_time = $8, setting = $9, assessor_name = \
            $10, assessor_role = $11, alertness = $12, amt4 = $13, attention_months = \
            $14, acute_change = $15, acute_change_source = $16, clinical_notes = $17, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.patient_identifier)
        .bind(&self.patient_name)
        .bind(self.date_of_birth)
        .bind(self.assessment_date)
        .bind(self.assessment_time)
        .bind(&self.setting)
        .bind(&self.assessor_name)
        .bind(&self.assessor_role)
        .bind(&self.alertness)
        .bind(&self.amt4)
        .bind(&self.attention_months)
        .bind(&self.acute_change)
        .bind(&self.acute_change_source)
        .bind(&self.clinical_notes)
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
        .prefix("api/four_a_test_for_deliriums/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
