#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::emergency_department_triage_note_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub emergency_department_triage_note_id: Uuid,
    pub news2_total: Option<i32>,
    pub news2_any_parameter_three: String,
    pub priority_level: Option<i32>,
    pub priority_colour: String,
    pub priority_name: String,
    pub target_minutes: Option<i32>,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO emergency_department_triage_note_grades \
            (emergency_department_triage_note_id, news2_total, news2_any_parameter_three, \
            priority_level, priority_colour, priority_name, target_minutes, graded_at) VALUES \
            ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
        )
        .bind(self.emergency_department_triage_note_id)
        .bind(self.news2_total)
        .bind(&self.news2_any_parameter_three)
        .bind(self.priority_level)
        .bind(&self.priority_colour)
        .bind(&self.priority_name)
        .bind(self.target_minutes)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE emergency_department_triage_note_grades SET \
            emergency_department_triage_note_id = $2, news2_total = $3, \
            news2_any_parameter_three = $4, priority_level = $5, priority_colour = $6, \
            priority_name = $7, target_minutes = $8, graded_at = $9, updated_at = now() \
            WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.emergency_department_triage_note_id)
        .bind(self.news2_total)
        .bind(&self.news2_any_parameter_three)
        .bind(self.priority_level)
        .bind(&self.priority_colour)
        .bind(&self.priority_name)
        .bind(self.target_minutes)
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
        .prefix("api/emergency_department_triage_note_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
