//! HTTP routes for the psychology assessment.
//!
//! Endpoints:
//!
//! - `GET  /`                          → landing
//! - `POST /assessment/new`            → create a new assessment, redirect
//! - `GET  /assessment/{id}`           → single-page wizard
//! - `POST /assessment/{id}/submit`    → save form data, redirect to report
//! - `GET  /assessment/{id}/report`    → render scored report

use std::collections::HashMap;
use std::sync::Arc;

use axum::{
    extract::{Form, Path},
    response::{Html, IntoResponse, Redirect, Response},
    routing::{get, post},
    Extension, Router,
};
use tera::{Context, Tera};
use uuid::Uuid;

use crate::engine::types::AssessmentData;
use crate::views::assessment::{build_assessment_context, build_report_context};
use crate::Store;

/// GET / — landing page.
async fn landing(Extension(tera): Extension<Arc<Tera>>) -> Response {
    let context = Context::new();
    render(&tera, "landing.html.tera", &context)
}

/// POST /assessment/new — create a new assessment, redirect to its form.
async fn new_assessment(Extension(store): Extension<Store>) -> Redirect {
    let id = Uuid::new_v4();
    let mut guard = store.lock().expect("store poisoned");
    guard.insert(id, AssessmentData::default());
    Redirect::to(&format!("/assessment/{id}"))
}

/// GET /assessment/{id} — single-page wizard.
async fn show(
    Path(id): Path<Uuid>,
    Extension(tera): Extension<Arc<Tera>>,
    Extension(store): Extension<Store>,
) -> Response {
    let data = {
        let guard = store.lock().expect("store poisoned");
        guard.get(&id).cloned().unwrap_or_default()
    };
    let context = build_assessment_context(&data, id);
    render(&tera, "assessment/index.html.tera", &context)
}

/// POST /assessment/{id}/submit — save raw form data, redirect to report.
async fn submit(
    Path(id): Path<Uuid>,
    Extension(store): Extension<Store>,
    Form(form): Form<HashMap<String, String>>,
) -> Redirect {
    let data = form_to_assessment_data(&form);
    {
        let mut guard = store.lock().expect("store poisoned");
        guard.insert(id, data);
    }
    Redirect::to(&format!("/assessment/{id}/report"))
}

/// GET /assessment/{id}/report — render the scored report.
async fn report(
    Path(id): Path<Uuid>,
    Extension(tera): Extension<Arc<Tera>>,
    Extension(store): Extension<Store>,
) -> Response {
    let data = {
        let guard = store.lock().expect("store poisoned");
        guard.get(&id).cloned().unwrap_or_default()
    };
    let context = build_report_context(&data, id);
    render(&tera, "assessment/report.html.tera", &context)
}

