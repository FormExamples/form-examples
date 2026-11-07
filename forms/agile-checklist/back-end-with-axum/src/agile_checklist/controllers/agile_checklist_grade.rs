#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::agile_checklist_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub agile_checklist_id: Uuid,
    pub answered_count: i32,
    pub teams_yes_count: i32,
    pub teams_applicable_count: i32,
    pub teams_percent: Option<f64>,
    pub stakeholders_yes_count: i32,
    pub stakeholders_applicable_count: i32,
    pub stakeholders_percent: Option<f64>,
    pub practices_yes_count: i32,
    pub practices_applicable_count: i32,
    pub practices_percent: Option<f64>,
    pub overall_percent: Option<f64>,
    pub teams_band: String,
    pub stakeholders_band: String,
    pub practices_band: String,
    pub maturity: String,
    pub top_action_1: String,
    pub top_action_2: String,
    pub top_action_3: String,
    pub coach_notes: String,
    pub signed_at: Option<DateTimeWithTimeZone>,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO agile_checklist_grades (agile_checklist_id, answered_count, \
            teams_yes_count, teams_applicable_count, teams_percent, \
            stakeholders_yes_count, stakeholders_applicable_count, stakeholders_percent, \
            practices_yes_count, practices_applicable_count, practices_percent, \
            overall_percent, teams_band, stakeholders_band, practices_band, maturity, \
            top_action_1, top_action_2, top_action_3, coach_notes, signed_at, graded_at) \
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, \
            $16, $17, $18, $19, $20, $21, $22) RETURNING *",
        )
        .bind(self.agile_checklist_id)
        .bind(self.answered_count)
        .bind(self.teams_yes_count)
        .bind(self.teams_applicable_count)
        .bind(self.teams_percent)
        .bind(self.stakeholders_yes_count)
        .bind(self.stakeholders_applicable_count)
        .bind(self.stakeholders_percent)
        .bind(self.practices_yes_count)
        .bind(self.practices_applicable_count)
        .bind(self.practices_percent)
        .bind(self.overall_percent)
        .bind(&self.teams_band)
        .bind(&self.stakeholders_band)
        .bind(&self.practices_band)
        .bind(&self.maturity)
        .bind(&self.top_action_1)
        .bind(&self.top_action_2)
        .bind(&self.top_action_3)
        .bind(&self.coach_notes)
        .bind(self.signed_at)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE agile_checklist_grades SET agile_checklist_id = $2, answered_count = \
            $3, teams_yes_count = $4, teams_applicable_count = $5, teams_percent = $6, \
            stakeholders_yes_count = $7, stakeholders_applicable_count = $8, \
            stakeholders_percent = $9, practices_yes_count = $10, \
            practices_applicable_count = $11, practices_percent = $12, overall_percent = \
            $13, teams_band = $14, stakeholders_band = $15, practices_band = $16, \
            maturity = $17, top_action_1 = $18, top_action_2 = $19, top_action_3 = $20, \
            coach_notes = $21, signed_at = $22, graded_at = $23, updated_at = now() \
            WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.agile_checklist_id)
        .bind(self.answered_count)
        .bind(self.teams_yes_count)
        .bind(self.teams_applicable_count)
        .bind(self.teams_percent)
        .bind(self.stakeholders_yes_count)
        .bind(self.stakeholders_applicable_count)
        .bind(self.stakeholders_percent)
        .bind(self.practices_yes_count)
        .bind(self.practices_applicable_count)
        .bind(self.practices_percent)
        .bind(self.overall_percent)
        .bind(&self.teams_band)
        .bind(&self.stakeholders_band)
        .bind(&self.practices_band)
        .bind(&self.maturity)
        .bind(&self.top_action_1)
        .bind(&self.top_action_2)
        .bind(&self.top_action_3)
        .bind(&self.coach_notes)
        .bind(self.signed_at)
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
        .prefix("api/agile_checklist_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
