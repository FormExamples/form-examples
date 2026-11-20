//! Property tax exemption application grade module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::property_tax_exemption_application_grades::Model;
use crate::support::validation::{TEXT_MAX, plausible_date, unprocessable};

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Property tax exemption application id.
    pub property_tax_exemption_application_id: Uuid,
    /// Eligibility class.
    pub eligibility_class: String,
    /// Filing deadline.
    #[validate(custom(function = "plausible_date"))]
    pub filing_deadline: Option<Date>,
    /// Filed late.
    pub filed_late: String,
    /// Qualifying exemptions.
    #[validate(length(max = TEXT_MAX))]
    pub qualifying_exemptions: String,
    /// Graded at.
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO property_tax_exemption_application_grades \
            (property_tax_exemption_application_id, eligibility_class, filing_deadline, \
            filed_late, qualifying_exemptions, graded_at) VALUES ($1, $2, $3, $4, $5, \
            $6) RETURNING *",
        )
        .bind(self.property_tax_exemption_application_id)
        .bind(&self.eligibility_class)
        .bind(self.filing_deadline)
        .bind(&self.filed_late)
        .bind(&self.qualifying_exemptions)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE property_tax_exemption_application_grades SET \
            property_tax_exemption_application_id = $2, eligibility_class = $3, \
            filing_deadline = $4, filed_late = $5, qualifying_exemptions = $6, graded_at \
            = $7, updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.property_tax_exemption_application_id)
        .bind(&self.eligibility_class)
        .bind(self.filing_deadline)
        .bind(&self.filed_late)
        .bind(&self.qualifying_exemptions)
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
        .prefix("api/united-states-property-tax-exemption-application/property_tax_exemption_application_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
