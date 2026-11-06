#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::assessment_current_medications::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub assessment_id: Uuid,
    pub takes_regular_medications: String,
    pub current_hrt: String,
    pub current_hrt_type: String,
    pub current_hrt_route: String,
    pub current_hrt_duration: String,
    pub previous_hrt: String,
    pub previous_hrt_details: String,
    pub reason_for_stopping_hrt: String,
    pub takes_herbal_supplements: String,
    pub herbal_supplement_details: String,
    pub takes_anticoagulants: String,
    pub anticoagulant_details: String,
    pub medication_notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO assessment_current_medications (deleted_at, assessment_id, \
            takes_regular_medications, current_hrt, current_hrt_type, current_hrt_route, \
            current_hrt_duration, previous_hrt, previous_hrt_details, \
            reason_for_stopping_hrt, takes_herbal_supplements, herbal_supplement_details, \
            takes_anticoagulants, anticoagulant_details, medication_notes) VALUES ($1, $2, \
            $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.assessment_id)
        .bind(&self.takes_regular_medications)
        .bind(&self.current_hrt)
        .bind(&self.current_hrt_type)
        .bind(&self.current_hrt_route)
        .bind(&self.current_hrt_duration)
        .bind(&self.previous_hrt)
        .bind(&self.previous_hrt_details)
        .bind(&self.reason_for_stopping_hrt)
        .bind(&self.takes_herbal_supplements)
        .bind(&self.herbal_supplement_details)
        .bind(&self.takes_anticoagulants)
        .bind(&self.anticoagulant_details)
        .bind(&self.medication_notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE assessment_current_medications SET deleted_at = $2, assessment_id = $3, \
            takes_regular_medications = $4, current_hrt = $5, current_hrt_type = $6, \
            current_hrt_route = $7, current_hrt_duration = $8, previous_hrt = $9, \
            previous_hrt_details = $10, reason_for_stopping_hrt = $11, \
            takes_herbal_supplements = $12, herbal_supplement_details = $13, \
            takes_anticoagulants = $14, anticoagulant_details = $15, medication_notes = $16, \
            updated_at = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.assessment_id)
        .bind(&self.takes_regular_medications)
        .bind(&self.current_hrt)
        .bind(&self.current_hrt_type)
        .bind(&self.current_hrt_route)
        .bind(&self.current_hrt_duration)
        .bind(&self.previous_hrt)
        .bind(&self.previous_hrt_details)
        .bind(&self.reason_for_stopping_hrt)
        .bind(&self.takes_herbal_supplements)
        .bind(&self.herbal_supplement_details)
        .bind(&self.takes_anticoagulants)
        .bind(&self.anticoagulant_details)
        .bind(&self.medication_notes)
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
        .prefix("api/assessment_current_medications/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
