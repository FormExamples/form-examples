#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::assessment_polypharmacy_reviews::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub assessment_id: Uuid,
    pub total_regular_medications: Option<i32>,
    pub total_prn_medications: Option<i32>,
    pub polypharmacy_flag: String,
    pub medication_review_date: Option<Date>,
    pub falls_risk_medications: String,
    pub falls_risk_medication_details: String,
    pub anticholinergic_burden: String,
    pub drug_interactions_identified: String,
    pub drug_interaction_details: String,
    pub adherence_concerns: String,
    pub adherence_details: String,
    pub stopp_start_review_done: String,
    pub deprescribing_opportunities: String,
    pub polypharmacy_notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO assessment_polypharmacy_reviews (assessment_id, \
            total_regular_medications, total_prn_medications, polypharmacy_flag, \
            medication_review_date, falls_risk_medications, \
            falls_risk_medication_details, anticholinergic_burden, \
            drug_interactions_identified, drug_interaction_details, adherence_concerns, \
            adherence_details, stopp_start_review_done, deprescribing_opportunities, \
            polypharmacy_notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, \
            $12, $13, $14, $15) RETURNING *",
        )
        .bind(self.assessment_id)
        .bind(self.total_regular_medications)
        .bind(self.total_prn_medications)
        .bind(&self.polypharmacy_flag)
        .bind(self.medication_review_date)
        .bind(&self.falls_risk_medications)
        .bind(&self.falls_risk_medication_details)
        .bind(&self.anticholinergic_burden)
        .bind(&self.drug_interactions_identified)
        .bind(&self.drug_interaction_details)
        .bind(&self.adherence_concerns)
        .bind(&self.adherence_details)
        .bind(&self.stopp_start_review_done)
        .bind(&self.deprescribing_opportunities)
        .bind(&self.polypharmacy_notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE assessment_polypharmacy_reviews SET assessment_id = $2, \
            total_regular_medications = $3, total_prn_medications = $4, \
            polypharmacy_flag = $5, medication_review_date = $6, falls_risk_medications \
            = $7, falls_risk_medication_details = $8, anticholinergic_burden = $9, \
            drug_interactions_identified = $10, drug_interaction_details = $11, \
            adherence_concerns = $12, adherence_details = $13, stopp_start_review_done = \
            $14, deprescribing_opportunities = $15, polypharmacy_notes = $16, updated_at \
            = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.assessment_id)
        .bind(self.total_regular_medications)
        .bind(self.total_prn_medications)
        .bind(&self.polypharmacy_flag)
        .bind(self.medication_review_date)
        .bind(&self.falls_risk_medications)
        .bind(&self.falls_risk_medication_details)
        .bind(&self.anticholinergic_burden)
        .bind(&self.drug_interactions_identified)
        .bind(&self.drug_interaction_details)
        .bind(&self.adherence_concerns)
        .bind(&self.adherence_details)
        .bind(&self.stopp_start_review_done)
        .bind(&self.deprescribing_opportunities)
        .bind(&self.polypharmacy_notes)
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
        .prefix("api/assessment_polypharmacy_reviews/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
