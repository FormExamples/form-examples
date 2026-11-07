//! Eligible condition module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::eligible_conditions::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Code.
    pub code: String,
    /// Label.
    pub label: String,
    /// Description.
    pub description: String,
    /// Requires appliance detail.
    pub requires_appliance_detail: String,
    /// Requires substitution therapy detail.
    pub requires_substitution_therapy_detail: String,
    /// Requires disability attestation.
    pub requires_disability_attestation: String,
    /// Requires cancer detail.
    pub requires_cancer_detail: String,
    /// Excludes diet only diabetes.
    pub excludes_diet_only_diabetes: String,
    /// Snomed ct reference.
    pub snomed_ct_reference: String,
    /// Icd10 reference.
    pub icd10_reference: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO eligible_conditions (code, label, description, \
            requires_appliance_detail, requires_substitution_therapy_detail, \
            requires_disability_attestation, requires_cancer_detail, \
            excludes_diet_only_diabetes, snomed_ct_reference, icd10_reference) VALUES \
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
        )
        .bind(&self.code)
        .bind(&self.label)
        .bind(&self.description)
        .bind(&self.requires_appliance_detail)
        .bind(&self.requires_substitution_therapy_detail)
        .bind(&self.requires_disability_attestation)
        .bind(&self.requires_cancer_detail)
        .bind(&self.excludes_diet_only_diabetes)
        .bind(&self.snomed_ct_reference)
        .bind(&self.icd10_reference)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE eligible_conditions SET code = $2, label = $3, description = $4, \
            requires_appliance_detail = $5, requires_substitution_therapy_detail = $6, \
            requires_disability_attestation = $7, requires_cancer_detail = $8, \
            excludes_diet_only_diabetes = $9, snomed_ct_reference = $10, icd10_reference \
            = $11, updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(&self.code)
        .bind(&self.label)
        .bind(&self.description)
        .bind(&self.requires_appliance_detail)
        .bind(&self.requires_substitution_therapy_detail)
        .bind(&self.requires_disability_attestation)
        .bind(&self.requires_cancer_detail)
        .bind(&self.excludes_diet_only_diabetes)
        .bind(&self.snomed_ct_reference)
        .bind(&self.icd10_reference)
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
        .prefix("api/eligible_conditions/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
