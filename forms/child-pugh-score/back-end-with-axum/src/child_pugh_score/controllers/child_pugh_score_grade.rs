#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::child_pugh_score_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub child_pugh_score_id: Uuid,
    pub bilirubin_points: Option<i32>,
    pub albumin_points: Option<i32>,
    pub coagulation_points: Option<i32>,
    pub ascites_points: Option<i32>,
    pub encephalopathy_points: Option<i32>,
    pub total_score: Option<i32>,
    pub child_pugh_class: String,
    pub one_year_survival: String,
    pub two_year_survival: String,
    pub surgical_risk: String,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO child_pugh_score_grades (deleted_at, child_pugh_score_id, \
            bilirubin_points, albumin_points, coagulation_points, ascites_points, \
            encephalopathy_points, total_score, child_pugh_class, one_year_survival, \
            two_year_survival, surgical_risk, graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, \
            $8, $9, $10, $11, $12, $13) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.child_pugh_score_id)
        .bind(self.bilirubin_points)
        .bind(self.albumin_points)
        .bind(self.coagulation_points)
        .bind(self.ascites_points)
        .bind(self.encephalopathy_points)
        .bind(self.total_score)
        .bind(&self.child_pugh_class)
        .bind(&self.one_year_survival)
        .bind(&self.two_year_survival)
        .bind(&self.surgical_risk)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE child_pugh_score_grades SET deleted_at = $2, child_pugh_score_id = $3, \
            bilirubin_points = $4, albumin_points = $5, coagulation_points = $6, \
            ascites_points = $7, encephalopathy_points = $8, total_score = $9, \
            child_pugh_class = $10, one_year_survival = $11, two_year_survival = $12, \
            surgical_risk = $13, graded_at = $14, updated_at = now() WHERE id = $1 RETURNING \
            *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.child_pugh_score_id)
        .bind(self.bilirubin_points)
        .bind(self.albumin_points)
        .bind(self.coagulation_points)
        .bind(self.ascites_points)
        .bind(self.encephalopathy_points)
        .bind(self.total_score)
        .bind(&self.child_pugh_class)
        .bind(&self.one_year_survival)
        .bind(&self.two_year_survival)
        .bind(&self.surgical_risk)
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
        .prefix("api/child_pugh_score_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
