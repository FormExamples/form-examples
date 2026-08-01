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
            ("status", ColType::StringWithDefault("draft".to_string())),
            ("reported_at", ColType::TimestampWithTimeZone),
            ("discovered_at", ColType::TimestampWithTimeZoneNull),
            ("started_at", ColType::TimestampWithTimeZoneNull),
            ("resolved_at", ColType::TimestampWithTimeZoneNull),
            ("issue_category", ColType::StringWithDefault(String::new())),
            ("environment", ColType::StringWithDefault(String::new())),
            ("system_name", ColType::StringWithDefault(String::new())),
            ("component", ColType::StringWithDefault(String::new())),
            ("customer_or_project_tag", ColType::StringWithDefault(String::new())),
            ("external_reference", ColType::StringWithDefault(String::new())),
            ("cc_summary", ColType::StringWithDefault(String::new())),
            ("cc_long_description", ColType::TextWithDefault(String::new())),
            ("cc_reported_by_name", ColType::StringWithDefault(String::new())),
            ("cc_reported_via", ColType::StringWithDefault(String::new())),
            ("pt_discoverer_name", ColType::StringWithDefault(String::new())),
            ("pt_affected_users_count", ColType::IntegerNull),
            ("pt_affected_user_groups", ColType::StringWithDefault(String::new())),
            ("pt_assignees", ColType::StringWithDefault(String::new())),
            ("pt_stakeholders_to_inform", ColType::StringWithDefault(String::new())),
            ("pt_observers", ColType::StringWithDefault(String::new())),
            ("sx_external_signals", ColType::TextWithDefault(String::new())),
            ("sx_alert_ids", ColType::StringWithDefault(String::new())),
            ("sx_error_messages", ColType::TextWithDefault(String::new())),
            ("sx_screenshots_url", ColType::StringWithDefault(String::new())),
            ("sx_logs_url", ColType::StringWithDefault(String::new())),
            ("sx_first_observed_at", ColType::TimestampWithTimeZoneNull),
            ("fx_broken_components", ColType::TextWithDefault(String::new())),
            ("fx_failed_services", ColType::StringWithDefault(String::new())),
            ("fx_stuck_processes", ColType::StringWithDefault(String::new())),
            ("fx_hardware_faults", ColType::StringWithDefault(String::new())),
            ("fx_data_corruption", ColType::StringWithDefault(String::new())),
            ("hx_related_issues", ColType::StringWithDefault(String::new())),
            ("hx_prior_occurrences", ColType::IntegerNull),
            ("hx_recent_change_url", ColType::StringWithDefault(String::new())),
            ("hx_references", ColType::TextWithDefault(String::new())),
            ("hx_timeline", ColType::TextWithDefault(String::new())),
            ("ix_hypotheses", ColType::TextWithDefault(String::new())),
            ("ix_repro_steps", ColType::TextWithDefault(String::new())),
            ("ix_diagnostic_queries", ColType::TextWithDefault(String::new())),
            ("ix_tests_run", ColType::StringWithDefault(String::new())),
            ("ix_blocking_unknowns", ColType::TextWithDefault(String::new())),
            ("dx_root_cause", ColType::TextWithDefault(String::new())),
            ("dx_contributing_causes", ColType::TextWithDefault(String::new())),
            ("dx_scope", ColType::StringWithDefault(String::new())),
            ("dx_confirmed", ColType::StringWithDefault(String::new())),
            ("tx_mitigation_steps", ColType::TextWithDefault(String::new())),
            ("tx_fix_plan", ColType::TextWithDefault(String::new())),
            ("tx_workaround", ColType::TextWithDefault(String::new())),
            ("tx_rollback_plan", ColType::TextWithDefault(String::new())),
            ("tx_communication_plan", ColType::StringWithDefault(String::new())),
            ("px_expected_resolution_at", ColType::TimestampWithTimeZoneNull),
            ("px_residual_risk", ColType::TextWithDefault(String::new())),
            ("px_monitoring_plan", ColType::TextWithDefault(String::new())),
            ("px_recurrence_likelihood", ColType::StringWithDefault(String::new())),
            ("px_lessons_learned", ColType::TextWithDefault(String::new())),
            ("score_by_priority_rank", ColType::IntegerNull),
            ("score_by_severity_of_impact", ColType::IntegerNull),
            ("score_by_magnitude_of_damage", ColType::IntegerNull),
            ("score_by_harm_grade", ColType::IntegerNull),
            ("score_by_failure_condition", ColType::StringWithDefault(String::new())),
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
