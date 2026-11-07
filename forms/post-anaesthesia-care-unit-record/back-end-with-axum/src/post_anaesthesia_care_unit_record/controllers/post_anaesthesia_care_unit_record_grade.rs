#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::post_anaesthesia_care_unit_record_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub post_anaesthesia_care_unit_record_id: Uuid,
    pub activity_score: Option<i32>,
    pub respiration_score: Option<i32>,
    pub circulation_score: Option<i32>,
    pub consciousness_score: Option<i32>,
    pub oxygen_saturation_score: Option<i32>,
    pub aldrete_total: Option<i32>,
    pub discharge_ready: String,
    pub padss_total: Option<i32>,
    pub padss_street_fit: String,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO post_anaesthesia_care_unit_record_grades \
            (post_anaesthesia_care_unit_record_id, activity_score, respiration_score, \
            circulation_score, consciousness_score, oxygen_saturation_score, aldrete_total, \
            discharge_ready, padss_total, padss_street_fit, graded_at) VALUES ($1, $2, $3, \
            $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
        )
        .bind(self.post_anaesthesia_care_unit_record_id)
        .bind(self.activity_score)
        .bind(self.respiration_score)
        .bind(self.circulation_score)
        .bind(self.consciousness_score)
        .bind(self.oxygen_saturation_score)
        .bind(self.aldrete_total)
        .bind(&self.discharge_ready)
        .bind(self.padss_total)
        .bind(&self.padss_street_fit)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE post_anaesthesia_care_unit_record_grades SET \
            post_anaesthesia_care_unit_record_id = $2, activity_score = $3, \
            respiration_score = $4, circulation_score = $5, consciousness_score = $6, \
            oxygen_saturation_score = $7, aldrete_total = $8, discharge_ready = $9, \
            padss_total = $10, padss_street_fit = $11, graded_at = $12, updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.post_anaesthesia_care_unit_record_id)
        .bind(self.activity_score)
        .bind(self.respiration_score)
        .bind(self.circulation_score)
        .bind(self.consciousness_score)
        .bind(self.oxygen_saturation_score)
        .bind(self.aldrete_total)
        .bind(&self.discharge_ready)
        .bind(self.padss_total)
        .bind(&self.padss_street_fit)
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
        .prefix("api/post_anaesthesia_care_unit_record_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
