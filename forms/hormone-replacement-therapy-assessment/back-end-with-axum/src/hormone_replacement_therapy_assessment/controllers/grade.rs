//! Grade module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::grades::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Assessment id.
    pub assessment_id: Uuid,
    /// Mrs total score.
    pub mrs_total_score: i32,
    /// Somatic subscale score.
    pub somatic_subscale_score: i32,
    /// Psychological subscale score.
    pub psychological_subscale_score: i32,
    /// Urogenital subscale score.
    pub urogenital_subscale_score: i32,
    /// Overall severity.
    pub overall_severity: String,
    /// Hrt eligibility.
    pub hrt_eligibility: String,
    /// Graded at.
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO grades (assessment_id, mrs_total_score, somatic_subscale_score, \
            psychological_subscale_score, urogenital_subscale_score, overall_severity, \
            hrt_eligibility, graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) \
            RETURNING *",
        )
        .bind(self.assessment_id)
        .bind(self.mrs_total_score)
        .bind(self.somatic_subscale_score)
        .bind(self.psychological_subscale_score)
        .bind(self.urogenital_subscale_score)
        .bind(&self.overall_severity)
        .bind(&self.hrt_eligibility)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE grades SET assessment_id = $2, mrs_total_score = $3, \
            somatic_subscale_score = $4, psychological_subscale_score = $5, \
            urogenital_subscale_score = $6, overall_severity = $7, hrt_eligibility = $8, \
            graded_at = $9, updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING *",
        )
        .bind(id)
        .bind(self.assessment_id)
        .bind(self.mrs_total_score)
        .bind(self.somatic_subscale_score)
        .bind(self.psychological_subscale_score)
        .bind(self.urogenital_subscale_score)
        .bind(&self.overall_severity)
        .bind(&self.hrt_eligibility)
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
        .prefix("api/grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
