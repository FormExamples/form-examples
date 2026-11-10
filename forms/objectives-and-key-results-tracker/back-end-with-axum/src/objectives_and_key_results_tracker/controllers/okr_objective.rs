//! Okr objective module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::okr_objectives::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Status.
    pub status: String,
    /// Level.
    pub level: String,
    /// Cycle.
    pub cycle: String,
    /// Cycle start date.
    pub cycle_start_date: Option<Date>,
    /// Cycle end date.
    pub cycle_end_date: Option<Date>,
    /// Team or org name.
    pub team_or_org_name: String,
    /// Strategic theme.
    pub strategic_theme: String,
    /// External reference.
    pub external_reference: String,
    /// Obj title.
    pub obj_title: String,
    /// Obj long description.
    pub obj_long_description: String,
    /// Sa parent summary.
    pub sa_parent_summary: String,
    /// Sa business value statement.
    pub sa_business_value_statement: String,
    /// In initiatives.
    pub in_initiatives: String,
    /// In supporting links.
    pub in_supporting_links: String,
    /// Rk known risks.
    pub rk_known_risks: String,
    /// Rk dependencies.
    pub rk_dependencies: String,
    /// Rk blockers.
    pub rk_blockers: String,
    /// Rk mitigation plans.
    pub rk_mitigation_plans: String,
    /// Fc expected end state.
    pub fc_expected_end_state: String,
    /// Fc residual risk.
    pub fc_residual_risk: String,
    /// Score by progress percent.
    pub score_by_progress_percent: Option<f64>,
    /// Score by confidence decile.
    pub score_by_confidence_decile: Option<i32>,
    /// Score by stretch tier.
    pub score_by_stretch_tier: Option<i32>,
    /// Score by alignment grade.
    pub score_by_alignment_grade: Option<i32>,
    /// Score by impact tier.
    pub score_by_impact_tier: Option<i32>,
    /// Score by smart quality.
    pub score_by_smart_quality: Option<i32>,
    /// Score by pace deviation percent.
    pub score_by_pace_deviation_percent: Option<f64>,
    /// Reporter id.
    pub reporter_id: Uuid,
    /// Parent objective id.
    pub parent_objective_id: Option<Uuid>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO okr_objectives (status, level, cycle, cycle_start_date, \
            cycle_end_date, team_or_org_name, strategic_theme, external_reference, \
            obj_title, obj_long_description, sa_parent_summary, \
            sa_business_value_statement, in_initiatives, in_supporting_links, \
            rk_known_risks, rk_dependencies, rk_blockers, rk_mitigation_plans, \
            fc_expected_end_state, fc_residual_risk, score_by_progress_percent, \
            score_by_confidence_decile, score_by_stretch_tier, score_by_alignment_grade, \
            score_by_impact_tier, score_by_smart_quality, \
            score_by_pace_deviation_percent, reporter_id, parent_objective_id) VALUES \
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, \
            $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29) RETURNING *",
        )
        .bind(&self.status)
        .bind(&self.level)
        .bind(&self.cycle)
        .bind(self.cycle_start_date)
        .bind(self.cycle_end_date)
        .bind(&self.team_or_org_name)
        .bind(&self.strategic_theme)
        .bind(&self.external_reference)
        .bind(&self.obj_title)
        .bind(&self.obj_long_description)
        .bind(&self.sa_parent_summary)
        .bind(&self.sa_business_value_statement)
        .bind(&self.in_initiatives)
        .bind(&self.in_supporting_links)
        .bind(&self.rk_known_risks)
        .bind(&self.rk_dependencies)
        .bind(&self.rk_blockers)
        .bind(&self.rk_mitigation_plans)
        .bind(&self.fc_expected_end_state)
        .bind(&self.fc_residual_risk)
        .bind(self.score_by_progress_percent)
        .bind(self.score_by_confidence_decile)
        .bind(self.score_by_stretch_tier)
        .bind(self.score_by_alignment_grade)
        .bind(self.score_by_impact_tier)
        .bind(self.score_by_smart_quality)
        .bind(self.score_by_pace_deviation_percent)
        .bind(self.reporter_id)
        .bind(self.parent_objective_id)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE okr_objectives SET status = $2, level = $3, cycle = $4, \
            cycle_start_date = $5, cycle_end_date = $6, team_or_org_name = $7, \
            strategic_theme = $8, external_reference = $9, obj_title = $10, \
            obj_long_description = $11, sa_parent_summary = $12, \
            sa_business_value_statement = $13, in_initiatives = $14, in_supporting_links \
            = $15, rk_known_risks = $16, rk_dependencies = $17, rk_blockers = $18, \
            rk_mitigation_plans = $19, fc_expected_end_state = $20, fc_residual_risk = \
            $21, score_by_progress_percent = $22, score_by_confidence_decile = $23, \
            score_by_stretch_tier = $24, score_by_alignment_grade = $25, \
            score_by_impact_tier = $26, score_by_smart_quality = $27, \
            score_by_pace_deviation_percent = $28, reporter_id = $29, \
            parent_objective_id = $30, updated_at = now() WHERE id = $1 AND deleted_at \
            IS NULL RETURNING *",
        )
        .bind(id)
        .bind(&self.status)
        .bind(&self.level)
        .bind(&self.cycle)
        .bind(self.cycle_start_date)
        .bind(self.cycle_end_date)
        .bind(&self.team_or_org_name)
        .bind(&self.strategic_theme)
        .bind(&self.external_reference)
        .bind(&self.obj_title)
        .bind(&self.obj_long_description)
        .bind(&self.sa_parent_summary)
        .bind(&self.sa_business_value_statement)
        .bind(&self.in_initiatives)
        .bind(&self.in_supporting_links)
        .bind(&self.rk_known_risks)
        .bind(&self.rk_dependencies)
        .bind(&self.rk_blockers)
        .bind(&self.rk_mitigation_plans)
        .bind(&self.fc_expected_end_state)
        .bind(&self.fc_residual_risk)
        .bind(self.score_by_progress_percent)
        .bind(self.score_by_confidence_decile)
        .bind(self.score_by_stretch_tier)
        .bind(self.score_by_alignment_grade)
        .bind(self.score_by_impact_tier)
        .bind(self.score_by_smart_quality)
        .bind(self.score_by_pace_deviation_percent)
        .bind(self.reporter_id)
        .bind(self.parent_objective_id)
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
    OriginalUri(uri): OriginalUri,
) -> Result<Response> {
    let page = cursor_page(&ctx, &uri)?;
    let rows = Model::page(&db(&ctx), &page).await?;
    Ok(page.respond(rows))
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
        .prefix("api/okr_objectives/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
