#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::electrocardiogram_test_result_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub electrocardiogram_test_result_id: Uuid,
    pub result_classification: String,
    pub abnormality_severity: String,
    pub reporting_category: String,
    pub report_completeness_percent: Option<i32>,
    pub follow_up_urgency: String,
    pub target_timeframe: String,
    pub recommended_action: String,
    pub recommendation: String,
    pub clinician_notes: String,
    pub signed_at: Option<DateTimeWithTimeZone>,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO electrocardiogram_test_result_grades \
            (electrocardiogram_test_result_id, result_classification, \
            abnormality_severity, reporting_category, report_completeness_percent, \
            follow_up_urgency, target_timeframe, recommended_action, recommendation, \
            clinician_notes, signed_at, graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, \
            $8, $9, $10, $11, $12) RETURNING *",
        )
        .bind(self.electrocardiogram_test_result_id)
        .bind(&self.result_classification)
        .bind(&self.abnormality_severity)
        .bind(&self.reporting_category)
        .bind(self.report_completeness_percent)
        .bind(&self.follow_up_urgency)
        .bind(&self.target_timeframe)
        .bind(&self.recommended_action)
        .bind(&self.recommendation)
        .bind(&self.clinician_notes)
        .bind(self.signed_at)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE electrocardiogram_test_result_grades SET \
            electrocardiogram_test_result_id = $2, result_classification = $3, \
            abnormality_severity = $4, reporting_category = $5, \
            report_completeness_percent = $6, follow_up_urgency = $7, target_timeframe = \
            $8, recommended_action = $9, recommendation = $10, clinician_notes = $11, \
            signed_at = $12, graded_at = $13, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.electrocardiogram_test_result_id)
        .bind(&self.result_classification)
        .bind(&self.abnormality_severity)
        .bind(&self.reporting_category)
        .bind(self.report_completeness_percent)
        .bind(&self.follow_up_urgency)
        .bind(&self.target_timeframe)
        .bind(&self.recommended_action)
        .bind(&self.recommendation)
        .bind(&self.clinician_notes)
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
    OriginalUri(uri): OriginalUri,
) -> Result<Response> {
    let page = cursor_page(&ctx, &uri)?;
    let rows = Model::page(&db(&ctx), &page).await?;
    Ok(page.respond(rows))
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
        .prefix("api/electrocardiogram_test_result_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
