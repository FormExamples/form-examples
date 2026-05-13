//! REST controllers for the Loco app. Same JSON wire surface as the
//! SvelteKit dashboard's `+server.ts` endpoints, backed by SeaORM
//! persistence in the `scorecards` table.

use std::collections::BTreeMap;

use axum::{Json, debug_handler, extract::Path};
use loco_rs::prelude::*;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::models::scorecards as scorecards_model;
use crate::scoring::bulk_import::parse_jsonl;
use crate::scoring::diff::diff_assessments;
use crate::scoring::grader::grade_scorecard;
use crate::scoring::pre_tender::summarise;
use crate::scoring::recommendations::get_recommended_actions;
use crate::scoring::types::AgileConsultingScorecardAssessment;
use crate::views::scorecard::ScorecardRow;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct DashboardScorecardsResponse {
    items: Vec<ScorecardRow>,
    total: usize,
}

#[debug_handler]
async fn list_scorecards(State(ctx): State<AppContext>) -> Result<Json<DashboardScorecardsResponse>> {
    let models = scorecards_model::list(&ctx.db).await?;
    let mut items: Vec<ScorecardRow> = Vec::with_capacity(models.len());
    for m in &models {
        if let Some(grade) = scorecards_model::grade(m)? {
            items.push(ScorecardRow::from_model(m, &grade));
        }
    }
    let total = items.len();
    Ok(Json(DashboardScorecardsResponse { items, total }))
}

#[debug_handler]
async fn get_scorecard(
    State(ctx): State<AppContext>,
    Path(id): Path<String>,
) -> Result<Response> {
    // Strip the optional "s-" prefix the SvelteKit dashboard uses.
    let stripped = id.strip_prefix("s-").unwrap_or(&id);
    let uuid = match Uuid::parse_str(stripped) {
        Ok(u) => u,
        Err(_) => {
            return Ok(format::json(serde_json::json!({
                "error": format!("invalid id: {id}")
            }))?
            .into_response());
        }
    };
    let Some(model) = scorecards_model::find_by_id(&ctx.db, uuid).await? else {
        return Ok(format::json(serde_json::json!({
            "error": format!("No scorecard found with id {id}")
        }))?
        .into_response());
    };
    let Some(grade) = scorecards_model::grade(&model)? else {
        return Ok(format::json(serde_json::json!({
            "error": "scorecard has no grade"
        }))?
        .into_response());
    };
    Ok(format::json(ScorecardRow::from_model(&model, &grade))?.into_response())
}

#[debug_handler]
async fn submit_scorecard(
    State(ctx): State<AppContext>,
    Json(body): Json<serde_json::Value>,
) -> Result<Response> {
    let assessment: AgileConsultingScorecardAssessment = match serde_json::from_value(body) {
        Ok(a) => a,
        Err(e) => {
            return Ok(format::json(serde_json::json!({
                "error": format!("schema validation failed: {e}")
            }))?
            .into_response());
        }
    };
    let model = scorecards_model::create(&ctx.db, &assessment).await?;
    let grade = scorecards_model::grade(&model)?.unwrap();
    Ok(format::json(ScorecardRow::from_model(&model, &grade))?.into_response())
}

#[debug_handler]
async fn grade_endpoint(Json(body): Json<serde_json::Value>) -> Result<Response> {
    let assessment: AgileConsultingScorecardAssessment = match serde_json::from_value(body) {
        Ok(a) => a,
        Err(e) => {
            return Ok(format::json(serde_json::json!({
                "error": format!("schema validation failed: {e}")
            }))?
            .into_response());
        }
    };
    let grade = grade_scorecard(&assessment);
    Ok(format::json(grade)?.into_response())
}

#[debug_handler]
async fn recommendations_endpoint(Json(body): Json<serde_json::Value>) -> Result<Response> {
    let assessment: AgileConsultingScorecardAssessment = match serde_json::from_value(body) {
        Ok(a) => a,
        Err(e) => {
            return Ok(format::json(serde_json::json!({
                "error": format!("schema validation failed: {e}")
            }))?
            .into_response());
        }
    };
    let actions = get_recommended_actions(&assessment);
    Ok(format::json(serde_json::json!({
        "items": actions,
        "total": actions.len(),
    }))?
    .into_response())
}

#[debug_handler]
async fn pre_tender_endpoint(Json(body): Json<serde_json::Value>) -> Result<Response> {
    let assessment: AgileConsultingScorecardAssessment = match serde_json::from_value(body) {
        Ok(a) => a,
        Err(e) => {
            return Ok(format::json(serde_json::json!({
                "error": format!("schema validation failed: {e}")
            }))?
            .into_response());
        }
    };
    Ok(format::json(summarise(&assessment))?.into_response())
}

