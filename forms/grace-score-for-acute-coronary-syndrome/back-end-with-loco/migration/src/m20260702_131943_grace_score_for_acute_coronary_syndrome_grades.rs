use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "grace_score_for_acute_coronary_syndrome_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("grace_score", ColType::IntegerNull),
            ("in_hospital_risk_band", ColType::StringWithDefault(String::new())),
            ("six_month_risk_band", ColType::StringWithDefault(String::new())),
            ("overall_band", ColType::StringWithDefault(String::new())),
            ("invasive_strategy", ColType::TextWithDefault(String::new())),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("grace_score_for_acute_coronary_syndrome", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "grace_score_for_acute_coronary_syndrome_grades").await
    }
}
