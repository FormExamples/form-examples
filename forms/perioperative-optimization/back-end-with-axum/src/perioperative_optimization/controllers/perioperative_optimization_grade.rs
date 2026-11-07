#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::perioperative_optimization_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub perioperative_optimization_id: Uuid,
    pub weeks_to_surgery: Option<i32>,
    pub gating_applied: bool,
    pub must_score: Option<i32>,
    pub must_risk: String,
    pub audit_c_score: Option<i32>,
    pub stop_bang_score: Option<i32>,
    pub duke_activity_status_index: Option<f64>,
    pub clinical_frailty_scale: Option<i32>,
    pub fried_phenotype_score: Option<i32>,
    pub fried_frailty_category: String,
    pub domains_optimized: Option<i32>,
    pub domains_in_progress: Option<i32>,
    pub domains_action_required: Option<i32>,
    pub domains_insufficient_time: Option<i32>,
    pub computed_readiness: String,
    pub final_readiness: String,
    pub override_reason: String,
    pub gate_decision: String,
    pub recommended_earliest_surgery_date: Option<Date>,
    pub clinician_notes: String,
    pub signed_by_name: String,
    pub signed_at: Option<DateTimeWithTimeZone>,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO perioperative_optimization_grades \
            (perioperative_optimization_id, weeks_to_surgery, gating_applied, \
            must_score, must_risk, audit_c_score, stop_bang_score, \
            duke_activity_status_index, clinical_frailty_scale, fried_phenotype_score, \
            fried_frailty_category, domains_optimized, domains_in_progress, \
            domains_action_required, domains_insufficient_time, computed_readiness, \
            final_readiness, override_reason, gate_decision, \
            recommended_earliest_surgery_date, clinician_notes, signed_by_name, \
            signed_at, graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, \
            $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24) RETURNING *",
        )
        .bind(self.perioperative_optimization_id)
        .bind(self.weeks_to_surgery)
        .bind(self.gating_applied)
        .bind(self.must_score)
        .bind(&self.must_risk)
        .bind(self.audit_c_score)
        .bind(self.stop_bang_score)
        .bind(self.duke_activity_status_index)
        .bind(self.clinical_frailty_scale)
        .bind(self.fried_phenotype_score)
        .bind(&self.fried_frailty_category)
        .bind(self.domains_optimized)
        .bind(self.domains_in_progress)
        .bind(self.domains_action_required)
        .bind(self.domains_insufficient_time)
        .bind(&self.computed_readiness)
        .bind(&self.final_readiness)
        .bind(&self.override_reason)
        .bind(&self.gate_decision)
        .bind(self.recommended_earliest_surgery_date)
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
            "UPDATE perioperative_optimization_grades SET perioperative_optimization_id = \
            $2, weeks_to_surgery = $3, gating_applied = $4, must_score = $5, must_risk = \
            $6, audit_c_score = $7, stop_bang_score = $8, duke_activity_status_index = \
            $9, clinical_frailty_scale = $10, fried_phenotype_score = $11, \
            fried_frailty_category = $12, domains_optimized = $13, domains_in_progress = \
            $14, domains_action_required = $15, domains_insufficient_time = $16, \
            computed_readiness = $17, final_readiness = $18, override_reason = $19, \
            gate_decision = $20, recommended_earliest_surgery_date = $21, \
            clinician_notes = $22, signed_by_name = $23, signed_at = $24, graded_at = \
            $25, updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.perioperative_optimization_id)
        .bind(self.weeks_to_surgery)
        .bind(self.gating_applied)
        .bind(self.must_score)
        .bind(&self.must_risk)
        .bind(self.audit_c_score)
        .bind(self.stop_bang_score)
        .bind(self.duke_activity_status_index)
        .bind(self.clinical_frailty_scale)
        .bind(self.fried_phenotype_score)
        .bind(&self.fried_frailty_category)
        .bind(self.domains_optimized)
        .bind(self.domains_in_progress)
        .bind(self.domains_action_required)
        .bind(self.domains_insufficient_time)
        .bind(&self.computed_readiness)
        .bind(&self.final_readiness)
        .bind(&self.override_reason)
        .bind(&self.gate_decision)
        .bind(self.recommended_earliest_surgery_date)
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
    let page = params.resolve(PAGE_LIMITS)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    Ok(page.respond(total, rows))
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
        .prefix("api/perioperative_optimization_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
