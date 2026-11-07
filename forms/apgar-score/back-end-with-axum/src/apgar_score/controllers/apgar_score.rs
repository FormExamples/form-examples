#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::apgar_scores::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub clinician_name: String,
    pub clinician_role: String,
    pub born_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub gestational_age_weeks: Option<f64>,
    pub mode_of_delivery: String,
    pub newborn_identifier: String,
    pub sex: String,
    pub birth_order: Option<i32>,
    pub resuscitation_measures: String,
    pub clinician_note: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO apgar_scores (patient_id, clinician_id, clinician_name, \
            clinician_role, born_at, care_setting, gestational_age_weeks, mode_of_delivery, \
            newborn_identifier, sex, birth_order, resuscitation_measures, clinician_note) \
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.born_at)
        .bind(&self.care_setting)
        .bind(self.gestational_age_weeks)
        .bind(&self.mode_of_delivery)
        .bind(&self.newborn_identifier)
        .bind(&self.sex)
        .bind(self.birth_order)
        .bind(&self.resuscitation_measures)
        .bind(&self.clinician_note)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE apgar_scores SET patient_id = $2, clinician_id = $3, clinician_name = \
            $4, clinician_role = $5, born_at = $6, care_setting = $7, \
            gestational_age_weeks = $8, mode_of_delivery = $9, newborn_identifier = $10, \
            sex = $11, birth_order = $12, resuscitation_measures = $13, clinician_note = \
            $14, updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.born_at)
        .bind(&self.care_setting)
        .bind(self.gestational_age_weeks)
        .bind(&self.mode_of_delivery)
        .bind(&self.newborn_identifier)
        .bind(&self.sex)
        .bind(self.birth_order)
        .bind(&self.resuscitation_measures)
        .bind(&self.clinician_note)
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
        .prefix("api/apgar_scores/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
