//! United states divorce petition grade module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::united_states_divorce_petition_grades::Model;
use crate::support::validation::{plausible_date, unprocessable};

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// United states divorce petition id.
    pub united_states_divorce_petition_id: Uuid,
    /// Readiness class.
    pub readiness_class: String,
    /// Property regime.
    pub property_regime: String,
    /// Earliest decree date.
    #[validate(custom(function = "plausible_date"))]
    pub earliest_decree_date: Option<Date>,
    /// State rule known.
    pub state_rule_known: String,
    /// Graded at.
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO united_states_divorce_petition_grades \
            (united_states_divorce_petition_id, readiness_class, property_regime, \
            earliest_decree_date, state_rule_known, graded_at) VALUES ($1, $2, $3, $4, \
            $5, $6) RETURNING *",
        )
        .bind(self.united_states_divorce_petition_id)
        .bind(&self.readiness_class)
        .bind(&self.property_regime)
        .bind(self.earliest_decree_date)
        .bind(&self.state_rule_known)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE united_states_divorce_petition_grades SET \
            united_states_divorce_petition_id = $2, readiness_class = $3, \
            property_regime = $4, earliest_decree_date = $5, state_rule_known = $6, \
            graded_at = $7, updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING *",
        )
        .bind(id)
        .bind(self.united_states_divorce_petition_id)
        .bind(&self.readiness_class)
        .bind(&self.property_regime)
        .bind(self.earliest_decree_date)
        .bind(&self.state_rule_known)
        .bind(self.graded_at)
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
    OriginalUri(uri): OriginalUri,
) -> Result<Response> {
    let page = cursor_page(&ctx, &uri)?;
    let rows = Model::page(&db(&ctx), &page).await?;
    Ok(page.respond(rows))
}

/// Add.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    params.validate().map_err(|e| unprocessable(&e))?;
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
    params.validate().map_err(|e| unprocessable(&e))?;
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
        .prefix("api/united_states_divorce_petition_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
