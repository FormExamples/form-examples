#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::hip_replacement_surgery_evaluation_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub hip_replacement_surgery_evaluation_id: Uuid,
    pub ohs_total: Option<i32>,
    pub ohs_category: String,
    pub computed_candidacy: String,
    pub final_candidacy: String,
    pub override_reason: String,
    pub clinician_notes: String,
    pub signed_by_name: String,
    pub signed_at: Option<DateTimeWithTimeZone>,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO hip_replacement_surgery_evaluation_grades \
            (hip_replacement_surgery_evaluation_id, ohs_total, ohs_category, \
            computed_candidacy, final_candidacy, override_reason, clinician_notes, \
            signed_by_name, signed_at, graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, \
            $8, $9, $10) RETURNING *",
        )
        .bind(self.hip_replacement_surgery_evaluation_id)
        .bind(self.ohs_total)
        .bind(&self.ohs_category)
        .bind(&self.computed_candidacy)
        .bind(&self.final_candidacy)
        .bind(&self.override_reason)
        .bind(&self.clinician_notes)
        .bind(&self.signed_by_name)
        .bind(self.signed_at)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE hip_replacement_surgery_evaluation_grades SET \
            hip_replacement_surgery_evaluation_id = $2, ohs_total = $3, ohs_category = \
            $4, computed_candidacy = $5, final_candidacy = $6, override_reason = $7, \
            clinician_notes = $8, signed_by_name = $9, signed_at = $10, graded_at = $11, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.hip_replacement_surgery_evaluation_id)
        .bind(self.ohs_total)
        .bind(&self.ohs_category)
        .bind(&self.computed_candidacy)
        .bind(&self.final_candidacy)
        .bind(&self.override_reason)
        .bind(&self.clinician_notes)
        .bind(&self.signed_by_name)
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

#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = paging::resolve(&params)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    paging::respond(page, total, rows)
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
        .prefix("api/hip_replacement_surgery_evaluation_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
