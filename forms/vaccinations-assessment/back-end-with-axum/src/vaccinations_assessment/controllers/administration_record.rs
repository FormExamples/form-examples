#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::administration_records::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub assessment_id: Uuid,
    pub vaccine_name: String,
    pub batch_number: String,
    pub expiry_date: Option<Date>,
    pub administration_site: String,
    pub administration_route: String,
    pub dose_number: String,
    pub administered_by: String,
    pub administration_date: Option<Date>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO administration_records (assessment_id, vaccine_name, \
            batch_number, expiry_date, administration_site, administration_route, \
            dose_number, administered_by, administration_date) VALUES ($1, $2, $3, $4, \
            $5, $6, $7, $8, $9) RETURNING *",
        )
        .bind(self.assessment_id)
        .bind(&self.vaccine_name)
        .bind(&self.batch_number)
        .bind(self.expiry_date)
        .bind(&self.administration_site)
        .bind(&self.administration_route)
        .bind(&self.dose_number)
        .bind(&self.administered_by)
        .bind(self.administration_date)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE administration_records SET assessment_id = $2, vaccine_name = $3, \
            batch_number = $4, expiry_date = $5, administration_site = $6, \
            administration_route = $7, dose_number = $8, administered_by = $9, \
            administration_date = $10, updated_at = now() WHERE id = $1 AND deleted_at \
            IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.assessment_id)
        .bind(&self.vaccine_name)
        .bind(&self.batch_number)
        .bind(self.expiry_date)
        .bind(&self.administration_site)
        .bind(&self.administration_route)
        .bind(&self.dose_number)
        .bind(&self.administered_by)
        .bind(self.administration_date)
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
        .prefix("api/administration_records/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
