#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::cataract_diagnostic_evaluation_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub cataract_diagnostic_evaluation_id: Uuid,
    pub computed_locs_iii_severity_right: String,
    pub computed_locs_iii_severity_left: String,
    pub computed_surgical_candidacy: String,
    pub final_surgical_candidacy: String,
    pub override_reason: String,
    pub functional_impact_score: Option<i32>,
    pub clinician_notes: String,
    pub signed_by_name: String,
    pub signed_at: Option<DateTimeWithTimeZone>,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO cataract_diagnostic_evaluation_grades \
            (cataract_diagnostic_evaluation_id, computed_locs_iii_severity_right, \
            computed_locs_iii_severity_left, computed_surgical_candidacy, \
            final_surgical_candidacy, override_reason, functional_impact_score, \
            clinician_notes, signed_by_name, signed_at, graded_at) VALUES ($1, $2, $3, \
            $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
        )
        .bind(self.cataract_diagnostic_evaluation_id)
        .bind(&self.computed_locs_iii_severity_right)
        .bind(&self.computed_locs_iii_severity_left)
        .bind(&self.computed_surgical_candidacy)
        .bind(&self.final_surgical_candidacy)
        .bind(&self.override_reason)
        .bind(self.functional_impact_score)
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
            "UPDATE cataract_diagnostic_evaluation_grades SET \
            cataract_diagnostic_evaluation_id = $2, computed_locs_iii_severity_right = \
            $3, computed_locs_iii_severity_left = $4, computed_surgical_candidacy = $5, \
            final_surgical_candidacy = $6, override_reason = $7, functional_impact_score \
            = $8, clinician_notes = $9, signed_by_name = $10, signed_at = $11, graded_at \
            = $12, updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.cataract_diagnostic_evaluation_id)
        .bind(&self.computed_locs_iii_severity_right)
        .bind(&self.computed_locs_iii_severity_left)
        .bind(&self.computed_surgical_candidacy)
        .bind(&self.final_surgical_candidacy)
        .bind(&self.override_reason)
        .bind(self.functional_impact_score)
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
        .prefix("api/cataract_diagnostic_evaluation_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
