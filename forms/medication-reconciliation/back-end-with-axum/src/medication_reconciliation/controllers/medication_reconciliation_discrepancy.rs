#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::medication_reconciliation_discrepancies::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub medication_reconciliation_id: Uuid,
    pub discrepancy_type: String,
    pub bpmh_item_ref: String,
    pub inpatient_item_ref: String,
    pub intended_action: String,
    pub rationale: String,
    pub intentional: bool,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO medication_reconciliation_discrepancies \
            (medication_reconciliation_id, discrepancy_type, bpmh_item_ref, \
            inpatient_item_ref, intended_action, rationale, intentional) VALUES ($1, $2, $3, \
            $4, $5, $6, $7) RETURNING *",
        )
        .bind(self.medication_reconciliation_id)
        .bind(&self.discrepancy_type)
        .bind(&self.bpmh_item_ref)
        .bind(&self.inpatient_item_ref)
        .bind(&self.intended_action)
        .bind(&self.rationale)
        .bind(self.intentional)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE medication_reconciliation_discrepancies SET \
            medication_reconciliation_id = $2, discrepancy_type = $3, bpmh_item_ref = \
            $4, inpatient_item_ref = $5, intended_action = $6, rationale = $7, \
            intentional = $8, updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING *",
        )
        .bind(id)
        .bind(self.medication_reconciliation_id)
        .bind(&self.discrepancy_type)
        .bind(&self.bpmh_item_ref)
        .bind(&self.inpatient_item_ref)
        .bind(&self.intended_action)
        .bind(&self.rationale)
        .bind(self.intentional)
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
        .prefix("api/medication_reconciliation_discrepancies/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
