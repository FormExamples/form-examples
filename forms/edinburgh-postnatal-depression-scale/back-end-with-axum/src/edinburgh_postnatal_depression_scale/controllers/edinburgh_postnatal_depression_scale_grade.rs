#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::edinburgh_postnatal_depression_scale_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub edinburgh_postnatal_depression_scale_id: Uuid,
    pub total_score: Option<i32>,
    pub interpretation: String,
    pub item_10_score: Option<i32>,
    pub self_harm_flag: String,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO edinburgh_postnatal_depression_scale_grades \
            (edinburgh_postnatal_depression_scale_id, total_score, interpretation, \
            item_10_score, self_harm_flag, graded_at) VALUES ($1, $2, $3, $4, $5, $6) \
            RETURNING *",
        )
        .bind(self.edinburgh_postnatal_depression_scale_id)
        .bind(self.total_score)
        .bind(&self.interpretation)
        .bind(self.item_10_score)
        .bind(&self.self_harm_flag)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE edinburgh_postnatal_depression_scale_grades SET \
            edinburgh_postnatal_depression_scale_id = $2, total_score = $3, interpretation = \
            $4, item_10_score = $5, self_harm_flag = $6, graded_at = $7, updated_at = now() \
            WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.edinburgh_postnatal_depression_scale_id)
        .bind(self.total_score)
        .bind(&self.interpretation)
        .bind(self.item_10_score)
        .bind(&self.self_harm_flag)
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
        .prefix("api/edinburgh_postnatal_depression_scale_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
