//! Medical device assessment grade module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::medical_device_assessment_grades::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Medical device assessment ID.
    pub medical_device_assessment_id: Uuid,
    /// Computed device class.
    pub computed_device_class: String,
    /// Final device class.
    pub final_device_class: String,
    /// Class suffix.
    pub class_suffix: String,
    /// Override reason.
    pub override_reason: String,
    /// Conformity route.
    pub conformity_route: String,
    /// Determining rule.
    pub determining_rule: String,
    /// Regulatory readiness.
    pub regulatory_readiness: String,
    /// Assessor notes.
    pub assessor_notes: String,
    /// Signed at.
    pub signed_at: Option<DateTimeWithTimeZone>,
    /// Graded at.
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO medical_device_assessment_grades (medical_device_assessment_id, \
            computed_device_class, final_device_class, class_suffix, override_reason, \
            conformity_route, determining_rule, regulatory_readiness, assessor_notes, \
            signed_at, graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) \
            RETURNING *",
        )
        .bind(self.medical_device_assessment_id)
        .bind(&self.computed_device_class)
        .bind(&self.final_device_class)
        .bind(&self.class_suffix)
        .bind(&self.override_reason)
        .bind(&self.conformity_route)
        .bind(&self.determining_rule)
        .bind(&self.regulatory_readiness)
        .bind(&self.assessor_notes)
        .bind(self.signed_at)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE medical_device_assessment_grades SET medical_device_assessment_id = \
            $2, computed_device_class = $3, final_device_class = $4, class_suffix = $5, \
            override_reason = $6, conformity_route = $7, determining_rule = $8, \
            regulatory_readiness = $9, assessor_notes = $10, signed_at = $11, graded_at \
            = $12, updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.medical_device_assessment_id)
        .bind(&self.computed_device_class)
        .bind(&self.final_device_class)
        .bind(&self.class_suffix)
        .bind(&self.override_reason)
        .bind(&self.conformity_route)
        .bind(&self.determining_rule)
        .bind(&self.regulatory_readiness)
        .bind(&self.assessor_notes)
        .bind(self.signed_at)
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
        .prefix("api/medical_device_assessment_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
