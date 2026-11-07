#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub assessment_id: Uuid,
    pub right_pta_db: Option<f64>,
    pub left_pta_db: Option<f64>,
    pub better_ear_pta_db: Option<f64>,
    pub right_hearing_grade: String,
    pub left_hearing_grade: String,
    pub overall_hearing_grade: String,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO grades (assessment_id, right_pta_db, left_pta_db, \
            better_ear_pta_db, right_hearing_grade, left_hearing_grade, \
            overall_hearing_grade, graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) \
            RETURNING *",
        )
        .bind(self.assessment_id)
        .bind(self.right_pta_db)
        .bind(self.left_pta_db)
        .bind(self.better_ear_pta_db)
        .bind(&self.right_hearing_grade)
        .bind(&self.left_hearing_grade)
        .bind(&self.overall_hearing_grade)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE grades SET assessment_id = $2, right_pta_db = $3, left_pta_db = $4, \
            better_ear_pta_db = $5, right_hearing_grade = $6, left_hearing_grade = $7, \
            overall_hearing_grade = $8, graded_at = $9, updated_at = now() WHERE id = $1 \
            AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.assessment_id)
        .bind(self.right_pta_db)
        .bind(self.left_pta_db)
        .bind(self.better_ear_pta_db)
        .bind(&self.right_hearing_grade)
        .bind(&self.left_hearing_grade)
        .bind(&self.overall_hearing_grade)
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
        .prefix("api/grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
