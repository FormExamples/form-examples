#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::cage_alcohol_questionnaire_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub cage_alcohol_questionnaire_id: Uuid,
    pub cut_down_point: Option<i32>,
    pub annoyed_point: Option<i32>,
    pub guilty_point: Option<i32>,
    pub eye_opener_point: Option<i32>,
    pub total_score: Option<i32>,
    pub interpretation: String,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO cage_alcohol_questionnaire_grades (cage_alcohol_questionnaire_id, \
            cut_down_point, annoyed_point, guilty_point, eye_opener_point, total_score, \
            interpretation, graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
        )
        .bind(self.cage_alcohol_questionnaire_id)
        .bind(self.cut_down_point)
        .bind(self.annoyed_point)
        .bind(self.guilty_point)
        .bind(self.eye_opener_point)
        .bind(self.total_score)
        .bind(&self.interpretation)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE cage_alcohol_questionnaire_grades SET cage_alcohol_questionnaire_id = \
            $2, cut_down_point = $3, annoyed_point = $4, guilty_point = $5, \
            eye_opener_point = $6, total_score = $7, interpretation = $8, graded_at = \
            $9, updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.cage_alcohol_questionnaire_id)
        .bind(self.cut_down_point)
        .bind(self.annoyed_point)
        .bind(self.guilty_point)
        .bind(self.eye_opener_point)
        .bind(self.total_score)
        .bind(&self.interpretation)
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
        .prefix("api/cage_alcohol_questionnaire_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
