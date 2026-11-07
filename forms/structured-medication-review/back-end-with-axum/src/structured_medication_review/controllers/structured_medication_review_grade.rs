#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::structured_medication_review_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub structured_medication_review_id: Uuid,
    pub review_status: String,
    pub anticholinergic_burden_score: i32,
    pub anticholinergic_band: String,
    pub polypharmacy_band: String,
    pub burden_band: String,
    pub medicine_count: i32,
    pub regular_medicine_count: i32,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO structured_medication_review_grades (structured_medication_review_id, \
            review_status, anticholinergic_burden_score, anticholinergic_band, \
            polypharmacy_band, burden_band, medicine_count, regular_medicine_count, \
            graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
        )
        .bind(self.structured_medication_review_id)
        .bind(&self.review_status)
        .bind(self.anticholinergic_burden_score)
        .bind(&self.anticholinergic_band)
        .bind(&self.polypharmacy_band)
        .bind(&self.burden_band)
        .bind(self.medicine_count)
        .bind(self.regular_medicine_count)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE structured_medication_review_grades SET \
            structured_medication_review_id = $2, review_status = $3, \
            anticholinergic_burden_score = $4, anticholinergic_band = $5, \
            polypharmacy_band = $6, burden_band = $7, medicine_count = $8, \
            regular_medicine_count = $9, graded_at = $10, updated_at = now() WHERE id = \
            $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.structured_medication_review_id)
        .bind(&self.review_status)
        .bind(self.anticholinergic_burden_score)
        .bind(&self.anticholinergic_band)
        .bind(&self.polypharmacy_band)
        .bind(&self.burden_band)
        .bind(self.medicine_count)
        .bind(self.regular_medicine_count)
        .bind(self.graded_at)
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
        .prefix("api/structured_medication_review_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
