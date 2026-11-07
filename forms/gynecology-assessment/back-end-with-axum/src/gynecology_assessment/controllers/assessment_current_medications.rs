#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::assessment_current_medications::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub assessment_id: Uuid,
    pub takes_regular_medications: String,
    pub takes_over_the_counter: String,
    pub takes_herbal_supplements: String,
    pub herbal_supplement_details: String,
    pub hormone_therapy: String,
    pub hormone_therapy_details: String,
    pub medication_notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO assessment_current_medications (assessment_id, \
            takes_regular_medications, takes_over_the_counter, takes_herbal_supplements, \
            herbal_supplement_details, hormone_therapy, hormone_therapy_details, \
            medication_notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
        )
        .bind(self.assessment_id)
        .bind(&self.takes_regular_medications)
        .bind(&self.takes_over_the_counter)
        .bind(&self.takes_herbal_supplements)
        .bind(&self.herbal_supplement_details)
        .bind(&self.hormone_therapy)
        .bind(&self.hormone_therapy_details)
        .bind(&self.medication_notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE assessment_current_medications SET assessment_id = $2, \
            takes_regular_medications = $3, takes_over_the_counter = $4, \
            takes_herbal_supplements = $5, herbal_supplement_details = $6, \
            hormone_therapy = $7, hormone_therapy_details = $8, medication_notes = $9, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.assessment_id)
        .bind(&self.takes_regular_medications)
        .bind(&self.takes_over_the_counter)
        .bind(&self.takes_herbal_supplements)
        .bind(&self.herbal_supplement_details)
        .bind(&self.hormone_therapy)
        .bind(&self.hormone_therapy_details)
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
