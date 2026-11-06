#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::structured_medication_review_medicines::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub structured_medication_review_id: Uuid,
    pub drug_name: String,
    pub form_strength: String,
    pub dose_regimen: String,
    pub indication: String,
    pub indication_recorded: String,
    pub is_regular: String,
    pub is_high_risk: String,
    pub high_risk_class: String,
    pub adherence: String,
    pub anticholinergic_burden_points: Option<i32>,
    pub monitoring_required: String,
    pub monitoring_up_to_date: String,
    pub deprescribing_candidate: String,
    pub stopp_criterion: String,
    pub start_criterion: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO structured_medication_review_medicines \
            (structured_medication_review_id, drug_name, form_strength, dose_regimen, \
            indication, indication_recorded, is_regular, is_high_risk, high_risk_class, \
            adherence, anticholinergic_burden_points, monitoring_required, \
            monitoring_up_to_date, deprescribing_candidate, stopp_criterion, start_criterion) \
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) \
            RETURNING *",
        )
        .bind(self.structured_medication_review_id)
        .bind(&self.drug_name)
        .bind(&self.form_strength)
        .bind(&self.dose_regimen)
        .bind(&self.indication)
        .bind(&self.indication_recorded)
        .bind(&self.is_regular)
        .bind(&self.is_high_risk)
        .bind(&self.high_risk_class)
        .bind(&self.adherence)
        .bind(self.anticholinergic_burden_points)
        .bind(&self.monitoring_required)
        .bind(&self.monitoring_up_to_date)
        .bind(&self.deprescribing_candidate)
        .bind(&self.stopp_criterion)
        .bind(&self.start_criterion)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE structured_medication_review_medicines SET structured_medication_review_id \
            = $2, drug_name = $3, form_strength = $4, dose_regimen = $5, indication = $6, \
            indication_recorded = $7, is_regular = $8, is_high_risk = $9, high_risk_class = \
            $10, adherence = $11, anticholinergic_burden_points = $12, monitoring_required = \
            $13, monitoring_up_to_date = $14, deprescribing_candidate = $15, stopp_criterion \
            = $16, start_criterion = $17, updated_at = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.structured_medication_review_id)
        .bind(&self.drug_name)
        .bind(&self.form_strength)
        .bind(&self.dose_regimen)
        .bind(&self.indication)
        .bind(&self.indication_recorded)
        .bind(&self.is_regular)
        .bind(&self.is_high_risk)
        .bind(&self.high_risk_class)
        .bind(&self.adherence)
        .bind(self.anticholinergic_burden_points)
        .bind(&self.monitoring_required)
        .bind(&self.monitoring_up_to_date)
        .bind(&self.deprescribing_candidate)
        .bind(&self.stopp_criterion)
        .bind(&self.start_criterion)
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
        .prefix("api/structured_medication_review_medicines/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
