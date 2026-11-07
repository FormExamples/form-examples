#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::medication_reconciliation_line_items::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub medication_reconciliation_id: Uuid,
    pub list_source: String,
    pub drug_name: String,
    pub form: String,
    pub dose: String,
    pub route: String,
    pub frequency: String,
    pub indication: String,
    pub high_risk_class: String,
    pub adherence: String,
    pub source_type: String,
    pub status: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO medication_reconciliation_line_items (medication_reconciliation_id, \
            list_source, drug_name, form, dose, route, frequency, indication, \
            high_risk_class, adherence, source_type, status) VALUES ($1, $2, $3, $4, $5, $6, \
            $7, $8, $9, $10, $11, $12) RETURNING *",
        )
        .bind(self.medication_reconciliation_id)
        .bind(&self.list_source)
        .bind(&self.drug_name)
        .bind(&self.form)
        .bind(&self.dose)
        .bind(&self.route)
        .bind(&self.frequency)
        .bind(&self.indication)
        .bind(&self.high_risk_class)
        .bind(&self.adherence)
        .bind(&self.source_type)
        .bind(&self.status)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE medication_reconciliation_line_items SET medication_reconciliation_id \
            = $2, list_source = $3, drug_name = $4, form = $5, dose = $6, route = $7, \
            frequency = $8, indication = $9, high_risk_class = $10, adherence = $11, \
            source_type = $12, status = $13, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.medication_reconciliation_id)
        .bind(&self.list_source)
        .bind(&self.drug_name)
        .bind(&self.form)
        .bind(&self.dose)
        .bind(&self.route)
        .bind(&self.frequency)
        .bind(&self.indication)
        .bind(&self.high_risk_class)
        .bind(&self.adherence)
        .bind(&self.source_type)
        .bind(&self.status)
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
        .prefix("api/medication_reconciliation_line_items/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
