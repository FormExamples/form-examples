use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "perioperative_optimization_grades",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("weeks_to_surgery", ColType::IntegerNull),
            ("gating_applied", ColType::BooleanWithDefault(false)),
            ("must_score", ColType::IntegerNull),
            ("must_risk", ColType::StringWithDefault(String::new())),
            ("audit_c_score", ColType::IntegerNull),
            ("stop_bang_score", ColType::IntegerNull),
            ("duke_activity_status_index", ColType::DoubleNull),
            ("clinical_frailty_scale", ColType::IntegerNull),
            ("domains_optimised", ColType::IntegerNull),
            ("domains_in_progress", ColType::IntegerNull),
            ("domains_action_required", ColType::IntegerNull),
            ("domains_insufficient_time", ColType::IntegerNull),
            ("computed_readiness", ColType::StringWithDefault(String::new())),
            ("final_readiness", ColType::StringWithDefault(String::new())),
            ("override_reason", ColType::StringWithDefault(String::new())),
            ("gate_decision", ColType::StringWithDefault(String::new())),
            ("recommended_earliest_surgery_date", ColType::DateNull),
            ("clinician_notes", ColType::TextWithDefault(String::new())),
            ("signed_by_name", ColType::StringWithDefault(String::new())),
            ("signed_at", ColType::TimestampWithTimeZoneNull),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("perioperative_optimization", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "perioperative_optimization_grades").await
    }
}
