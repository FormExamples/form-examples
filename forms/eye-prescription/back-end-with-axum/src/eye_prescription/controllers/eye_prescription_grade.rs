//! Eye prescription grade module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::eye_prescription_grades::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Eye prescription id.
    pub eye_prescription_id: Uuid,
    /// Right eye sphere class.
    pub right_eye_sphere_class: String,
    /// Right eye cylinder class.
    pub right_eye_cylinder_class: String,
    /// Left eye sphere class.
    pub left_eye_sphere_class: String,
    /// Left eye cylinder class.
    pub left_eye_cylinder_class: String,
    /// Presbyopia class.
    pub presbyopia_class: String,
    /// Anisometropia diopters.
    pub anisometropia_diopters: Option<f64>,
    /// Anisometropia significant.
    pub anisometropia_significant: bool,
    /// Prism present.
    pub prism_present: bool,
    /// Computed complexity.
    pub computed_complexity: String,
    /// Final complexity.
    pub final_complexity: String,
    /// Override reason.
    pub override_reason: String,
    /// Follow up interval months.
    pub follow_up_interval_months: Option<i32>,
    /// Prescriber notes.
    pub prescriber_notes: String,
    /// Signed at.
    pub signed_at: Option<DateTimeWithTimeZone>,
    /// Graded at.
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO eye_prescription_grades (eye_prescription_id, \
            right_eye_sphere_class, right_eye_cylinder_class, left_eye_sphere_class, \
            left_eye_cylinder_class, presbyopia_class, anisometropia_diopters, \
            anisometropia_significant, prism_present, computed_complexity, \
            final_complexity, override_reason, follow_up_interval_months, \
            prescriber_notes, signed_at, graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, \
            $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *",
        )
        .bind(self.eye_prescription_id)
        .bind(&self.right_eye_sphere_class)
        .bind(&self.right_eye_cylinder_class)
        .bind(&self.left_eye_sphere_class)
        .bind(&self.left_eye_cylinder_class)
        .bind(&self.presbyopia_class)
        .bind(self.anisometropia_diopters)
        .bind(self.anisometropia_significant)
        .bind(self.prism_present)
        .bind(&self.computed_complexity)
        .bind(&self.final_complexity)
        .bind(&self.override_reason)
        .bind(self.follow_up_interval_months)
        .bind(&self.prescriber_notes)
        .bind(self.signed_at)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE eye_prescription_grades SET eye_prescription_id = $2, \
            right_eye_sphere_class = $3, right_eye_cylinder_class = $4, \
            left_eye_sphere_class = $5, left_eye_cylinder_class = $6, presbyopia_class = \
            $7, anisometropia_diopters = $8, anisometropia_significant = $9, \
            prism_present = $10, computed_complexity = $11, final_complexity = $12, \
            override_reason = $13, follow_up_interval_months = $14, prescriber_notes = \
            $15, signed_at = $16, graded_at = $17, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.eye_prescription_id)
        .bind(&self.right_eye_sphere_class)
        .bind(&self.right_eye_cylinder_class)
        .bind(&self.left_eye_sphere_class)
        .bind(&self.left_eye_cylinder_class)
        .bind(&self.presbyopia_class)
        .bind(self.anisometropia_diopters)
        .bind(self.anisometropia_significant)
        .bind(self.prism_present)
        .bind(&self.computed_complexity)
        .bind(&self.final_complexity)
        .bind(&self.override_reason)
        .bind(self.follow_up_interval_months)
        .bind(&self.prescriber_notes)
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
        .prefix("api/eye_prescription_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
