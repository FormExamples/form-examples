use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "issue_trackers",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::String),
            ("reported_at", ColType::TimestampWithTimeZone),
            ("discovered_at", ColType::TimestampWithTimeZoneNull),
            ("started_at", ColType::TimestampWithTimeZoneNull),
            ("resolved_at", ColType::TimestampWithTimeZoneNull),
            ("issue_category", ColType::String),
            ("environment", ColType::String),
            ("system_name", ColType::String),
            ("component", ColType::String),
            ("customer_or_project_tag", ColType::String),
            ("external_reference", ColType::String),
            ("cc_summary", ColType::String),
            ("cc_long_description", ColType::Text),
            ("cc_reported_by_name", ColType::String),
            ("cc_reported_via", ColType::String),
            ("pt_discoverer_name", ColType::String),
            ("pt_affected_users_count", ColType::IntegerNull),
            ("pt_affected_user_groups", ColType::String),
            ("pt_assignees", ColType::String),
            ("pt_stakeholders_to_inform", ColType::String),
            ("pt_observers", ColType::String),
            ("sx_external_signals", ColType::Text),
            ("sx_alert_ids", ColType::String),
            ("sx_error_messages", ColType::Text),
            ("sx_screenshots_url", ColType::String),
            ("sx_logs_url", ColType::String),
            ("sx_first_observed_at", ColType::TimestampWithTimeZoneNull),
            ("fx_broken_components", ColType::Text),
            ("fx_failed_services", ColType::String),
            ("fx_stuck_processes", ColType::String),
            ("fx_hardware_faults", ColType::String),
            ("fx_data_corruption", ColType::String),
            ("hx_related_issues", ColType::String),
            ("hx_prior_occurrences", ColType::IntegerNull),
            ("hx_recent_change_url", ColType::String),
            ("hx_references", ColType::Text),
            ("hx_timeline", ColType::Text),
            ("ix_hypotheses", ColType::Text),
            ("ix_repro_steps", ColType::Text),
            ("ix_diagnostic_queries", ColType::Text),
            ("ix_tests_run", ColType::String),
            ("ix_blocking_unknowns", ColType::Text),
            ("dx_root_cause", ColType::Text),
            ("dx_contributing_causes", ColType::Text),
            ("dx_scope", ColType::String),
            ("dx_confirmed", ColType::String),
            ("tx_mitigation_steps", ColType::Text),
            ("tx_fix_plan", ColType::Text),
            ("tx_workaround", ColType::Text),
            ("tx_rollback_plan", ColType::Text),
            ("tx_communication_plan", ColType::String),
            ("px_expected_resolution_at", ColType::TimestampWithTimeZoneNull),
            ("px_residual_risk", ColType::Text),
            ("px_monitoring_plan", ColType::Text),
            ("px_recurrence_likelihood", ColType::String),
            ("px_lessons_learned", ColType::Text),
            ("score_by_priority_rank", ColType::IntegerNull),
            ("score_by_severity_of_impact", ColType::IntegerNull),
            ("score_by_magnitude_of_damage", ColType::IntegerNull),
            ("score_by_harm_grade", ColType::IntegerNull),
            ("score_by_failure_condition", ColType::String),
            ("score_by_moscow_requirement", ColType::IntegerNull),
            ("score_by_frequency_percent", ColType::DoubleNull),
            ],
            &[
            ("reporter", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "issue_trackers").await
    }
}
