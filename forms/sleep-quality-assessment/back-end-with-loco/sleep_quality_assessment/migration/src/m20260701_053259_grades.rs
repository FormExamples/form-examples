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
            ("psqi_global_score", ColType::IntegerNull),
            ("psqi_component1_subjective_quality", ColType::IntegerNull),
            ("psqi_component2_sleep_latency", ColType::IntegerNull),
            ("psqi_component3_sleep_duration", ColType::IntegerNull),
            ("psqi_component4_sleep_efficiency", ColType::IntegerNull),
            ("psqi_component5_sleep_disturbances", ColType::IntegerNull),
            ("psqi_component6_sleep_medication", ColType::IntegerNull),
            ("psqi_component7_daytime_dysfunction", ColType::IntegerNull),
            ("sleep_quality_category", ColType::String),
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
