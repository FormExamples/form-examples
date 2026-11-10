#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::chronic_obstructive_pulmonary_disease_review_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub chronic_obstructive_pulmonary_disease_review_id: Uuid,
    pub gold_airflow_grade: String,
    pub symptom_burden: String,
    pub exacerbation_risk: String,
    pub abe_group: String,
    pub review_status: String,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO chronic_obstructive_pulmonary_disease_review_grades \
            (chronic_obstructive_pulmonary_disease_review_id, gold_airflow_grade, \
            symptom_burden, exacerbation_risk, abe_group, review_status, graded_at) VALUES \
            ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        )
        .bind(self.chronic_obstructive_pulmonary_disease_review_id)
        .bind(&self.gold_airflow_grade)
        .bind(&self.symptom_burden)
        .bind(&self.exacerbation_risk)
        .bind(&self.abe_group)
        .bind(&self.review_status)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE chronic_obstructive_pulmonary_disease_review_grades SET \
            chronic_obstructive_pulmonary_disease_review_id = $2, gold_airflow_grade = \
            $3, symptom_burden = $4, exacerbation_risk = $5, abe_group = $6, \
            review_status = $7, graded_at = $8, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.chronic_obstructive_pulmonary_disease_review_id)
        .bind(&self.gold_airflow_grade)
        .bind(&self.symptom_burden)
        .bind(&self.exacerbation_risk)
        .bind(&self.abe_group)
        .bind(&self.review_status)
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
        .prefix("api/chronic_obstructive_pulmonary_disease_review_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
