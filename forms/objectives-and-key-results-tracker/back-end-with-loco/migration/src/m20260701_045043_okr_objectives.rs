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
            ("status", ColType::TextWithDefault("draft".to_string())),
            ("level", ColType::TextWithDefault(String::new())),
            ("cycle", ColType::TextWithDefault(String::new())),
            ("cycle_start_date", ColType::DateNull),
            ("cycle_end_date", ColType::DateNull),
            ("team_or_org_name", ColType::TextWithDefault(String::new())),
            ("strategic_theme", ColType::TextWithDefault(String::new())),
            ("external_reference", ColType::TextWithDefault(String::new())),
            ("obj_title", ColType::TextWithDefault(String::new())),
            ("obj_long_description", ColType::TextWithDefault(String::new())),
            ("sa_parent_summary", ColType::TextWithDefault(String::new())),
            ("sa_business_value_statement", ColType::TextWithDefault(String::new())),
            ("in_initiatives", ColType::TextWithDefault(String::new())),
            ("in_supporting_links", ColType::TextWithDefault(String::new())),
            ("rk_known_risks", ColType::TextWithDefault(String::new())),
            ("rk_dependencies", ColType::TextWithDefault(String::new())),
            ("rk_blockers", ColType::TextWithDefault(String::new())),
            ("rk_mitigation_plans", ColType::TextWithDefault(String::new())),
            ("fc_expected_end_state", ColType::TextWithDefault(String::new())),
            ("fc_residual_risk", ColType::TextWithDefault(String::new())),
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
