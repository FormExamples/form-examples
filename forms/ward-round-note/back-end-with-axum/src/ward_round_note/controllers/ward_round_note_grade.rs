#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::ward_round_note_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub ward_round_note_id: Uuid,
    pub status: String,
    pub completeness_percent: Option<i32>,
    pub header_documented: String,
    pub problems_documented: String,
    pub examination_documented: String,
    pub investigations_documented: String,
    pub vte_documented: String,
    pub medication_documented: String,
    pub plan_documented: String,
    pub escalation_documented: String,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO ward_round_note_grades (deleted_at, ward_round_note_id, status, \
            completeness_percent, header_documented, problems_documented, \
            examination_documented, investigations_documented, vte_documented, \
            medication_documented, plan_documented, escalation_documented, graded_at) VALUES \
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.ward_round_note_id)
        .bind(&self.status)
        .bind(self.completeness_percent)
        .bind(&self.header_documented)
        .bind(&self.problems_documented)
        .bind(&self.examination_documented)
        .bind(&self.investigations_documented)
        .bind(&self.vte_documented)
        .bind(&self.medication_documented)
        .bind(&self.plan_documented)
        .bind(&self.escalation_documented)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE ward_round_note_grades SET deleted_at = $2, ward_round_note_id = $3, \
            status = $4, completeness_percent = $5, header_documented = $6, \
            problems_documented = $7, examination_documented = $8, investigations_documented \
            = $9, vte_documented = $10, medication_documented = $11, plan_documented = $12, \
            escalation_documented = $13, graded_at = $14, updated_at = now() WHERE id = $1 \
            RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.ward_round_note_id)
        .bind(&self.status)
        .bind(self.completeness_percent)
        .bind(&self.header_documented)
        .bind(&self.problems_documented)
        .bind(&self.examination_documented)
        .bind(&self.investigations_documented)
        .bind(&self.vte_documented)
        .bind(&self.medication_documented)
        .bind(&self.plan_documented)
        .bind(&self.escalation_documented)
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
        .prefix("api/ward_round_note_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
