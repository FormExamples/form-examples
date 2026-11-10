#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::medical_information_form_for_air_travel_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub medical_information_form_for_air_travel_id: Uuid,
    pub computed_fitness_band: String,
    pub final_fitness_band: String,
    pub override_reason: String,
    pub desk_recommendation: String,
    pub physician_notes: String,
    pub valid_until: Option<Date>,
    pub signed_at: Option<DateTimeWithTimeZone>,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO medical_information_form_for_air_travel_grades \
            (medical_information_form_for_air_travel_id, computed_fitness_band, \
            final_fitness_band, override_reason, desk_recommendation, physician_notes, \
            valid_until, signed_at, graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, \
            $9) RETURNING *",
        )
        .bind(self.medical_information_form_for_air_travel_id)
        .bind(&self.computed_fitness_band)
        .bind(&self.final_fitness_band)
        .bind(&self.override_reason)
        .bind(&self.desk_recommendation)
        .bind(&self.physician_notes)
        .bind(self.valid_until)
        .bind(self.signed_at)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE medical_information_form_for_air_travel_grades SET \
            medical_information_form_for_air_travel_id = $2, computed_fitness_band = $3, \
            final_fitness_band = $4, override_reason = $5, desk_recommendation = $6, \
            physician_notes = $7, valid_until = $8, signed_at = $9, graded_at = $10, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.medical_information_form_for_air_travel_id)
        .bind(&self.computed_fitness_band)
        .bind(&self.final_fitness_band)
        .bind(&self.override_reason)
        .bind(&self.desk_recommendation)
        .bind(&self.physician_notes)
        .bind(self.valid_until)
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
    OriginalUri(uri): OriginalUri,
) -> Result<Response> {
    let page = cursor_page(&ctx, &uri)?;
    let rows = Model::page(&db(&ctx), &page).await?;
    Ok(page.respond(rows))
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
        .prefix("api/medical_information_form_for_air_travel_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
