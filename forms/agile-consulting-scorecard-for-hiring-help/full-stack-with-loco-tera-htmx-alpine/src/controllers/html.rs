//! Tera-rendered HTML pages: landing, dashboard, per-scorecard report.
//! Reads from the SeaORM `scorecards` table (via the `scorecards` model
//! helpers); writes are handled by the JSON `scorecards` controllers.

use std::collections::HashMap;
use std::sync::Arc;

use axum::{
    Extension, debug_handler,
    extract::{Form, Query},
    response::Redirect,
};
use loco_rs::prelude::*;
use serde::{Deserialize, Serialize};
use tera::{Context, Tera};
use uuid::Uuid;

use crate::models::scorecards as scorecards_model;
use crate::scoring::recommendations::get_recommended_actions;
use crate::scoring::types::{
    AgileConsultingScorecardAssessment, AssessmentMetadata, Band, ChecklistItem, ManifestoItems,
    OrganizationMetadata, PrinciplesItems, RespondentMetadata,
};
use crate::views::scorecard::ScorecardRow;

fn render(tera: &Tera, name: &str, context: &Context) -> Result<Response> {
    let body = tera
        .render(name, context)
        .map_err(|e| Error::BadRequest(format!("template error ({name}): {e}")))?;
    Ok(Response::builder()
        .header("Content-Type", "text/html; charset=utf-8")
        .body(axum::body::Body::from(body))
        .map_err(Error::wrap)?
        .into_response())
}

#[debug_handler]
async fn landing(Extension(tera): Extension<Arc<Tera>>) -> Result<Response> {
    render(&tera, "landing.html.tera", &Context::new())
}

#[derive(Debug, Default, Deserialize, Serialize)]
struct DashboardParams {
    #[serde(default)]
    band: String,
    #[serde(default)]
    sector: String,
    #[serde(default)]
    search: String,
}

fn build_rows(
    db_models: &[crate::models::_entities::scorecards::Model],
) -> Result<Vec<ScorecardRow>> {
    let mut out = Vec::with_capacity(db_models.len());
    for m in db_models {
        if let Some(grade) = scorecards_model::grade(m)? {
            out.push(ScorecardRow::from_model(m, &grade));
        }
    }
    Ok(out)
}

fn apply_filters(rows: Vec<ScorecardRow>, params: &DashboardParams) -> Vec<ScorecardRow> {
    let term = params.search.to_lowercase();
    rows.into_iter()
        .filter(|r| {
            if !params.band.is_empty() && r.computed_band != params.band {
                return false;
            }
            if !params.sector.is_empty() && r.sector != params.sector {
                return false;
            }
            if !term.is_empty() {
                let blob = format!("{} {}", r.organization_name, r.respondent_name).to_lowercase();
                if !blob.contains(&term) {
                    return false;
                }
            }
            true
        })
        .collect()
}

fn distinct_sectors(rows: &[ScorecardRow]) -> Vec<String> {
    let mut s: Vec<String> = rows.iter().map(|r| r.sector.clone()).filter(|x| !x.is_empty()).collect();
    s.sort();
    s.dedup();
    s
}

#[debug_handler]
async fn dashboard(
    State(ctx): State<AppContext>,
    Query(params): Query<DashboardParams>,
    Extension(tera): Extension<Arc<Tera>>,
) -> Result<Response> {
    let models = scorecards_model::list(&ctx.db).await?;
    let all_rows = build_rows(&models)?;
    let sectors = distinct_sectors(&all_rows);
    let rows = apply_filters(all_rows, &params);
    let total = rows.len();

    let mut context = Context::new();
    context.insert("rows", &rows);
    context.insert("total", &total);
    context.insert("band", &params.band);
    context.insert("sector", &params.sector);
    context.insert("search", &params.search);
    context.insert("sectors", &sectors);

    render(&tera, "dashboard.html.tera", &context)
}

#[debug_handler]
async fn dashboard_table(
    State(ctx): State<AppContext>,
    Query(params): Query<DashboardParams>,
    Extension(tera): Extension<Arc<Tera>>,
) -> Result<Response> {
    let models = scorecards_model::list(&ctx.db).await?;
    let rows = apply_filters(build_rows(&models)?, &params);

    let mut context = Context::new();
    context.insert("rows", &rows);
    render(&tera, "_scorecard_table.html.tera", &context)
}

fn band_recommendation_copy(band: Band) -> &'static str {
    match band {
        Band::Low => "Don't hire agile help yet — focus on internal operations first.",
        Band::Borderline => "Borderline — do your agile homework first; revisit in ~3 months.",
        Band::Medium => "Do your agile homework first; revisit the scorecard in ~3 months.",
        Band::High => "Likely ready — trial an engagement and review in ~3 months.",
    }
}

