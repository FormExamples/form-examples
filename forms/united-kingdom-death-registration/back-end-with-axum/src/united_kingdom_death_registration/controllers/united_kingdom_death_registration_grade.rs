#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::united_kingdom_death_registration_grades::Model;
use crate::support::validation::unprocessable;

#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub united_kingdom_death_registration_id: Uuid,
    pub graded_at: DateTimeWithTimeZone,
    #[serde(default)]
    pub registration_class: Option<String>,
    #[serde(default)]
    pub deadline_status: Option<String>,
    #[serde(default)]
    pub days_since_confirmation: Option<i32>,
    #[serde(default)]
    pub informant_qualified: Option<String>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO united_kingdom_death_registration_grades \
            (united_kingdom_death_registration_id, graded_at, registration_class, \
            deadline_status, days_since_confirmation, informant_qualified) VALUES ($1, \
            $2, COALESCE($3, ''), COALESCE($4, ''), $5, COALESCE($6, '')) RETURNING *",
        )
        .bind(self.united_kingdom_death_registration_id)
        .bind(self.graded_at)
        .bind(&self.registration_class)
        .bind(&self.deadline_status)
        .bind(self.days_since_confirmation)
        .bind(&self.informant_qualified)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE united_kingdom_death_registration_grades SET \
            united_kingdom_death_registration_id = $2, graded_at = $3, \
            registration_class = COALESCE($4, registration_class), deadline_status = \
            COALESCE($5, deadline_status), days_since_confirmation = $6, \
            informant_qualified = COALESCE($7, informant_qualified), updated_at = now() \
            WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.united_kingdom_death_registration_id)
        .bind(self.graded_at)
        .bind(&self.registration_class)
        .bind(&self.deadline_status)
        .bind(self.days_since_confirmation)
        .bind(&self.informant_qualified)
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
    OriginalUri(uri): OriginalUri,
) -> Result<Response> {
    let page = cursor_page(&ctx, &uri)?;
    let rows = Model::page(&db(&ctx), &page).await?;
    Ok(page.respond(rows))
}

#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    params.validate().map_err(|e| unprocessable(&e))?;
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    params.validate().map_err(|e| unprocessable(&e))?;
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
        .prefix("api/united_kingdom_death_registration_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
