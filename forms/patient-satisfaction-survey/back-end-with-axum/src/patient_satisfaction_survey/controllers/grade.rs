#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub assessment_id: Uuid,
    pub normalized_score: f64,
    pub satisfaction_category: String,
    pub domain_access_score: Option<f64>,
    pub domain_communication_score: Option<f64>,
    pub domain_clinical_care_score: Option<f64>,
    pub domain_staff_score: Option<f64>,
    pub domain_environment_score: Option<f64>,
    pub domain_discharge_score: Option<f64>,
    pub domain_overall_score: Option<f64>,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO grades (deleted_at, assessment_id, normalized_score, \
            satisfaction_category, domain_access_score, domain_communication_score, \
            domain_clinical_care_score, domain_staff_score, domain_environment_score, \
            domain_discharge_score, domain_overall_score, graded_at) VALUES ($1, $2, $3, $4, \
            $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.assessment_id)
        .bind(self.normalized_score)
        .bind(&self.satisfaction_category)
        .bind(self.domain_access_score)
        .bind(self.domain_communication_score)
        .bind(self.domain_clinical_care_score)
        .bind(self.domain_staff_score)
        .bind(self.domain_environment_score)
        .bind(self.domain_discharge_score)
        .bind(self.domain_overall_score)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE grades SET deleted_at = $2, assessment_id = $3, normalized_score = $4, \
            satisfaction_category = $5, domain_access_score = $6, domain_communication_score \
            = $7, domain_clinical_care_score = $8, domain_staff_score = $9, \
            domain_environment_score = $10, domain_discharge_score = $11, \
            domain_overall_score = $12, graded_at = $13, updated_at = now() WHERE id = $1 \
            RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.assessment_id)
        .bind(self.normalized_score)
        .bind(&self.satisfaction_category)
        .bind(self.domain_access_score)
        .bind(self.domain_communication_score)
        .bind(self.domain_clinical_care_score)
        .bind(self.domain_staff_score)
        .bind(self.domain_environment_score)
        .bind(self.domain_discharge_score)
        .bind(self.domain_overall_score)
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
        .prefix("api/grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
