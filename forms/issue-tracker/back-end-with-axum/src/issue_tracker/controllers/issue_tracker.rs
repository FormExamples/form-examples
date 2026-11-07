#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::issue_trackers::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub reporter_id: Uuid,
    pub status: String,
    pub reported_at: DateTimeWithTimeZone,
    pub discovered_at: Option<DateTimeWithTimeZone>,
    pub started_at: Option<DateTimeWithTimeZone>,
    pub resolved_at: Option<DateTimeWithTimeZone>,
    pub issue_category: String,
    pub environment: String,
    pub system_name: String,
    pub component: String,
    pub customer_or_project_tag: String,
    pub external_reference: String,
    pub cc_summary: String,
    pub cc_long_description: String,
    pub cc_reported_by_name: String,
    pub cc_reported_via: String,
    pub pt_discoverer_name: String,
    pub pt_affected_users_count: Option<i32>,
    pub pt_affected_user_groups: String,
    pub pt_assignees: String,
    pub pt_stakeholders_to_inform: String,
    pub pt_observers: String,
    pub sx_external_signals: String,
    pub sx_alert_ids: String,
    pub sx_error_messages: String,
    pub sx_screenshots_url: String,
    pub sx_logs_url: String,
    pub sx_first_observed_at: Option<DateTimeWithTimeZone>,
    pub fx_broken_components: String,
    pub fx_failed_services: String,
    pub fx_stuck_processes: String,
    pub fx_hardware_faults: String,
    pub fx_data_corruption: String,
    pub hx_related_issues: String,
    pub hx_prior_occurrences: Option<i32>,
    pub hx_recent_change_url: String,
    pub hx_references: String,
    pub hx_timeline: String,
    pub ix_hypotheses: String,
    pub ix_repro_steps: String,
    pub ix_diagnostic_queries: String,
    pub ix_tests_run: String,
    pub ix_blocking_unknowns: String,
    pub dx_root_cause: String,
    pub dx_contributing_causes: String,
    pub dx_scope: String,
    pub dx_confirmed: String,
    pub tx_mitigation_steps: String,
    pub tx_fix_plan: String,
    pub tx_workaround: String,
    pub tx_rollback_plan: String,
    pub tx_communication_plan: String,
    pub px_expected_resolution_at: Option<DateTimeWithTimeZone>,
    pub px_residual_risk: String,
    pub px_monitoring_plan: String,
    pub px_recurrence_likelihood: String,
    pub px_lessons_learned: String,
    pub score_by_priority_rank: Option<i32>,
    pub score_by_severity_of_impact: Option<i32>,
    pub score_by_magnitude_of_damage: Option<i32>,
    pub score_by_harm_grade: Option<i32>,
    pub score_by_failure_condition: String,
    pub score_by_moscow_requirement: Option<i32>,
    pub score_by_frequency_percent: Option<f64>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO issue_trackers (reporter_id, status, reported_at, discovered_at, \
            started_at, resolved_at, issue_category, environment, system_name, \
            component, customer_or_project_tag, external_reference, cc_summary, \
            cc_long_description, cc_reported_by_name, cc_reported_via, \
            pt_discoverer_name, pt_affected_users_count, pt_affected_user_groups, \
            pt_assignees, pt_stakeholders_to_inform, pt_observers, sx_external_signals, \
            sx_alert_ids, sx_error_messages, sx_screenshots_url, sx_logs_url, \
            sx_first_observed_at, fx_broken_components, fx_failed_services, \
            fx_stuck_processes, fx_hardware_faults, fx_data_corruption, \
            hx_related_issues, hx_prior_occurrences, hx_recent_change_url, \
            hx_references, hx_timeline, ix_hypotheses, ix_repro_steps, \
            ix_diagnostic_queries, ix_tests_run, ix_blocking_unknowns, dx_root_cause, \
            dx_contributing_causes, dx_scope, dx_confirmed, tx_mitigation_steps, \
            tx_fix_plan, tx_workaround, tx_rollback_plan, tx_communication_plan, \
            px_expected_resolution_at, px_residual_risk, px_monitoring_plan, \
            px_recurrence_likelihood, px_lessons_learned, score_by_priority_rank, \
            score_by_severity_of_impact, score_by_magnitude_of_damage, \
            score_by_harm_grade, score_by_failure_condition, \
            score_by_moscow_requirement, score_by_frequency_percent) VALUES ($1, $2, $3, \
            $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, \
            $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, \
            $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, \
            $50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, $61, $62, $63, $64) \
            RETURNING *",
        )
        .bind(self.reporter_id)
        .bind(&self.status)
        .bind(self.reported_at)
        .bind(self.discovered_at)
        .bind(self.started_at)
        .bind(self.resolved_at)
        .bind(&self.issue_category)
        .bind(&self.environment)
        .bind(&self.system_name)
        .bind(&self.component)
        .bind(&self.customer_or_project_tag)
        .bind(&self.external_reference)
        .bind(&self.cc_summary)
        .bind(&self.cc_long_description)
        .bind(&self.cc_reported_by_name)
        .bind(&self.cc_reported_via)
        .bind(&self.pt_discoverer_name)
        .bind(self.pt_affected_users_count)
        .bind(&self.pt_affected_user_groups)
        .bind(&self.pt_assignees)
        .bind(&self.pt_stakeholders_to_inform)
        .bind(&self.pt_observers)
        .bind(&self.sx_external_signals)
        .bind(&self.sx_alert_ids)
        .bind(&self.sx_error_messages)
        .bind(&self.sx_screenshots_url)
        .bind(&self.sx_logs_url)
        .bind(self.sx_first_observed_at)
        .bind(&self.fx_broken_components)
        .bind(&self.fx_failed_services)
        .bind(&self.fx_stuck_processes)
        .bind(&self.fx_hardware_faults)
        .bind(&self.fx_data_corruption)
        .bind(&self.hx_related_issues)
        .bind(self.hx_prior_occurrences)
        .bind(&self.hx_recent_change_url)
        .bind(&self.hx_references)
        .bind(&self.hx_timeline)
        .bind(&self.ix_hypotheses)
        .bind(&self.ix_repro_steps)
        .bind(&self.ix_diagnostic_queries)
        .bind(&self.ix_tests_run)
        .bind(&self.ix_blocking_unknowns)
        .bind(&self.dx_root_cause)
        .bind(&self.dx_contributing_causes)
        .bind(&self.dx_scope)
        .bind(&self.dx_confirmed)
        .bind(&self.tx_mitigation_steps)
        .bind(&self.tx_fix_plan)
        .bind(&self.tx_workaround)
        .bind(&self.tx_rollback_plan)
        .bind(&self.tx_communication_plan)
        .bind(self.px_expected_resolution_at)
        .bind(&self.px_residual_risk)
        .bind(&self.px_monitoring_plan)
        .bind(&self.px_recurrence_likelihood)
        .bind(&self.px_lessons_learned)
        .bind(self.score_by_priority_rank)
        .bind(self.score_by_severity_of_impact)
        .bind(self.score_by_magnitude_of_damage)
        .bind(self.score_by_harm_grade)
        .bind(&self.score_by_failure_condition)
        .bind(self.score_by_moscow_requirement)
        .bind(self.score_by_frequency_percent)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE issue_trackers SET reporter_id = $2, status = $3, reported_at = $4, \
            discovered_at = $5, started_at = $6, resolved_at = $7, issue_category = $8, \
            environment = $9, system_name = $10, component = $11, \
            customer_or_project_tag = $12, external_reference = $13, cc_summary = $14, \
            cc_long_description = $15, cc_reported_by_name = $16, cc_reported_via = $17, \
            pt_discoverer_name = $18, pt_affected_users_count = $19, \
            pt_affected_user_groups = $20, pt_assignees = $21, pt_stakeholders_to_inform \
            = $22, pt_observers = $23, sx_external_signals = $24, sx_alert_ids = $25, \
            sx_error_messages = $26, sx_screenshots_url = $27, sx_logs_url = $28, \
            sx_first_observed_at = $29, fx_broken_components = $30, fx_failed_services = \
            $31, fx_stuck_processes = $32, fx_hardware_faults = $33, fx_data_corruption \
            = $34, hx_related_issues = $35, hx_prior_occurrences = $36, \
            hx_recent_change_url = $37, hx_references = $38, hx_timeline = $39, \
            ix_hypotheses = $40, ix_repro_steps = $41, ix_diagnostic_queries = $42, \
            ix_tests_run = $43, ix_blocking_unknowns = $44, dx_root_cause = $45, \
            dx_contributing_causes = $46, dx_scope = $47, dx_confirmed = $48, \
            tx_mitigation_steps = $49, tx_fix_plan = $50, tx_workaround = $51, \
            tx_rollback_plan = $52, tx_communication_plan = $53, \
            px_expected_resolution_at = $54, px_residual_risk = $55, px_monitoring_plan \
            = $56, px_recurrence_likelihood = $57, px_lessons_learned = $58, \
            score_by_priority_rank = $59, score_by_severity_of_impact = $60, \
            score_by_magnitude_of_damage = $61, score_by_harm_grade = $62, \
            score_by_failure_condition = $63, score_by_moscow_requirement = $64, \
            score_by_frequency_percent = $65, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.reporter_id)
        .bind(&self.status)
        .bind(self.reported_at)
        .bind(self.discovered_at)
        .bind(self.started_at)
        .bind(self.resolved_at)
        .bind(&self.issue_category)
        .bind(&self.environment)
        .bind(&self.system_name)
        .bind(&self.component)
        .bind(&self.customer_or_project_tag)
        .bind(&self.external_reference)
        .bind(&self.cc_summary)
        .bind(&self.cc_long_description)
        .bind(&self.cc_reported_by_name)
        .bind(&self.cc_reported_via)
        .bind(&self.pt_discoverer_name)
        .bind(self.pt_affected_users_count)
        .bind(&self.pt_affected_user_groups)
        .bind(&self.pt_assignees)
        .bind(&self.pt_stakeholders_to_inform)
        .bind(&self.pt_observers)
        .bind(&self.sx_external_signals)
        .bind(&self.sx_alert_ids)
        .bind(&self.sx_error_messages)
        .bind(&self.sx_screenshots_url)
        .bind(&self.sx_logs_url)
        .bind(self.sx_first_observed_at)
        .bind(&self.fx_broken_components)
        .bind(&self.fx_failed_services)
        .bind(&self.fx_stuck_processes)
        .bind(&self.fx_hardware_faults)
        .bind(&self.fx_data_corruption)
        .bind(&self.hx_related_issues)
        .bind(self.hx_prior_occurrences)
        .bind(&self.hx_recent_change_url)
        .bind(&self.hx_references)
        .bind(&self.hx_timeline)
        .bind(&self.ix_hypotheses)
        .bind(&self.ix_repro_steps)
        .bind(&self.ix_diagnostic_queries)
        .bind(&self.ix_tests_run)
        .bind(&self.ix_blocking_unknowns)
        .bind(&self.dx_root_cause)
        .bind(&self.dx_contributing_causes)
        .bind(&self.dx_scope)
        .bind(&self.dx_confirmed)
        .bind(&self.tx_mitigation_steps)
        .bind(&self.tx_fix_plan)
        .bind(&self.tx_workaround)
        .bind(&self.tx_rollback_plan)
        .bind(&self.tx_communication_plan)
        .bind(self.px_expected_resolution_at)
        .bind(&self.px_residual_risk)
        .bind(&self.px_monitoring_plan)
        .bind(&self.px_recurrence_likelihood)
        .bind(&self.px_lessons_learned)
        .bind(self.score_by_priority_rank)
        .bind(self.score_by_severity_of_impact)
        .bind(self.score_by_magnitude_of_damage)
        .bind(self.score_by_harm_grade)
        .bind(&self.score_by_failure_condition)
        .bind(self.score_by_moscow_requirement)
        .bind(self.score_by_frequency_percent)
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
        .prefix("api/issue_trackers/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
