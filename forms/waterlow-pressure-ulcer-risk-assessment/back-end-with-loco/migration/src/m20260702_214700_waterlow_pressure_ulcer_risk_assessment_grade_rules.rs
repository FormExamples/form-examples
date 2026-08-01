use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "waterlow_pressure_ulcer_risk_assessment_grade_rules",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("rule_id", ColType::String),
            ("category", ColType::String),
            ("points", ColType::IntegerNull),
            ("label", ColType::StringWithDefault(String::new())),
            ("description", ColType::StringWithDefault(String::new())),
            ],
            &[
            ("waterlow_pressure_ulcer_risk_assessment_grade", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "waterlow_pressure_ulcer_risk_assessment_grade_rules").await
    }
}