/// Map a flat HashMap (from `application/x-www-form-urlencoded`) onto our
/// strongly-typed `AssessmentData`. Unknown / blank fields fall back to
/// defaults.
fn form_to_assessment_data(form: &HashMap<String, String>) -> AssessmentData {
    let mut data = AssessmentData::default();

    let s = |k: &str| form.get(k).cloned().unwrap_or_default();
    let item = |k: &str| -> Option<u8> {
        form.get(k).and_then(|v| v.parse::<u8>().ok())
    };

    data.demographics.first_name = s("firstName");
    data.demographics.last_name = s("lastName");
    data.demographics.date_of_birth = s("dateOfBirth");
    data.demographics.sex = s("sex");
    data.demographics.occupation = s("occupation");

    data.reason_for_assessment.reason = s("reason");
    data.reason_for_assessment.reason_details = s("reasonDetails");
    data.reason_for_assessment.primary_concern = s("primaryConcern");
    data.reason_for_assessment.symptom_duration_weeks =
        form.get("symptomDurationWeeks").and_then(|v| v.parse::<u32>().ok());

    data.dass_depression.item3_could_not_experience_positive = item("item3CouldNotExperiencePositive");
    data.dass_depression.item5_difficult_initiating = item("item5DifficultInitiating");
    data.dass_depression.item10_nothing_to_look_forward_to = item("item10NothingToLookForwardTo");
    data.dass_depression.item13_downhearted_blue = item("item13DownheartedBlue");
    data.dass_depression.item16_unable_to_become_enthusiastic = item("item16UnableToBecomeEnthusiastic");
    data.dass_depression.item17_not_worth_much = item("item17NotWorthMuch");
    data.dass_depression.item21_life_meaningless = item("item21LifeMeaningless");

    data.dass_anxiety.item2_dryness_of_mouth = item("item2DrynessOfMouth");
    data.dass_anxiety.item4_breathing_difficulty = item("item4BreathingDifficulty");
    data.dass_anxiety.item7_trembling = item("item7Trembling");
    data.dass_anxiety.item9_panic_worry = item("item9PanicWorry");
    data.dass_anxiety.item15_closed_to_panic = item("item15ClosedToPanic");
    data.dass_anxiety.item19_heart_action_aware = item("item19HeartActionAware");
    data.dass_anxiety.item20_scared_without_reason = item("item20ScaredWithoutReason");

    data.dass_stress.item1_hard_to_wind_down = item("item1HardToWindDown");
    data.dass_stress.item6_over_react = item("item6OverReact");
    data.dass_stress.item8_nervous_energy = item("item8NervousEnergy");
    data.dass_stress.item11_agitated_easily = item("item11AgitatedEasily");
    data.dass_stress.item12_difficult_to_relax = item("item12DifficultToRelax");
    data.dass_stress.item14_intolerant = item("item14Intolerant");
    data.dass_stress.item18_touchy_easily = item("item18TouchyEasily");

    data.functional_impact.work_impact = s("workImpact");
    data.functional_impact.relationship_impact = s("relationshipImpact");
    data.functional_impact.daily_activities_impact = s("dailyActivitiesImpact");
    data.functional_impact.sleep_impact = s("sleepImpact");
    data.functional_impact.notes = s("notes");

    data.risk_screen.suicidal_ideation = s("suicidalIdeation");
    data.risk_screen.suicidal_ideation_details = s("suicidalIdeationDetails");
    data.risk_screen.self_harm = s("selfHarm");
    data.risk_screen.harm_to_others = s("harmToOthers");
    data.risk_screen.psychiatric_emergency_history = s("psychiatricEmergencyHistory");
    data.risk_screen.has_safety_plan = s("hasSafetyPlan");

    data.support_and_history.previous_mental_health_care = s("previousMentalHealthCare");
    data.support_and_history.previous_mental_health_details = s("previousMentalHealthDetails");
    data.support_and_history.currently_in_treatment = s("currentlyInTreatment");
    data.support_and_history.current_treatment_details = s("currentTreatmentDetails");
    data.support_and_history.current_medications = s("currentMedications");
    data.support_and_history.family_mental_health_history = s("familyMentalHealthHistory");
    data.support_and_history.family_mental_health_details = s("familyMentalHealthDetails");
    data.support_and_history.social_support = s("socialSupport");
    data.support_and_history.substance_use_concern = s("substanceUseConcern");

    data
}

/// Render a Tera template and return an HTML response (or 500 on error).
fn render(tera: &Tera, template: &str, context: &Context) -> Response {
    match tera.render(template, context) {
        Ok(html) => Html(html).into_response(),
        Err(e) => {
            tracing::error!("Template error rendering {template}: {e}");
            (
                axum::http::StatusCode::INTERNAL_SERVER_ERROR,
                format!("Template error: {e}"),
            )
                .into_response()
        }
    }
}

pub fn router() -> Router {
    Router::new()
        .route("/", get(landing))
        .route("/assessment/new", post(new_assessment))
        .route("/assessment/{id}", get(show))
        .route("/assessment/{id}/submit", post(submit))
        .route("/assessment/{id}/report", get(report))
}