#[debug_handler]
async fn report(
    State(ctx): State<AppContext>,
    Path(id): Path<String>,
    Extension(tera): Extension<Arc<Tera>>,
) -> Result<Response> {
    let stripped = id.strip_prefix("s-").unwrap_or(&id);
    let Ok(uuid) = Uuid::parse_str(stripped) else {
        return Ok(format::json(serde_json::json!({
            "error": format!("invalid id: {id}")
        }))?
        .into_response());
    };
    let Some(model) = scorecards_model::find_by_id(&ctx.db, uuid).await? else {
        return Ok(Response::builder()
            .status(404)
            .header("Content-Type", "text/plain; charset=utf-8")
            .body(axum::body::Body::from(format!("No scorecard with id {id}")))
            .map_err(Error::wrap)?
            .into_response());
    };
    let Some(grade) = scorecards_model::grade(&model)? else {
        return Ok(Response::builder()
            .status(500)
            .header("Content-Type", "text/plain; charset=utf-8")
            .body(axum::body::Body::from(format!("scorecard {id} has no grade")))
            .map_err(Error::wrap)?
            .into_response());
    };
    let assessment = scorecards_model::assessment(&model)?;
    let row = ScorecardRow::from_model(&model, &grade);
    let recommendation_copy = band_recommendation_copy(grade.computed_band);
    let recommended_actions = get_recommended_actions(&assessment);

    let mut context = Context::new();
    context.insert("row", &row);
    context.insert("recommendation_copy", recommendation_copy);
    context.insert("recommended_actions", &recommended_actions);

    render(&tera, "report.html.tera", &context)
}

#[debug_handler]
async fn new_scorecard(Extension(tera): Extension<Arc<Tera>>) -> Result<Response> {
    render(&tera, "assessment.html.tera", &Context::new())
}

fn parse_answer(s: Option<&String>) -> Option<bool> {
    match s.map(|v| v.as_str()) {
        Some("true") => Some(true),
        Some("false") => Some(false),
        _ => None,
    }
}

fn item(form: &HashMap<String, String>, key: &str) -> ChecklistItem {
    let done_key = format!("item_{key}_done");
    let evidence_key = format!("item_{key}_evidence");
    ChecklistItem {
        done: parse_answer(form.get(&done_key)),
        evidence: form
            .get(&evidence_key)
            .cloned()
            .unwrap_or_default(),
    }
}

fn assessment_from_form(form: &HashMap<String, String>) -> AgileConsultingScorecardAssessment {
    let s = |k: &str| form.get(k).cloned().unwrap_or_default();
    AgileConsultingScorecardAssessment {
        organization: OrganizationMetadata {
            organization_name: s("organization_name"),
            legal_name: String::new(),
            sector: s("sector"),
            size_band: s("size_band"),
            headcount: None,
            country: String::new(),
            region: String::new(),
            website: String::new(),
        },
        respondent: RespondentMetadata {
            respondent_name: s("respondent_name"),
            respondent_email: s("respondent_email"),
            respondent_phone: String::new(),
            role: s("role"),
            department: String::new(),
            seniority: String::new(),
            timezone: String::new(),
            preferred_contact: String::new(),
        },
        assessment: AssessmentMetadata {
            assessment_date: s("assessment_date"),
            status: "submitted".to_string(),
        },
        manifesto: ManifestoItems {
            m1: item(form, "m1"),
            m2: item(form, "m2"),
            m3: item(form, "m3"),
            m4: item(form, "m4"),
        },
        principles: PrinciplesItems {
            p1: item(form, "p1"),
            p2: item(form, "p2"),
            p3: item(form, "p3"),
            p4: item(form, "p4"),
            p5: item(form, "p5"),
            p6: item(form, "p6"),
            p7: item(form, "p7"),
            p8: item(form, "p8"),
            p9: item(form, "p9"),
            p10: item(form, "p10"),
            p11: item(form, "p11"),
            p12: item(form, "p12"),
        },
    }
}

#[debug_handler]
async fn create_scorecard(
    State(ctx): State<AppContext>,
    Form(form): Form<HashMap<String, String>>,
) -> Result<Response> {
    let assessment = assessment_from_form(&form);
    let model = scorecards_model::create(&ctx.db, &assessment).await?;
    let short = format!("s-{}", &model.id.to_string()[..8]);
    Ok(Redirect::to(&format!("/scorecard/{short}")).into_response())
}

pub fn routes() -> Routes {
    Routes::new()
        .add("/", get(landing))
        .add("/scorecard/new", get(new_scorecard))
        .add("/scorecard/new", post(create_scorecard))
        .add("/dashboard", get(dashboard))
        .add("/dashboard/table", get(dashboard_table))
        .add("/scorecard/{id}", get(report))
}
