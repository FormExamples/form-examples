use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "grades",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("balance_score", ColType::IntegerWithDefault(0)),
            ("gait_score", ColType::IntegerWithDefault(0)),
            ("total_tinetti_score", ColType::IntegerWithDefault(0)),
            ("fall_risk_category", ColType::StringWithDefault(String::new())),
            ("tug_time_seconds", ColType::DoubleNull),
            ("tug_risk_category", ColType::StringWithDefault(String::new())),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("assessment", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "grades").await
    }
}
