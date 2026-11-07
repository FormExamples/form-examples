#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::rockall_score_for_upper_gastrointestinal_bleeding_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub rockall_score_for_upper_gastrointestinal_bleeding_id: Uuid,
    pub age_points: Option<i32>,
    pub shock_points: Option<i32>,
    pub comorbidity_points: Option<i32>,
    pub clinical_score: Option<i32>,
    pub diagnosis_points: Option<i32>,
    pub stigmata_points: Option<i32>,
    pub full_score: Option<i32>,
    pub risk_band: String,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO rockall_score_for_upper_gastrointestinal_bleeding_grades \
            (rockall_score_for_upper_gastrointestinal_bleeding_id, age_points, \
            shock_points, comorbidity_points, clinical_score, diagnosis_points, \
            stigmata_points, full_score, risk_band, graded_at) VALUES ($1, $2, $3, $4, \
            $5, $6, $7, $8, $9, $10) RETURNING *",
        )
        .bind(self.rockall_score_for_upper_gastrointestinal_bleeding_id)
        .bind(self.age_points)
        .bind(self.shock_points)
        .bind(self.comorbidity_points)
        .bind(self.clinical_score)
        .bind(self.diagnosis_points)
        .bind(self.stigmata_points)
        .bind(self.full_score)
        .bind(&self.risk_band)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE rockall_score_for_upper_gastrointestinal_bleeding_grades SET \
            rockall_score_for_upper_gastrointestinal_bleeding_id = $2, age_points = $3, \
            shock_points = $4, comorbidity_points = $5, clinical_score = $6, \
            diagnosis_points = $7, stigmata_points = $8, full_score = $9, risk_band = \
            $10, graded_at = $11, updated_at = now() WHERE id = $1 AND deleted_at IS \
            NULL RETURNING *",
        )
        .bind(id)
        .bind(self.rockall_score_for_upper_gastrointestinal_bleeding_id)
        .bind(self.age_points)
        .bind(self.shock_points)
        .bind(self.comorbidity_points)
        .bind(self.clinical_score)
        .bind(self.diagnosis_points)
        .bind(self.stigmata_points)
        .bind(self.full_score)
        .bind(&self.risk_band)
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
        .prefix("api/rockall_score_for_upper_gastrointestinal_bleeding_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
