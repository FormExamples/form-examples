#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::nursing_care_plan_problems::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub nursing_care_plan_id: Uuid,
    pub problem_statement: String,
    pub adl_category: String,
    pub actual_or_potential: String,
    pub assessment_data: String,
    pub linked_risk: String,
    pub evaluation_note: String,
    pub goal_met: String,
    pub next_review_date: Option<Date>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO nursing_care_plan_problems (nursing_care_plan_id, \
            problem_statement, adl_category, actual_or_potential, assessment_data, \
            linked_risk, evaluation_note, goal_met, next_review_date) VALUES ($1, $2, \
            $3, $4, $5, $6, $7, $8, $9) RETURNING *",
        )
        .bind(self.nursing_care_plan_id)
        .bind(&self.problem_statement)
        .bind(&self.adl_category)
        .bind(&self.actual_or_potential)
        .bind(&self.assessment_data)
        .bind(&self.linked_risk)
        .bind(&self.evaluation_note)
        .bind(&self.goal_met)
        .bind(self.next_review_date)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE nursing_care_plan_problems SET nursing_care_plan_id = $2, \
            problem_statement = $3, adl_category = $4, actual_or_potential = $5, \
            assessment_data = $6, linked_risk = $7, evaluation_note = $8, goal_met = $9, \
            next_review_date = $10, updated_at = now() WHERE id = $1 AND deleted_at IS \
            NULL RETURNING *",
        )
        .bind(id)
        .bind(self.nursing_care_plan_id)
        .bind(&self.problem_statement)
        .bind(&self.adl_category)
        .bind(&self.actual_or_potential)
        .bind(&self.assessment_data)
        .bind(&self.linked_risk)
        .bind(&self.evaluation_note)
        .bind(&self.goal_met)
        .bind(self.next_review_date)
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
        .prefix("api/nursing_care_plan_problems/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