#[derive(Debug, Deserialize)]
struct DiffRequest {
    before: AgileConsultingScorecardAssessment,
    after: AgileConsultingScorecardAssessment,
}

#[debug_handler]
async fn diff_endpoint(Json(body): Json<serde_json::Value>) -> Result<Response> {
    let req: DiffRequest = match serde_json::from_value(body) {
        Ok(a) => a,
        Err(e) => {
            return Ok(format::json(serde_json::json!({
                "error": format!("schema validation failed: {e}")
            }))?
            .into_response());
        }
    };
    Ok(format::json(diff_assessments(&req.before, &req.after))?.into_response())
}

#[debug_handler]
async fn bulk_import_endpoint(State(ctx): State<AppContext>, body: String) -> Result<Response> {
    let result = parse_jsonl(&body);
    for ai in &result.accepted {
        scorecards_model::create(&ctx.db, &ai.assessment).await?;
    }
    Ok(format::json(serde_json::json!({
        "accepted": result.accepted.len(),
        "rejected": result.rejected,
        "totalLines": result.total_lines,
        "skippedBlank": result.skipped_blank,
        "skippedComment": result.skipped_comment,
    }))?
    .into_response())
}

#[derive(Debug, Default, Serialize)]
#[serde(rename_all = "camelCase")]
struct BandCounts {
    low: usize,
    borderline: usize,
    medium: usize,
    high: usize,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct StatsResponse {
    total: usize,
    by_band: BandCounts,
    by_sector: BTreeMap<String, usize>,
    by_size: BTreeMap<String, usize>,
    flag_count: usize,
    flag_count_by_category: BTreeMap<String, usize>,
    average_score: f64,
}

#[debug_handler]
async fn stats_endpoint(State(ctx): State<AppContext>) -> Result<Json<StatsResponse>> {
    let models = scorecards_model::list(&ctx.db).await?;
    let total = models.len();
    let mut by_band = BandCounts::default();
    let mut by_sector: BTreeMap<String, usize> = BTreeMap::new();
    let mut by_size: BTreeMap<String, usize> = BTreeMap::new();
    let mut flag_count = 0usize;
    let mut flag_count_by_category: BTreeMap<String, usize> = BTreeMap::new();
    let mut sum_score = 0u64;

    for m in &models {
        match m.computed_band.as_str() {
            "low" => by_band.low += 1,
            "borderline" => by_band.borderline += 1,
            "medium" => by_band.medium += 1,
            "high" => by_band.high += 1,
            _ => {}
        }
        *by_sector.entry(m.sector.clone()).or_insert(0) += 1;
        *by_size.entry(m.size_band.clone()).or_insert(0) += 1;
        sum_score += m.score_total as u64;
        if let Some(grade) = scorecards_model::grade(m)? {
            for f in &grade.additional_flags {
                flag_count += 1;
                let cat = match f.category {
                    crate::scoring::types::FlagCategory::NoSeniorLeadershipBuyin => "no-senior-leadership-buyin",
                    crate::scoring::types::FlagCategory::NoCustomerContact => "no-customer-contact",
                    crate::scoring::types::FlagCategory::NoWorkingSoftware => "no-working-software",
                    crate::scoring::types::FlagCategory::NoSustainableBudget => "no-sustainable-budget",
                    crate::scoring::types::FlagCategory::NoSelfOrganization => "no-self-organization",
                    crate::scoring::types::FlagCategory::NoReflectionCulture => "no-reflection-culture",
                    crate::scoring::types::FlagCategory::Other => "other",
                };
                *flag_count_by_category.entry(cat.to_string()).or_insert(0) += 1;
            }
        }
    }

    let average_score = if total == 0 { 0.0 } else { sum_score as f64 / total as f64 };

    Ok(Json(StatsResponse {
        total,
        by_band,
        by_sector,
        by_size,
        flag_count,
        flag_count_by_category,
        average_score,
    }))
}

pub fn routes() -> Routes {
    Routes::new()
        .add("/api/dashboard/scorecards", get(list_scorecards))
        .add("/api/scorecards", post(submit_scorecard))
        .add("/api/scorecards/{id}", get(get_scorecard))
        .add("/api/grade", post(grade_endpoint))
        .add("/api/recommendations", post(recommendations_endpoint))
        .add("/api/pre-tender", post(pre_tender_endpoint))
        .add("/api/diff", post(diff_endpoint))
        .add("/api/bulk-import", post(bulk_import_endpoint))
        .add("/api/stats", get(stats_endpoint))
}
