use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "okr_objectives",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::Text),
            ("level", ColType::Text),
            ("cycle", ColType::Text),
            ("cycle_start_date", ColType::DateNull),
            ("cycle_end_date", ColType::DateNull),
            ("team_or_org_name", ColType::Text),
            ("strategic_theme", ColType::Text),
            ("external_reference", ColType::Text),
            ("obj_title", ColType::Text),
            ("obj_long_description", ColType::Text),
            ("sa_parent_summary", ColType::Text),
            ("sa_business_value_statement", ColType::Text),
            ("in_initiatives", ColType::Text),
            ("in_supporting_links", ColType::Text),
            ("rk_known_risks", ColType::Text),
            ("rk_dependencies", ColType::Text),
            ("rk_blockers", ColType::Text),
            ("rk_mitigation_plans", ColType::Text),
            ("fc_expected_end_state", ColType::Text),
            ("fc_residual_risk", ColType::Text),
            ("score_by_progress_percent", ColType::DoubleNull),
            ("score_by_confidence_decile", ColType::IntegerNull),
            ("score_by_stretch_tier", ColType::IntegerNull),
            ("score_by_alignment_grade", ColType::IntegerNull),
            ("score_by_impact_tier", ColType::IntegerNull),
            ("score_by_smart_quality", ColType::IntegerNull),
            ("score_by_pace_deviation_percent", ColType::DoubleNull),
            ],
            &[
            ("reporter", ""),
            ("okr_objective?", "parent_objective_id"),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "okr_objectives").await
    }
}
