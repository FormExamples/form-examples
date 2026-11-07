//! Assessment surgical history module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::assessment_surgical_histories::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Assessment id.
    pub assessment_id: Uuid,
    /// Has previous surgery.
    pub has_previous_surgery: String,
    /// Surgery considered.
    pub surgery_considered: String,
    /// Surgery considered details.
    pub surgery_considered_details: String,
    /// Patient preference.
    pub patient_preference: String,
    /// Comorbidities affecting surgery.
    pub comorbidities_affecting_surgery: String,
    /// Anaesthetic risk.
    pub anaesthetic_risk: String,
    /// Anticoagulant use.
    pub anticoagulant_use: String,
    /// Anticoagulant details.
    pub anticoagulant_details: String,
    /// Surgical history notes.
    pub surgical_history_notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO assessment_surgical_histories (assessment_id, \
            has_previous_surgery, surgery_considered, surgery_considered_details, \
            patient_preference, comorbidities_affecting_surgery, anaesthetic_risk, \
            anticoagulant_use, anticoagulant_details, surgical_history_notes) VALUES \
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
        )
        .bind(self.assessment_id)
        .bind(&self.has_previous_surgery)
        .bind(&self.surgery_considered)
        .bind(&self.surgery_considered_details)
        .bind(&self.patient_preference)
        .bind(&self.comorbidities_affecting_surgery)
        .bind(&self.anaesthetic_risk)
        .bind(&self.anticoagulant_use)
        .bind(&self.anticoagulant_details)
        .bind(&self.surgical_history_notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE assessment_surgical_histories SET assessment_id = $2, \
            has_previous_surgery = $3, surgery_considered = $4, \
            surgery_considered_details = $5, patient_preference = $6, \
            comorbidities_affecting_surgery = $7, anaesthetic_risk = $8, \
            anticoagulant_use = $9, anticoagulant_details = $10, surgical_history_notes \
            = $11, updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.assessment_id)
        .bind(&self.has_previous_surgery)
        .bind(&self.surgery_considered)
        .bind(&self.surgery_considered_details)
        .bind(&self.patient_preference)
        .bind(&self.comorbidities_affecting_surgery)
        .bind(&self.anaesthetic_risk)
        .bind(&self.anticoagulant_use)
        .bind(&self.anticoagulant_details)
        .bind(&self.surgical_history_notes)
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
        .prefix("api/assessment_surgical_histories/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
