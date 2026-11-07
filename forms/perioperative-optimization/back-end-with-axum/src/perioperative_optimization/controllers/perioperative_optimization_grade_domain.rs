#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::perioperative_optimization_grade_domains::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub perioperative_optimization_grade_id: Uuid,
    pub domain: String,
    pub status: String,
    pub triggered: bool,
    pub lead_time_weeks: i32,
    pub weeks_shortfall: Option<i32>,
    pub rule_id: String,
    pub finding: String,
    pub intervention: String,
    pub intervention_started: bool,
    pub referral_made: bool,
    pub target_value: String,
    pub start_date: Option<Date>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO perioperative_optimization_grade_domains \
            (perioperative_optimization_grade_id, domain, status, triggered, \
            lead_time_weeks, weeks_shortfall, rule_id, finding, intervention, \
            intervention_started, referral_made, target_value, start_date) VALUES ($1, \
            $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *",
        )
        .bind(self.perioperative_optimization_grade_id)
        .bind(&self.domain)
        .bind(&self.status)
        .bind(self.triggered)
        .bind(self.lead_time_weeks)
        .bind(self.weeks_shortfall)
        .bind(&self.rule_id)
        .bind(&self.finding)
        .bind(&self.intervention)
        .bind(self.intervention_started)
        .bind(self.referral_made)
        .bind(&self.target_value)
        .bind(self.start_date)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE perioperative_optimization_grade_domains SET \
            perioperative_optimization_grade_id = $2, domain = $3, status = $4, \
            triggered = $5, lead_time_weeks = $6, weeks_shortfall = $7, rule_id = $8, \
            finding = $9, intervention = $10, intervention_started = $11, referral_made \
            = $12, target_value = $13, start_date = $14, updated_at = now() WHERE id = \
            $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.perioperative_optimization_grade_id)
        .bind(&self.domain)
        .bind(&self.status)
        .bind(self.triggered)
        .bind(self.lead_time_weeks)
        .bind(self.weeks_shortfall)
        .bind(&self.rule_id)
        .bind(&self.finding)
        .bind(&self.intervention)
        .bind(self.intervention_started)
        .bind(self.referral_made)
        .bind(&self.target_value)
        .bind(self.start_date)
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
        .prefix("api/perioperative_optimization_grade_domains/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
