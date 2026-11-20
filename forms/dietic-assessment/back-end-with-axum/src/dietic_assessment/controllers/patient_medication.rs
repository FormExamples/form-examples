#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::patient_medications::Model;
use crate::support::validation::{TEXT_MAX, plausible_date, unprocessable};

#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub medication_id: Uuid,
    #[validate(length(max = TEXT_MAX))]
    pub dose: String,
    #[validate(length(max = TEXT_MAX))]
    pub frequency: String,
    #[validate(length(max = TEXT_MAX))]
    pub route: String,
    #[validate(custom(function = "plausible_date"))]
    pub started_on: Option<Date>,
    #[validate(length(max = TEXT_MAX))]
    pub prescribed_by: String,
    #[validate(length(max = TEXT_MAX))]
    pub adherence: String,
    #[validate(length(max = TEXT_MAX))]
    pub notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO patient_medications (patient_id, medication_id, dose, frequency, \
            route, started_on, prescribed_by, adherence, notes) VALUES ($1, $2, $3, $4, \
            $5, $6, $7, $8, $9) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.medication_id)
        .bind(&self.dose)
        .bind(&self.frequency)
        .bind(&self.route)
        .bind(self.started_on)
        .bind(&self.prescribed_by)
        .bind(&self.adherence)
        .bind(&self.notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE patient_medications SET patient_id = $2, medication_id = $3, dose = \
            $4, frequency = $5, route = $6, started_on = $7, prescribed_by = $8, \
            adherence = $9, notes = $10, updated_at = now() WHERE id = $1 AND deleted_at \
            IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.medication_id)
        .bind(&self.dose)
        .bind(&self.frequency)
        .bind(&self.route)
        .bind(self.started_on)
        .bind(&self.prescribed_by)
        .bind(&self.adherence)
        .bind(&self.notes)
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
        .prefix("api/dietic-assessment/patient_medications/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
