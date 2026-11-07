//! Assessment allergies module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::assessment_allergies::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Assessment id.
    pub assessment_id: Uuid,
    /// Has drug allergies.
    pub has_drug_allergies: String,
    /// Has food allergies.
    pub has_food_allergies: String,
    /// Has environmental allergies.
    pub has_environmental_allergies: String,
    /// Has latex allergy.
    pub has_latex_allergy: String,
    /// Has contrast allergy.
    pub has_contrast_allergy: String,
    /// Has anaesthetic allergy.
    pub has_anaesthetic_allergy: String,
    /// History of anaphylaxis.
    pub history_of_anaphylaxis: String,
    /// Carries epipen.
    pub carries_epipen: String,
    /// Allergies notes.
    pub allergies_notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO assessment_allergies (assessment_id, has_drug_allergies, \
            has_food_allergies, has_environmental_allergies, has_latex_allergy, \
            has_contrast_allergy, has_anaesthetic_allergy, history_of_anaphylaxis, \
            carries_epipen, allergies_notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, \
            $10) RETURNING *",
        )
        .bind(self.assessment_id)
        .bind(&self.has_drug_allergies)
        .bind(&self.has_food_allergies)
        .bind(&self.has_environmental_allergies)
        .bind(&self.has_latex_allergy)
        .bind(&self.has_contrast_allergy)
        .bind(&self.has_anaesthetic_allergy)
        .bind(&self.history_of_anaphylaxis)
        .bind(&self.carries_epipen)
        .bind(&self.allergies_notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE assessment_allergies SET assessment_id = $2, has_drug_allergies = $3, \
            has_food_allergies = $4, has_environmental_allergies = $5, has_latex_allergy \
            = $6, has_contrast_allergy = $7, has_anaesthetic_allergy = $8, \
            history_of_anaphylaxis = $9, carries_epipen = $10, allergies_notes = $11, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.assessment_id)
        .bind(&self.has_drug_allergies)
        .bind(&self.has_food_allergies)
        .bind(&self.has_environmental_allergies)
        .bind(&self.has_latex_allergy)
        .bind(&self.has_contrast_allergy)
        .bind(&self.has_anaesthetic_allergy)
        .bind(&self.history_of_anaphylaxis)
        .bind(&self.carries_epipen)
        .bind(&self.allergies_notes)
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
    let page = paging::resolve(&params)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    paging::respond(page, total, rows)
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
        .prefix("api/assessment_allergies/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
