//! Lasting power of attorney module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::lasting_power_of_attorneys::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Decision mode.
    pub decision_mode: String,
    /// Decision mode mixed text.
    pub decision_mode_mixed_text: String,
    /// When attorneys can act.
    pub when_attorneys_can_act: String,
    /// Preferences text.
    pub preferences_text: String,
    /// Instructions text.
    pub instructions_text: String,
    /// Legal rights acknowledged.
    pub legal_rights_acknowledged: bool,
    /// Opg reference number.
    pub opg_reference_number: String,
    /// Opg registration date.
    pub opg_registration_date: Option<Date>,
    /// Status.
    pub status: String,
    /// Donor person id.
    pub donor_person_id: Uuid,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO lasting_power_of_attorneys (decision_mode, \
            decision_mode_mixed_text, when_attorneys_can_act, preferences_text, \
            instructions_text, legal_rights_acknowledged, opg_reference_number, \
            opg_registration_date, status, donor_person_id) VALUES ($1, $2, $3, $4, $5, \
            $6, $7, $8, $9, $10) RETURNING *",
        )
        .bind(&self.decision_mode)
        .bind(&self.decision_mode_mixed_text)
        .bind(&self.when_attorneys_can_act)
        .bind(&self.preferences_text)
        .bind(&self.instructions_text)
        .bind(self.legal_rights_acknowledged)
        .bind(&self.opg_reference_number)
        .bind(self.opg_registration_date)
        .bind(&self.status)
        .bind(self.donor_person_id)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE lasting_power_of_attorneys SET decision_mode = $2, \
            decision_mode_mixed_text = $3, when_attorneys_can_act = $4, preferences_text \
            = $5, instructions_text = $6, legal_rights_acknowledged = $7, \
            opg_reference_number = $8, opg_registration_date = $9, status = $10, \
            donor_person_id = $11, updated_at = now() WHERE id = $1 AND deleted_at IS \
            NULL RETURNING *",
        )
        .bind(id)
        .bind(&self.decision_mode)
        .bind(&self.decision_mode_mixed_text)
        .bind(&self.when_attorneys_can_act)
        .bind(&self.preferences_text)
        .bind(&self.instructions_text)
        .bind(self.legal_rights_acknowledged)
        .bind(&self.opg_reference_number)
        .bind(self.opg_registration_date)
        .bind(&self.status)
        .bind(self.donor_person_id)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

/// List.
#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = params.resolve(PAGE_LIMITS)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    Ok(page.respond(total, rows))
}

/// Add.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

/// Update.
#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

/// Remove.
#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

/// Get one.
#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

/// Routes.
pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/lasting_power_of_attorneys/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
